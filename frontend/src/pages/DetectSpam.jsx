import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  Eye,
  Info,
} from "lucide-react";

export default function DetectSpam() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [inputMode, setInputMode] = useState("text"); // "text" | "image" | "file"
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Check if text was passed from another page (e.g. Dashboard quick scan)
  useEffect(() => {
    if (location.state?.prefillText) {
      setText(location.state.prefillText);
      setInputMode("text");
    }
  }, [location.state]);

  // Load prediction history for this user
  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(`${API}/prediction-history`, {
        params: { user_id: user.id },
      });
      setHistory(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setInputMode("image");
    } else {
      setImagePreview(null);
      setInputMode("file");
    }
  };

  const detectSpam = async () => {
    setLoading(true);

    try {
      // 1. IMAGE PREDICTION (OCR + Model)
      if (inputMode === "image" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (user?.id) formData.append("user_id", user.id);

        const response = await axios.post(`${API}/predict-image`, formData);
        setResult(response.data);
        if (response.data.extracted_text) {
          setText(response.data.extracted_text);
        }
        toast.success("Image OCR & Spam Analysis Completed!");
      }
      // 2. BATCH FILE PREDICTION
      else if (inputMode === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (user?.id) formData.append("user_id", user.id);

        const response = await axios.post(`${API}/predict-file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setResult(response.data);
        toast.success("Batch File Analyzed Successfully!");
      }
      // 3. SINGLE TEXT / MESSAGE SCAN
      else {
        if (!text.trim()) {
          toast.error("Please enter a message or paste post content.");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API}/predict`, {
          text,
          user_id: user?.id,
        });

        setResult(response.data);
        toast.success("Scan Completed!");
      }

      loadHistory();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Unable to analyze content with backend.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setResult(null);
    setSelectedFile(null);
    setImagePreview(null);
    setFileInputKey((k) => k + 1);
    toast.success("Workspace cleared");
  };

  const handleCopyText = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample prompt test presets
  const samplePrompts = [
    {
      label: "🎉 College Cultural Fest",
      text: "ANVITA 2026: National Level Inter-Collegiate Cultural Fest & Dance Competition. Cash prizes worth Rs 50,000! Register on forms.gle/anvita2026. Event Head: Prof. Sharma.",
    },
    {
      label: "🚨 Crypto Doubling Phishing",
      text: "URGENT! Send 0.1 BTC to this wallet address and get 0.5 BTC instantly! Double your bitcoin investment today only http://bit.ly/crypto-double-gift !!",
    },
    {
      label: "💬 Normal Human Tweet",
      text: "Just attended an amazing workshop on distributed systems and AI architecture at college. Learning so much from the team!",
    },
    {
      label: "⚠️ Lottery Prize Scam",
      text: "CONGRATULATIONS!! Your mobile number has won £1,000,000 in the UK National Lottery. Call 09061743825 to claim your prize immediately.",
    },
  ];

  const totalScans = history.length;
  const spamScans = history.filter((h) => h.prediction === "Spam").length;
  const safeScans = history.filter((h) => h.prediction === "Ham").length;

  return (
    <AppLayout
      title="Spam & Phishing Detection Console"
      subtitle="Multi-modal content analysis with calibrated Linear SVM (98.34% accuracy) and contextual safeguards"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Mini Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Your Lifetime Scans</div>
                <div className="text-lg font-bold text-slate-900">{totalScans}</div>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Logged</span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Spam / Scams Detected</div>
                <div className="text-lg font-bold text-rose-600">{spamScans}</div>
              </div>
            </div>
            <span className="text-[11px] text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">
              {totalScans > 0 ? Math.round((spamScans / totalScans) * 100) : 0}% Risk
            </span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Verified Safe Posts</div>
                <div className="text-lg font-bold text-emerald-600">{safeScans}</div>
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {totalScans > 0 ? Math.round((safeScans / totalScans) * 100) : 0}% Safe
            </span>
          </div>
        </div>

        {/* 2-Column Split Detection Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input Console (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            {/* Input Mode Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode("text");
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    inputMode === "text"
                      ? "bg-white text-indigo-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Text / Post</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode("image")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    inputMode === "image"
                      ? "bg-white text-indigo-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Poster / Image OCR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode("file")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    inputMode === "file"
                      ? "bg-white text-indigo-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Batch File (.txt)</span>
                </button>
              </div>

              {text && (
                <button
                  type="button"
                  onClick={() => setText("")}
                  className="text-xs text-slate-400 hover:text-rose-500 font-medium"
                >
                  Clear text
                </button>
              )}
            </div>

            {/* Mode-Specific Input Areas */}
            {inputMode === "text" && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    rows="7"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type any social media comment, tweet, promotional message, or link to evaluate..."
                    className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-y min-h-[160px]"
                  />
                  <div className="absolute right-3 bottom-3 text-[11px] text-slate-400 bg-white/90 px-1.5 py-0.5 rounded">
                    {text.length} characters
                  </div>
                </div>

                {/* Sample Prompt Chips */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Sample Presets:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePrompts.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setText(p.text)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/80 transition text-left"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {inputMode === "image" && (
              <div className="space-y-3">
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
                    imagePreview ? "border-indigo-300 bg-indigo-50/20" : "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
                  }`}
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative inline-block max-h-56 overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                        <img
                          src={imagePreview}
                          alt="Poster Preview"
                          className="max-h-56 w-auto object-contain mx-auto"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-xs">
                          {selectedFile?.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview(null);
                            setFileInputKey((k) => k + 1);
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        Upload Event Flyer, Notice, or Poster Image
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Supports PNG, JPG, JPEG, and WEBP. Text is extracted with enhanced contrast OCR.
                      </p>
                      <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition shadow-xs">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Choose Poster File</span>
                        <input
                          key={fileInputKey}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {text && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Extracted OCR Text Preview</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(text)}
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-slate-600 line-clamp-3 font-mono text-[11px] bg-white p-2 rounded border border-slate-100">
                      {text}
                    </p>
                  </div>
                )}
              </div>
            )}

            {inputMode === "file" && (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:border-indigo-400 transition">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedFile ? selectedFile.name : "Upload Text File (.txt) for Batch Scanning"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a text file with multiple messages (one per line) to evaluate spam in bulk.
                </p>
                <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition shadow-xs">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Select .txt File</span>
                  <input
                    key={fileInputKey}
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={detectSpam}
                disabled={loading || (!text.trim() && !selectedFile)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition shadow-md ${
                  loading || (!text.trim() && !selectedFile)
                    ? "bg-slate-300 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Content with ML...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze with Linear SVM</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="px-4 py-3 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Live AI Inspection & Results Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {!result ? (
              /* Empty State - Informative Model Specs */
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                  <Info className="h-4 w-4" />
                  <span>Real-Time Model Ready</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Inspection Engine</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter message text or upload a poster image on the left. The system runs an automated feature extraction and evaluation pipeline:
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Dual TF-IDF Feature Union</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Word n-grams (1-2) + Character n-grams (3-5) catch intentional typos and disguised phishing keywords.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Calibrated Linear SVM (C=0.8)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        5-fold Isotonic Probability Calibration generates stable confidence percentages (0 - 100%).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Institutional Context Safeguards</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        College circulars, cultural competitions, and verified government forms are protected from false positives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Prediction Result Card */
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-5 animate-in fade-in duration-200">
                {/* Result Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                        result.prediction === "Spam"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {result.prediction === "Spam" ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-rose-600" />
                          <span>Spam Detected</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span>Legitimate / Safe</span>
                        </>
                      )}
                    </span>
                  </div>

                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {result.confidence}%
                  </span>
                </div>

                {/* Animated Confidence Meter */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Model Confidence Score</span>
                    <span
                      className={result.prediction === "Spam" ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}
                    >
                      {result.prediction === "Spam" ? "Malicious / Spam Probability" : "Safe Post Probability"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.prediction === "Spam"
                          ? "bg-gradient-to-r from-orange-500 to-rose-600"
                          : "bg-gradient-to-r from-teal-500 to-emerald-600"
                      }`}
                      style={{ width: `${Math.max(result.confidence || 0, 10)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>AI Reasoning & Assessment:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {result.reason ||
                      (result.prediction === "Spam"
                        ? "This message exhibits strong promotional, urgent financial, or scam vocabulary flagged by the social network spam model."
                        : "This message matches natural conversational vocabulary or verified institutional / educational context.")}
                  </p>

                  {/* Context Signals / Safeguard Override Indicator */}
                  {result.context_signals && result.context_signals.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Matched Institutional Signals:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {result.context_signals.map((sig, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                          >
                            ✓ {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Copy / Action */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>Evaluated with Linear SVM</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(JSON.stringify(result, null, 2))}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copied ? "Copied!" : "Copy Report"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Batch File Results Table */}
            {result?.results && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Batch Scan Results ({result.results.length})</h4>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {result.results.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between gap-2">
                      <span className="truncate max-w-[200px] text-slate-700">{item.message}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          item.prediction === "Spam"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {item.prediction} ({item.confidence}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Prediction History Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Scans in This Session</h3>
              <p className="text-xs text-slate-500 mt-0.5">Log of all recent text and poster inspections</p>
            </div>
            {history.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 self-start sm:self-auto">
                {history.length} records
              </span>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No previous predictions found. Your scan history will appear here automatically.
            </div>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2 font-bold">Content Snippet</th>
                    <th className="py-3 px-2 font-bold">Verdict</th>
                    <th className="py-3 px-2 font-bold">Confidence</th>
                    <th className="py-3 px-2 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.slice(0, 8).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-2 max-w-md">
                        <p className="text-slate-800 truncate font-medium">{item.text || item.message || "Scanned Content"}</p>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.prediction === "Spam"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {item.prediction === "Spam" ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {item.prediction}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-700">
                        {item.confidence}%
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setText(item.text || item.message || "");
                            setInputMode("text");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Re-test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
