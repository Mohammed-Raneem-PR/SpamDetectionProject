import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, X, Send, Sparkles, ShieldCheck, Clock3, MessageCircle } from "lucide-react";
import "./HelpDeskBot.css";

const quickQuestions = [
  "How do I scan a message?",
  "Can I scan an image or file?",
  "Where can I see past results?",
];

function answerFor(question) {
  const text = question.toLowerCase();
  if (/history|past|previous|result/.test(text)) {
    return { text: "Your past scans are saved in Scan History. Open it to review labels, confidence scores, and when each scan was run.", action: ["Open Scan History", "/history"] };
  }
  if (/image|poster|photo|file|upload|document/.test(text)) {
    return { text: "Open Detect Spam and choose Image or File. Images are checked with OCR before classification; text files are analyzed in batches. Supported image and file types are listed on the scan page.", action: ["Go to Detect Spam", "/detect"] };
  }
  if (/account|profile|password|name|email/.test(text)) {
    return { text: "You can review and update your account details from your Profile page.", action: ["Open Profile", "/profile"] };
  }
  if (/analytics|stat|chart|trend/.test(text)) {
    return { text: "The Analytics page summarizes spam and ham activity across your network, with charts and recent activity metrics.", action: ["View Analytics", "/analytics"] };
  }
  if (/post|share|tweet|publish/.test(text)) {
    return { text: "Use Post Tweet to submit a post. The app checks it for spam and saves it to your network feed.", action: ["Create a Post", "/post-tweet"] };
  }
  if (/scan|detect|check|classif/.test(text)) {
    return { text: "Open Detect Spam, paste the message, and select Analyze. You can also switch to image or file mode. The result includes a Spam or Ham label and a confidence score.", action: ["Scan a Message", "/detect"] };
  }
  return { text: "I can help with scanning messages, images and files, finding past results, account settings, posts, and analytics. Try one of the suggested questions below." };
}

export default function HelpDeskBot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m Rene, your SpamGuard help desk assistant. What can I help you with?" },
  ]);
  const send = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    const answer = answerFor(cleanQuestion);
    setMessages((current) => [...current, { from: "user", text: cleanQuestion }, { from: "bot", ...answer }]);
    setDraft("");
  };

  return (
    <>
      {open && (
        <section className="helpdesk-panel fixed bottom-24 right-4 sm:right-6 z-50 flex h-[min(600px,calc(100dvh-8rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-2xl shadow-indigo-950/20" aria-label="Rene help desk chat">
          <header className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 px-5 py-4 text-white">
            <div className="absolute -right-5 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rene-avatar relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner">
                  <Bot className="rene-bot-icon h-6 w-6" />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-indigo-900 bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold">Rene <Sparkles className="h-3.5 w-3.5 text-amber-300" /></div>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-indigo-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Help desk · Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close help desk" className="rounded-xl p-2 text-indigo-100 hover:bg-white/15 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
          </header>

          <div className="flex items-center gap-2 border-b border-slate-100 bg-indigo-50/60 px-5 py-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Product help for your SpamGuard workspace
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 px-4 py-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.from}`} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                {message.from === "bot" && <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><Bot className="h-4 w-4" /></div>}
                <div className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed shadow-sm ${message.from === "user" ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md border border-slate-100 bg-white text-slate-700"}`}>
                  <p>{message.text}</p>
                  {message.action && <button onClick={() => { navigate(message.action[1]); setOpen(false); }} className="mt-2 inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100">{message.action[0]} <span aria-hidden="true">→</span></button>}
                  {message.from === "bot" && index === 0 && <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400"><Clock3 className="h-3 w-3" /> Just now</div>}
                </div>
              </div>
            ))}
            <div className="ml-9 flex flex-wrap gap-1.5">{quickQuestions.map((question) => <button key={question} onClick={() => send(question)} className="rounded-full border border-indigo-100 bg-white px-2.5 py-1.5 text-left text-[10px] font-medium text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50">{question}</button>)}</div>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); send(draft); }} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <label htmlFor="rene-message" className="sr-only">Message Rene</label>
            <input id="rene-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask how to use SpamGuard…" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none" />
            <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
          </form>
          <div className="bg-white pb-2 text-center text-[9px] text-slate-400">Rene answers product questions and doesn’t analyze message content.</div>
        </section>
      )}

      <button onClick={() => setOpen((current) => !current)} aria-label={open ? "Close help desk" : "Open Rene help desk"} aria-expanded={open} className="rene-launcher fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-indigo-700 py-2.5 pl-2.5 pr-4 text-white shadow-xl shadow-indigo-950/25 ring-4 ring-white/80 transition hover:-translate-y-0.5 hover:bg-indigo-800 sm:bottom-6 sm:right-6">
        <span className="rene-avatar relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15"><Bot className="rene-bot-icon h-5 w-5" /><span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-indigo-700 bg-emerald-400" /></span>
        <span className="text-left"><span className="block text-xs font-bold leading-tight">Ask Rene</span><span className="block text-[10px] text-indigo-100">Help desk</span></span>
        <MessageCircle className="ml-1 h-4 w-4 text-indigo-200" />
      </button>
    </>
  );
}
