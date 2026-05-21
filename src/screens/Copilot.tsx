import { useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import { useApp } from "../context";
import { getTranslation, useTranslation } from "../i18n";
import {
  COPILOT_EXAMPLES,
  formatItemList,
  parseOrderMessage,
  suggestComplements,
} from "../lib/copilot";
import { isSpeechSupported, listenForSpeech } from "../lib/speech";
import { Header } from "../components/Header";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CopilotScreen() {
  const {
    setScreen,
    addToCart,
    locale,
    activeJob,
    requireActiveJob,
    cartCount,
    cart,
  } = useApp();
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stopListenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!activeJob) return;
    const kitLabel =
      locale === "hi"
        ? `पूरी ${activeJob.titleHi} किट`
        : `Full ${activeJob.titleEn} kit`;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: getTranslation(locale, "copilotGreeting"),
        actionLabel: kitLabel,
        onAction: () => processUserMessage(locale === "hi" ? "पूरी किट" : "full job kit"),
      },
    ]);
  }, [locale, activeJob?.id, activeJob?.type]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const append = (msg: Omit<Message, "id">) => {
    setMessages((m) => [...m, { ...msg, id: `${Date.now()}-${Math.random()}` }]);
  };

  const applyItems = (items: { productId: string; qty: number }[]) => {
    items.forEach((i) => addToCart(i.productId, i.qty));
  };

  const processUserMessage = (text: string) => {
    if (!activeJob) return;
    append({ role: "user", text });

    const result = parseOrderMessage(text, activeJob.type, activeJob, cart);
    const reply = locale === "hi" ? result.replyHi : result.replyEn;

    if (
      result.intent === "add" ||
      result.intent === "kit" ||
      result.intent === "remaining"
    ) {
      applyItems(result.items);
      const complements = suggestComplements(result.items.map((i) => i.productId));
      if (complements.length > 0 && result.intent === "add") {
        append({
          role: "assistant",
          text: reply,
          actionLabel: locale === "hi" ? "हाँ, जोड़ें" : "Yes, add these too",
          onAction: () => {
            applyItems(complements);
            append({
              role: "assistant",
              text:
                locale === "hi"
                  ? `जोड़ा: ${formatItemList(complements, locale)}`
                  : `Also added: ${formatItemList(complements, locale)}`,
            });
          },
        });
      } else {
        append({ role: "assistant", text: reply });
      }
    } else {
      append({ role: "assistant", text: reply });
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    processUserMessage(text);
  };

  const handleVoice = () => {
    if (listening) {
      stopListenRef.current?.();
      setListening(false);
      return;
    }

    if (!isSpeechSupported()) {
      processUserMessage(
        locale === "hi" ? "4 inch elbow 4, coupling 4, solvent 1" : "4 inch elbow 4, coupling 4, solvent 1"
      );
      return;
    }

    setListening(true);
    stopListenRef.current = listenForSpeech(
      locale,
      (transcript) => {
        setListening(false);
        setInput(transcript);
        processUserMessage(transcript);
      },
      (err) => {
        setListening(false);
        append({ role: "assistant", text: err });
      }
    );
  };

  useEffect(() => () => stopListenRef.current?.(), []);

  if (!activeJob) {
    return (
      <div className="flex flex-col h-full">
        <Header title={t("copilotTitle")} showBack onBack={() => setScreen("home")} />
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <p className="text-siterun-slate">{t("orderNeedsJob")}</p>
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

  const examples = COPILOT_EXAMPLES[locale];
  const speechOk = isSpeechSupported();

  return (
    <div className="flex flex-col h-full">
      <Header title={t("copilotTitle")} showBack showCart onBack={() => setScreen("home")} />
      <div className="px-4 py-2 bg-siterun-navy/5 border-b flex items-center gap-2 text-xs text-siterun-slate">
        <Sparkles size={14} className="text-siterun-amber" />
        {t("copilotHintLive")}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-siterun-navy text-white"
                  : "bg-white border border-slate-200 text-siterun-navy"
              }`}
            >
              <p className="text-sm font-medium leading-snug whitespace-pre-wrap">{msg.text}</p>
              {msg.actionLabel && msg.onAction && (
                <button
                  type="button"
                  onClick={msg.onAction}
                  className="mt-3 w-full py-2.5 rounded-xl bg-siterun-orange text-white text-sm font-semibold"
                >
                  {msg.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-1">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => processUserMessage(ex)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-siterun-navy border border-slate-200"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 p-3 border-t bg-white space-y-2">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("copilotInputPlaceholder")}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 text-sm focus:border-siterun-orange focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-xl bg-siterun-orange text-white flex items-center justify-center disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={20} />
          </button>
          <button
            type="button"
            onClick={handleVoice}
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              listening
                ? "bg-siterun-amber text-siterun-navy animate-pulse"
                : "bg-siterun-navy text-white"
            }`}
            aria-label="Voice"
            title={speechOk ? t("tapToSpeak") : t("copilotVoiceFallback")}
          >
            <Mic size={20} />
          </button>
        </div>
        {!speechOk && (
          <p className="text-[10px] text-siterun-slate text-center">{t("copilotVoiceFallback")}</p>
        )}
        <button
          type="button"
          onClick={() => setScreen("cart")}
          className="w-full py-3 rounded-xl border-2 border-siterun-orange text-siterun-orange font-semibold"
        >
          {t("viewCart")} {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </div>
    </div>
  );
}
