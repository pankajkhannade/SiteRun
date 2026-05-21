import type { Locale } from "../types";

type SpeechCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && !!(getSpeechRecognition());
}

function getSpeechRecognition(): SpeechCtor | undefined {
  const w = window as Window & {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function listenForSpeech(
  locale: Locale,
  onResult: (transcript: string) => void,
  onError: (message: string) => void
): () => void {
  const Ctor = getSpeechRecognition();
  if (!Ctor) {
    onError("Speech not supported in this browser — type your order instead.");
    return () => {};
  }

  const rec = new Ctor();
  rec.lang = locale === "hi" ? "hi-IN" : "en-IN";
  rec.continuous = false;
  rec.interimResults = false;

  rec.onresult = (ev) => {
    const t = ev.results[0]?.[0]?.transcript;
    if (t) onResult(t.trim());
  };

  rec.onerror = () => {
    onError(locale === "hi" ? "आवाज़ नहीं सुन पाए" : "Could not hear — try typing");
  };

  rec.onend = () => {};

  try {
    rec.start();
  } catch {
    onError("Mic permission needed");
  }

  return () => {
    try {
      rec.stop();
    } catch {
      rec.abort();
    }
  };
}
