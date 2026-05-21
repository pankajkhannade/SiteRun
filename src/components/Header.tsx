import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useApp } from "../context";

export function Header({
  title,
  showBack,
  showCart,
  onBack,
}: {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  onBack?: () => void;
}) {
  const { setScreen, cartCount } = useApp();

  return (
    <header className="shrink-0 px-4 py-3 bg-siterun-navy text-white flex items-center gap-3">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full active:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base truncate leading-tight">{title}</p>
      </div>
      {showCart && (
        <button
          type="button"
          onClick={() => setScreen("cart")}
          className="relative w-11 h-11 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20"
          aria-label="Cart"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-siterun-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      )}
    </header>
  );
}
