import { ShieldCheck, Sparkles } from "lucide-react";

const Header = ({ title = "Social Network Spam Detection", subtitle = "Identify promotional scams, phishing links, and deceptive posts with calibrated Machine Learning" }) => {
  return (
    <div className="text-center md:text-left mb-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-2">
        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
        <span>Dual TF-IDF & Calibrated Linear SVM</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="text-sm text-slate-500 mt-1 max-w-2xl">
        {subtitle}
      </p>
    </div>
  );
};

export default Header;
