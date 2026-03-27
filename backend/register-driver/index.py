import json
import os
import pg8000.native as pg8000
from urllib.parse import urlparse


def handler(event: dict, context) -> dict:
    """Регистрирует нового водителя такси Роза Хутор в базе данных"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()
    car_brand = body.get("car_brand", "").strip()
    car_plate = body.get("car_plate", "").strip()
    lat = body.get("lat")
    lng = body.get("lng")
    geo_address = body.get("geo_address", "").strip()
    geo_confirmed = bool(body.get("geo_confirmed", False))

    if not name or not phone or not car_brand or not car_plate:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Имя, телефон, марка авто и гос. номер обязательны"}, ensure_ascii=False),
        }

    dsn = urlparse(os.environ["DATABASE_URL"])
    conn = pg8000.Connection(
        host=dsn.hostname,
        port=dsn.port or 5432,
        database=dsn.path.lstrip("/"),
        user=dsn.username,
        password=dsn.password,
        ssl_context=True,
    )

    existing = conn.run(
        "SELECT id FROM drivers WHERE phone = :phone OR car_plate = :plate",
        phone=phone,
        plate=car_plate.upper(),
    )
    if existing:
        conn.close()
        return {
            "statusCode": 409,
            "headers": headers,
            "body": json.dumps({"error": "Водитель с таким телефоном или номером авто уже зарегистрирован"}, ensure_ascii=False),
        }

    rows = conn.run(
        """INSERT INTO drivers (name, phone, email, car_brand, car_plate, lat, lng, geo_address, geo_confirmed)
           VALUES (:name, :phone, :email, :car_brand, :car_plate, :lat, :lng, :geo_address, :geo_confirmed) RETURNING id""",
        name=name,
        phone=phone,
        email=email or None,
        car_brand=car_brand,
        car_plate=car_plate.upper(),
        lat=lat,
        lng=lng,
        geo_address=geo_address or None,
        geo_confirmed=geo_confirmed,
    )
    driver_id = rows[0][0]
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"success": True, "driver_id": driver_id}, ensure_ascii=False),
    }