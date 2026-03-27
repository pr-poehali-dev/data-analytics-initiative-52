import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта на email диспетчера такси Роза Хутор"""
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
    message = body.get("message", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Имя и телефон обязательны"}, ensure_ascii=False),
        }

    smtp_email = os.environ.get("SMTP_EMAIL", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    if not smtp_email or not smtp_password:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": "Почта не настроена"}, ensure_ascii=False),
        }

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка на такси — {name}"
    msg["From"] = smtp_email
    msg["To"] = smtp_email

    html = f"""
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <div style="border-bottom: 2px solid #FF6B35; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #FF6B35; margin: 0; font-size: 24px;">🚖 Новая заявка — Роза Такси</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #94a3b8; width: 120px;">Имя</td><td style="padding: 8px 0; font-weight: 600; color: #f1f5f9;">{name}</td></tr>
        <tr><td style="padding: 8px 0; color: #94a3b8;">Телефон</td><td style="padding: 8px 0; font-weight: 600; color: #FF6B35; font-size: 18px;">{phone}</td></tr>
        {"<tr><td style='padding: 8px 0; color: #94a3b8;'>Email</td><td style='padding: 8px 0; color: #f1f5f9;'>" + email + "</td></tr>" if email else ""}
        {"<tr><td style='padding: 8px 0; color: #94a3b8; vertical-align: top;'>Сообщение</td><td style='padding: 8px 0; color: #f1f5f9;'>" + message + "</td></tr>" if message else ""}
      </table>
      <div style="margin-top: 24px; padding: 12px; background: #1e293b; border-radius: 8px; font-size: 13px; color: #64748b;">
        Заявка отправлена с сайта rozataksi.ru
      </div>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    if "yandex" in smtp_email:
        smtp_host = "smtp.yandex.ru"
        smtp_port = 587

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, smtp_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"success": True, "message": "Заявка отправлена"}, ensure_ascii=False),
    }