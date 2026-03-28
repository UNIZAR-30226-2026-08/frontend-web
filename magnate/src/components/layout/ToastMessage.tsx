import { useState, useEffect } from "react";
import { EventBus } from "@/EventBus";

interface ToastState {
  visible: boolean;
  message: string;
  exiting: boolean;
}

export function ToastMessage() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    exiting: false,
  });

  useEffect(() => {
    let hideTimeoutId: NodeJS.Timeout;
    let removeTimeoutId: NodeJS.Timeout;

    const handleShowToast = (data: { message: string; duration?: number }) => {
      clearTimeout(hideTimeoutId);
      clearTimeout(removeTimeoutId);
      
      setToast({
        visible: true,
        message: data.message,
        exiting: false,
      });

      hideTimeoutId = setTimeout(() => {
        setToast((prev) => ({ ...prev, exiting: true }));
        removeTimeoutId = setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false, exiting: false }));
        }, 300);
      }, data.duration || 3000);
    };

    EventBus.on("show-toast", handleShowToast);
    
    return () => {
      EventBus.off("show-toast", handleShowToast);
      clearTimeout(hideTimeoutId);
      clearTimeout(removeTimeoutId);
    };
  }, []);

  if (!toast.visible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none">
      <div
        className={`px-8 py-4 rounded-full shadow-2xl border-2 border-white/20 text-white font-bold text-lg md:text-xl tracking-wide whitespace-nowrap duration-300 ${
          toast.exiting 
            ? "animate-out fade-out slide-out-to-bottom-8 zoom-out-95" 
            : "animate-in fade-in slide-in-from-bottom-8 zoom-in-95"
        }`}
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {toast.message}
      </div>
    </div>
  );
}
