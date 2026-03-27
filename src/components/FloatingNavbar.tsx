import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function FloatingNavbar() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <div className="mx-auto max-w-7xl rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollToSection("home")} className="cursor-pointer">
            <div className="flex items-center gap-2 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              <svg
                fill="none"
                height="1.75em"
                style={{ flexShrink: 0, lineHeight: 1 }}
                viewBox="0 0 24 24"
                width="1.75em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Роза Хутор Такси</title>
                <path d="M12 2C8 2 5 5.5 5 9c0 5 7 13 7 13s7-8 7-13c0-3.5-3-7-7-7z" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,107,53,0.3)" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="rgba(42,91,163,0.4)"/>
              </svg>
              <span className="font-semibold text-lg font-open-sans-custom tracking-tight">Роза Такси</span>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]"
            >
              Возможности
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]"
            >
              Тарифы
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]"
            >
              О сервисе
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]"
            >
              Контакты
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/driver-register"
              className="hidden md:block text-sm font-open-sans-custom text-gray-300 hover:text-white transition-colors [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]"
            >
              Стать водителем
            </Link>
            <a href="tel:+79186008160">
              <Button
                size="sm"
                className="font-open-sans-custom text-white"
                style={{ background: "#FF6B35" }}
              >
                Заказать такси
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}