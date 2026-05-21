import { useState } from "react";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { LanguageToggle } from "../components/LanguageToggle";
import { DEMO_OTP, DEMO_PHONE } from "../data";

export function LoginScreen() {
  const { login, locale } = useApp();
  const { t } = useTranslation();
  const [phone, setPhone] = useState(DEMO_PHONE);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError(locale === "hi" ? "सही नंबर डालें" : "Enter a valid number");
      return;
    }
    setError("");
    setOtpSent(true);
  };

  const handleVerify = () => {
    if (!login(phone, otp)) {
      setError(locale === "hi" ? "गलत OTP" : "Invalid OTP");
      return;
    }
    setError("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-siterun-navy">{t("appName")}</h1>
          <p className="text-sm text-siterun-slate mt-0.5">{t("loginSubtitle")}</p>
        </div>
        <LanguageToggle compact />
      </div>

      <div className="flex-1 px-4 flex flex-col justify-center max-w-sm mx-auto w-full">
        <h2 className="text-xl font-bold text-siterun-navy mb-6">{t("loginTitle")}</h2>

        <label className="text-sm font-medium text-siterun-navy mb-1 block">{t("phoneLabel")}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phonePlaceholder")}
          className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 text-lg mb-4 focus:border-siterun-orange focus:outline-none"
          disabled={otpSent}
        />

        {!otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold text-lg"
          >
            {t("sendOtp")}
          </button>
        ) : (
          <>
            <p className="text-sm text-siterun-slate mb-2">
              {t("otpSent")} {phone.slice(-4).padStart(phone.length, "•")}
            </p>
            <label className="text-sm font-medium text-siterun-navy mb-1 block">{t("otpLabel")}</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder={t("otpPlaceholder")}
              className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 text-2xl tracking-widest text-center mb-4 focus:border-siterun-orange focus:outline-none"
            />
            <p className="text-xs text-siterun-slate mb-4">
              {t("demoOtp")}: {DEMO_OTP}
            </p>
            <button
              type="button"
              onClick={handleVerify}
              className="w-full py-4 rounded-2xl bg-siterun-navy text-white font-bold text-lg"
            >
              {t("verifyOtp")}
            </button>
          </>
        )}

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
