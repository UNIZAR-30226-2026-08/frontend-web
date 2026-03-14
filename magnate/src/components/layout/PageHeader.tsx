import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface PageHeaderProps {
  title: string
  showBackButton?: boolean
  onBack?: () => void
  position?: "fixed" | "absolute" | "relative"
}

export function PageHeader({ title, showBackButton=true, onBack, position="fixed" }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header 
      className={`${position} inset-x-0 top-0 z-50 border-b-4 border-border bg-[var(--color-primary)] px-4 grid grid-cols-3 items-center`}
      style={{ height: "var(--header-height, 120px)" }}
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="money-pattern"
            width="60"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-25)"
          >
            <image
              href="/icons/money.svg"
              width="50"
              height="50"
              preserveAspectRatio="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#money-pattern)" />
      </svg>

      <div className="flex justify-start overflow-visible">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={onBack || (() => navigate(-1))}
            aria-label="Go back"
            className="z-60 bg-[var(--color-black)] hover:bg-[var(--color-black)] rounded-full flex items-center justify-center ml-2 w-20 h-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] transform-gpu transition-transform duration-200 ease-in-out hover:scale-110"
          >
            <img
              src="/icons/back-arrow1.svg"
              className="w-12 h-12 sm:w-16 sm:h-16 block select-none"
              alt="Back"
            />
          </Button>
        )}
      </div>

      <div className="flex justify-center z-10">
        <h1 className="text-6xl text-white font-extrabold tracking-tight whitespace-nowrap select-none">
          {title}
        </h1>
      </div>

      <div></div>
    </header>
  )
}
