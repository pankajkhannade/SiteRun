import { Minus, Plus } from "lucide-react";
import { CATEGORIES, getProduct, JOB_TYPE_PRODUCT_IDS, PRODUCTS } from "../data";
import type { Product } from "../types";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { categoryLabel, matchesSearch, productName } from "../i18n/labels";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";

export function CatalogScreen() {
  const {
    catalogCategory,
    setCatalogCategory,
    setScreen,
    cart,
    addToCart,
    setCartQty,
    searchQuery,
    setSearchQuery,
    locale,
    activeJob,
    requireActiveJob,
  } = useApp();
  const { t } = useTranslation();

  if (!activeJob) {
    return (
      <div className="flex flex-col h-full">
        <Header title={t("materials")} showBack onBack={() => setScreen("home")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-siterun-navy font-semibold">{t("orderNeedsJob")}</p>
          <button
            type="button"
            onClick={() => requireActiveJob()}
            className="mt-4 py-3 px-6 rounded-2xl bg-siterun-orange text-white font-semibold"
          >
            {t("startJob")}
          </button>
        </div>
      </div>
    );
  }

  const categoryProducts = catalogCategory
    ? PRODUCTS.filter((p) => p.category === catalogCategory)
    : PRODUCTS;

  const filtered = categoryProducts.filter((p) => matchesSearch(p, searchQuery));

  const getQty = (id: string) => cart.find((i) => i.productId === id)?.qty ?? 0;

  if (!catalogCategory) {
    return (
      <div className="flex flex-col h-full">
        <Header title={t("materials")} showBack showCart onBack={() => setScreen("home")} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        {searchQuery ? (
          <ProductList
            products={PRODUCTS.filter((p) => matchesSearch(p, searchQuery))}
            getQty={getQty}
            addToCart={addToCart}
            setCartQty={setCartQty}
            locale={locale}
            emptyLabel={t("noResults")}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <RecommendedStrip
              jobType={activeJob.type}
              locale={locale}
              getQty={getQty}
              addToCart={addToCart}
              setCartQty={setCartQty}
              label={t("recommendedForJob")}
            />
            <div className="p-4 grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCatalogCategory(cat.id)}
                disabled={cat.id === "electrical" || cat.id === "paint"}
                className={`p-5 rounded-2xl border-2 text-center active:scale-[0.98] ${
                  cat.id === "electrical" || cat.id === "paint"
                    ? "opacity-40 border-slate-100"
                    : "border-slate-200 bg-white active:border-siterun-orange"
                }`}
              >
                <span className="text-4xl block mb-2">{cat.emoji}</span>
                <span className="font-bold text-siterun-navy block">{categoryLabel(cat.id, locale)}</span>
                {(cat.id === "electrical" || cat.id === "paint") && (
                  <span className="text-[10px] text-siterun-slate block mt-1">{t("soon")}</span>
                )}
              </button>
            ))}
            </div>
          </div>
        )}
        {cart.length > 0 && <CartFooter />}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title={categoryLabel(catalogCategory as (typeof CATEGORIES)[number]["id"], locale)}
        showBack
        showCart
        onBack={() => {
          setSearchQuery("");
          setCatalogCategory(null);
        }}
      />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      {!searchQuery && (
        <RecommendedStrip
          jobType={activeJob.type}
          locale={locale}
          getQty={getQty}
          addToCart={addToCart}
          setCartQty={setCartQty}
          label={t("recommendedForJob")}
        />
      )}
      <ProductList
        products={filtered}
        getQty={getQty}
        addToCart={addToCart}
        setCartQty={setCartQty}
        locale={locale}
        emptyLabel={t("noResults")}
      />
      {cart.length > 0 && <CartFooter />}
    </div>
  );
}

function ProductList({
  products,
  getQty,
  addToCart,
  setCartQty,
  locale,
  emptyLabel,
}: {
  products: typeof PRODUCTS;
  getQty: (id: string) => number;
  addToCart: (id: string) => void;
  setCartQty: (id: string, qty: number) => void;
  locale: import("../types").Locale;
  emptyLabel: string;
}) {
  if (products.length === 0) {
    return (
      <p className="flex-1 flex items-center justify-center text-siterun-slate text-sm px-4">{emptyLabel}</p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {products.map((p) => {
        const qty = getQty(p.id);
        return (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200">
            <span className="text-3xl w-12 text-center shrink-0">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-siterun-navy text-sm leading-tight">{productName(p, locale)}</p>
              <p className="text-siterun-orange font-bold mt-1">₹{p.price}/{p.unit}</p>
            </div>
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(p.id)}
                className="w-12 h-12 rounded-xl bg-siterun-orange text-white flex items-center justify-center font-bold text-xl"
              >
                +
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-siterun-orange-light rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setCartQty(p.id, qty - 1)}
                  className="w-11 h-11 rounded-lg bg-white flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setCartQty(p.id, qty + 1)}
                  className="w-11 h-11 rounded-lg bg-siterun-orange text-white flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RecommendedStrip({
  jobType,
  locale,
  getQty,
  addToCart,
  setCartQty,
  label,
}: {
  jobType: import("../types").JobType;
  locale: import("../types").Locale;
  getQty: (id: string) => number;
  addToCart: (id: string) => void;
  setCartQty: (id: string, qty: number) => void;
  label: string;
}) {
  const ids = JOB_TYPE_PRODUCT_IDS[jobType] ?? [];
  const products = ids.map((id) => getProduct(id)).filter((p): p is Product => !!p);

  return (
    <div className="px-4 pt-3 pb-1">
      <p className="text-xs font-semibold text-siterun-orange mb-2">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {products.map((p) => {
          const qty = getQty(p.id);
          return (
            <div
              key={p.id}
              className="shrink-0 w-[140px] p-3 rounded-xl border border-siterun-orange/30 bg-siterun-orange-light"
            >
              <span className="text-2xl">{p.emoji}</span>
              <p className="text-xs font-semibold text-siterun-navy mt-1 line-clamp-2 leading-tight">
                {productName(p, locale)}
              </p>
              <p className="text-siterun-orange font-bold text-sm mt-1">₹{p.price}</p>
              {qty === 0 ? (
                <button
                  type="button"
                  onClick={() => addToCart(p.id)}
                  className="mt-2 w-full py-1.5 rounded-lg bg-siterun-orange text-white text-xs font-bold"
                >
                  +
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => setCartQty(p.id, qty - 1)}
                    className="w-8 h-8 rounded bg-white text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="font-bold text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setCartQty(p.id, qty + 1)}
                    className="w-8 h-8 rounded bg-siterun-orange text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CartFooter() {
  const { setScreen } = useApp();
  const { t } = useTranslation();
  return (
    <div className="shrink-0 p-4 border-t">
      <button
        type="button"
        onClick={() => setScreen("cart")}
        className="w-full py-3 rounded-2xl bg-siterun-navy text-white font-semibold"
      >
        {t("goToCart")}
      </button>
    </div>
  );
}
