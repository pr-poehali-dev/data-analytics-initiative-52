import { useState } from "react"
import { LiquidMetalBackground } from "@/components/LiquidMetalBackground"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { Link } from "react-router-dom"

const REGISTER_URL = "https://functions.poehali.dev/a3fc01e0-8e5e-488f-b9b5-8dcfea87fc40"

interface FormData {
  name: string
  phone: string
  email: string
  car_brand: string
  car_plate: string
  lat: number | null
  lng: number | null
  geo_address: string
  geo_confirmed: boolean
}

export default function DriverRegister() {
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", email: "", car_brand: "", car_plate: "",
    lat: null, lng: null, geo_address: "", geo_confirmed: false,
  })
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleGeo = () => {
    if (!navigator.geolocation) {
      setGeoError("Геолокация не поддерживается браузером")
      return
    }
    setGeoLoading(true)
    setGeoError("")
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        let address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          if (data.display_name) address = data.display_name
        } catch (_e) { address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }
        setForm((prev) => ({
          ...prev, lat: latitude, lng: longitude,
          geo_address: address, geo_confirmed: true,
        }))
        setGeoLoading(false)
      },
      (err) => {
        setGeoError("Не удалось получить геолокацию. Разрешите доступ в настройках браузера.")
        setGeoLoading(false)
      },
      { timeout: 10000 }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.car_brand || !form.car_plate) return
    setStatus("loading")
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.status === 409) {
        setStatus("duplicate")
        setErrorMsg(data.error)
      } else if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMsg(data.error || "Ошибка регистрации")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Ошибка сети. Попробуйте позже.")
    }
  }

  return (
    <main className="relative min-h-screen overflow-auto">
      <LiquidMetalBackground />
      <div className="fixed inset-0 z-[5] bg-black/60" />

      {/* Шапка */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <Icon name="ArrowLeft" size={20} />
          <span className="font-open-sans-custom text-sm">На главную</span>
        </Link>
        <div className="flex items-center gap-2 text-white">
          <svg fill="none" height="1.5em" viewBox="0 0 24 24" width="1.5em" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8 2 5 5.5 5 9c0 5 7 13 7 13s7-8 7-13c0-3.5-3-7-7-7z" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,107,53,0.3)" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="rgba(42,91,163,0.4)"/>
          </svg>
          <span className="font-semibold font-open-sans-custom">Роза Такси</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-4 pb-16 pt-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="text-5xl">🚖</div>
              <h2 className="text-2xl font-bold text-white font-open-sans-custom">Заявка принята!</h2>
              <p className="text-gray-300 font-open-sans-custom text-sm leading-relaxed">
                Ваша заявка на регистрацию отправлена. Диспетчер свяжется с вами в течение рабочего дня для подтверждения.
              </p>
              <Link to="/">
                <Button className="mt-4 text-white font-open-sans-custom" style={{ background: "#FF6B35" }}>
                  На главную
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-white font-open-sans-custom [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)]">
                  Стать водителем
                </h1>
                <p className="mt-2 text-gray-400 font-open-sans-custom text-sm">
                  Заполните форму — мы свяжемся для подтверждения
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Личные данные */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 font-open-sans-custom mb-3">
                    Личные данные
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label className="text-white font-open-sans-custom text-sm">Имя и фамилия *</Label>
                    <Input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="Иван Петров"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-open-sans-custom"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-3">
                    <Label className="text-white font-open-sans-custom text-sm">Телефон для связи *</Label>
                    <Input
                      name="phone" type="tel" value={form.phone} onChange={handleChange} required
                      placeholder="+7 (900) 000-00-00"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-open-sans-custom"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-3">
                    <Label className="text-white font-open-sans-custom text-sm">Электронная почта</Label>
                    <Input
                      name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="example@mail.ru"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-open-sans-custom"
                    />
                  </div>
                </div>

                {/* Автомобиль */}
                <div className="space-y-1 border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 font-open-sans-custom mb-3">
                    Автомобиль
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label className="text-white font-open-sans-custom text-sm">Марка и модель *</Label>
                    <Input
                      name="car_brand" value={form.car_brand} onChange={handleChange} required
                      placeholder="Toyota Camry"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-open-sans-custom"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-3">
                    <Label className="text-white font-open-sans-custom text-sm">Государственный номер *</Label>
                    <Input
                      name="car_plate" value={form.car_plate} onChange={handleChange} required
                      placeholder="А123ВВ123"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-open-sans-custom uppercase"
                    />
                  </div>
                </div>

                {/* Геолокация */}
                <div className="border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 font-open-sans-custom mb-3">
                    Подтверждение геолокации
                  </p>
                  {form.geo_confirmed ? (
                    <div className="flex items-start gap-3 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
                      <Icon name="MapPin" size={18} className="text-green-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-green-400 font-open-sans-custom text-sm font-semibold">Геолокация подтверждена</p>
                        <p className="text-gray-400 font-open-sans-custom text-xs mt-1 leading-relaxed">{form.geo_address}</p>
                        <button
                          type="button" onClick={() => setForm((p) => ({ ...p, geo_confirmed: false, lat: null, lng: null, geo_address: "" }))}
                          className="text-xs text-gray-500 underline mt-2 hover:text-white transition-colors font-open-sans-custom"
                        >
                          Сбросить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-400 font-open-sans-custom text-sm">
                        Нажмите кнопку, чтобы определить ваше текущее местоположение. Это поможет нам назначить вам ближайшие заказы.
                      </p>
                      <Button
                        type="button" onClick={handleGeo} disabled={geoLoading}
                        className="w-full border border-white/20 bg-white/5 text-white hover:bg-white/10 font-open-sans-custom"
                        variant="outline"
                      >
                        {geoLoading ? (
                          <span className="flex items-center gap-2">
                            <Icon name="Loader2" size={16} className="animate-spin" />
                            Определяем...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Icon name="MapPin" size={16} />
                            Подтвердить геолокацию
                          </span>
                        )}
                      </Button>
                      {geoError && (
                        <p className="text-red-400 text-sm font-open-sans-custom">{geoError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Ошибки */}
                {(status === "error" || status === "duplicate") && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                    <p className="text-red-400 text-sm font-open-sans-custom">{errorMsg}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full text-white font-open-sans-custom font-semibold py-3 hover:opacity-90 transition-opacity"
                  style={{ background: "#FF6B35" }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Отправляем заявку...
                    </span>
                  ) : "Подать заявку"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}