import { LiquidMetalBackground } from "@/components/LiquidMetalBackground"
import { FloatingNavbar } from "@/components/FloatingNavbar"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Feature } from "@/components/ui/feature-with-advantages"
import { BentoPricing } from "@/components/ui/bento-pricing"
import { ContactCard } from "@/components/ui/contact-card"
import { AboutQuote } from "@/components/ui/about-quote"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

const DISPATCHER_PHONE = "+78620000000"
const DISPATCHER_PHONE_DISPLAY = "+7 (862) 000-00-00"
const SEND_URL = "https://functions.poehali.dev/5f1abdfb-46eb-4852-8824-25ea22887dac"

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const pricingSectionRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    setFormStatus("loading")
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        setFormStatus("error")
      }
    } catch {
      setFormStatus("error")
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY
      const currentScroll = scrollContainer.scrollLeft
      const containerWidth = scrollContainer.offsetWidth
      const currentSection = Math.round(currentScroll / containerWidth)

      if (currentSection === 2 && pricingSectionRef.current) {
        const pricingSection = pricingSectionRef.current
        const isAtTop = pricingSection.scrollTop === 0
        const isAtBottom = pricingSection.scrollTop + pricingSection.clientHeight >= pricingSection.scrollHeight - 1
        if (delta > 0 && !isAtBottom) return
        if (delta < 0 && !isAtTop) return
        if (delta < 0 && isAtTop) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 1 * containerWidth, behavior: "smooth" })
          return
        }
        if (delta > 0 && isAtBottom) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 3 * containerWidth, behavior: "smooth" })
          return
        }
      }

      if (currentSection === 3 && aboutSectionRef.current) {
        const aboutSection = aboutSectionRef.current
        const isAtTop = aboutSection.scrollTop === 0
        const isAtBottom = aboutSection.scrollTop + aboutSection.clientHeight >= aboutSection.scrollHeight - 1
        if (delta > 0 && !isAtBottom) return
        if (delta < 0 && !isAtTop) return
        if (delta < 0 && isAtTop) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 2 * containerWidth, behavior: "smooth" })
          return
        }
        if (delta > 0 && isAtBottom) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 4 * containerWidth, behavior: "smooth" })
          return
        }
      }

      if (currentSection === 4 && contactSectionRef.current) {
        const contactSection = contactSectionRef.current
        const isAtTop = contactSection.scrollTop === 0
        const isAtBottom = contactSection.scrollTop + contactSection.clientHeight >= contactSection.scrollHeight - 1
        if (delta > 0 && !isAtBottom) return
        if (delta < 0 && !isAtTop) return
        if (delta < 0 && isAtTop) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 3 * containerWidth, behavior: "smooth" })
          return
        }
        if (delta > 0 && isAtBottom) {
          e.preventDefault()
          return
        }
      }

      e.preventDefault()
      if (Math.abs(delta) > 10) {
        let targetSection = currentSection
        if (delta > 0) targetSection = Math.min(currentSection + 1, 4)
        else targetSection = Math.max(currentSection - 1, 0)
        scrollContainer.scrollTo({ left: targetSection * containerWidth, behavior: "smooth" })
      }
    }

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false })
    return () => scrollContainer.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <main className="relative h-screen overflow-hidden">
      <LiquidMetalBackground />
      <div className="fixed inset-0 z-[5] bg-black/50" />
      <FloatingNavbar />

      <div
        ref={scrollContainerRef}
        className="relative z-10 flex h-screen w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* HERO */}
        <section id="home" className="flex min-w-full snap-start items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center px-0 leading-5">
              <h1 className="mb-8 text-balance text-5xl tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] md:text-6xl lg:text-8xl">
                <span className="font-open-sans-custom not-italic">Роза Хутор.</span>{" "}
                <span className="font-serif italic">Сочи.</span>{" "}
                <span className="font-open-sans-custom not-italic">Везде.</span>
              </h1>
              <p className="mb-10 mx-auto max-w-2xl text-pretty leading-relaxed text-gray-300 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-thin font-open-sans-custom tracking-wide text-xl">
                такси по курорту и всему Сочи — заказывай с любого устройства,{" "}
                <span className="font-serif italic">отслеживай</span> машину онлайн и плати картой
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href={`tel:${DISPATCHER_PHONE}`}>
                  <ShinyButton className="px-8 py-3 text-base">заказать такси</ShinyButton>
                </a>
                <a href={`tel:${DISPATCHER_PHONE}`}>
                  <button
                    className="px-8 py-3 text-base rounded-lg font-open-sans-custom text-white border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    {DISPATCHER_PHONE_DISPLAY}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="flex min-w-full snap-start items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-7xl w-full">
            <Feature />
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          ref={pricingSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30",
            )}
          />
          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
                Тарифы и маршруты
              </h1>
              <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
                Эконом, комфорт или минивэн — выберите класс авто под свои задачи. Популярные маршруты и фиксированные цены.
              </p>
            </div>
            <BentoPricing />
          </div>
        </section>

        {/* ABOUT + MAP */}
        <section
          id="about"
          ref={aboutSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30",
            )}
          />
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
                О сервисе
              </h1>
              <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
                Роза Такси — экосистема трансфера для курорта и города, доступная с любого устройства.
              </p>
            </div>
            <AboutQuote />

            {/* Карта маршрутов */}
            <div className="mt-8 overflow-hidden rounded-xl border-2 border-white/10">
              <div className="px-4 py-3 bg-white/5 backdrop-blur-sm border-b border-white/10">
                <p className="text-white font-open-sans-custom text-sm font-semibold">Карта маршрутов — Роза Хутор и Сочи</p>
              </div>
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=40.0000%2C43.6900&z=10&pt=39.9462%2C43.6784%2CРоза+Хутор~39.7241%2C43.5992%2CАэропорт+Сочи~39.7178%2C43.5958%2CЖД+вокзал+Адлер~39.7253%2C43.6043%2CАдлер~39.7597%2C43.6098%2CКудепста~39.8061%2C43.6039%2CЦентральный+Сочи&l=map"
                width="100%"
                height="340"
                frameBorder="0"
                allowFullScreen
                style={{ border: 0, display: "block" }}
                title="Карта маршрутов такси Роза Хутор"
              />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          ref={contactSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30",
            )}
          />
          <div className="relative z-10 mx-auto w-full max-w-5xl mt-[5vh]">
            <ContactCard
              title="Заказать трансфер"
              description="Хотите забронировать поездку заранее или нужна помощь? Оставьте заявку — перезвоним в течение 10 минут и подберём машину под ваш маршрут."
              contactInfo={[
                { icon: MailIcon, label: "Почта", value: "taxi@roza-hutor.ru" },
                { icon: PhoneIcon, label: "Диспетчер 24/7", value: DISPATCHER_PHONE_DISPLAY },
                { icon: MapPinIcon, label: "Курорт", value: "Роза Хутор, Сочи", className: "col-span-2" },
              ]}
            >
              {formStatus === "success" ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                  <div className="text-4xl">✅</div>
                  <p className="text-white font-open-sans-custom text-lg font-semibold">Заявка отправлена!</p>
                  <p className="text-gray-300 font-open-sans-custom text-sm">
                    Перезвоним вам в течение 10 минут.
                  </p>
                  <button
                    onClick={() => setFormStatus("idle")}
                    className="text-sm text-gray-400 underline hover:text-white transition-colors font-open-sans-custom"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="w-full space-y-4 p-1">
                  <div className="flex flex-col gap-2">
                    <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                      Имя *
                    </Label>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Иван"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                      Телефон *
                    </Label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="+7 (900) 000-00-00"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                      Email
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="example@mail.ru"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                      Маршрут / комментарий
                    </Label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Роза Хутор → Аэропорт, 2 чел., лыжи"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 resize-none"
                      rows={3}
                    />
                  </div>
                  {formStatus === "error" && (
                    <p className="text-red-400 text-sm font-open-sans-custom">
                      Ошибка отправки. Позвоните нам напрямую.
                    </p>
                  )}
                  <Button
                    className="w-full text-white font-open-sans-custom hover:opacity-90 transition-opacity"
                    style={{ background: "#FF6B35" }}
                    type="submit"
                    disabled={formStatus === "loading"}
                  >
                    {formStatus === "loading" ? "Отправляем..." : "Отправить заявку"}
                  </Button>
                </form>
              )}
            </ContactCard>
          </div>
        </section>
      </div>
    </main>
  )
}
