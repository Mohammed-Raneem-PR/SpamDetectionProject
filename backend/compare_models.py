import warnings
warnings.filterwarnings("ignore")

import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

ROOT = Path(__file__).resolve().parent.parent
DATASET_PATH = ROOT / "dataset" / "combined_social_network_spam.csv"

# Load Dataset
print("\nLoading dataset and training comparison models...")
data = pd.read_csv(DATASET_PATH, encoding="latin-1").dropna()
data["text"] = data["text"].astype(str).str.strip()
data = data[data["text"] != ""]
data["label"] = data["label"].astype(int)

# Stratified Split (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(
    data["text"], data["label"], test_size=0.2, random_state=42, stratify=data["label"]
)

# Feature Extraction
vectorizer = FeatureUnion([
    ("word", TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)),
    ("character", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=2, sublinear_tf=True)),
])

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

models = {
    "Linear SVM (Calibrated)": CalibratedClassifierCV(LinearSVC(C=1.0), method="isotonic", cv=5),
    "Logistic Regression": LogisticRegression(max_iter=1000, C=1.0),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Multinomial Naive Bayes": MultinomialNB(alpha=0.1)
}

results = []

for name, clf in models.items():
    clf.fit(X_train_vec, y_train)
    preds = clf.predict(X_test_vec)
    acc = accuracy_score(y_test, preds) * 100
    prec = precision_score(y_test, preds, zero_division=0) * 100
    rec = recall_score(y_test, preds, zero_division=0) * 100
    f1 = f1_score(y_test, preds, zero_division=0) * 100
    cm = confusion_matrix(y_test, preds)
    results.append((name, acc, prec, rec, f1, cm))

print("\n" + "=" * 76)
print(f"{'MACHINE LEARNING ALGORITHM PERFORMANCE COMPARISON':^76}")
print(f"{'(Tested on 1,506 held-out Social Network Posts)':^76}")
print("=" * 76)
print(f"{'#':<3} | {'Algorithm':<25} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}")
print("-" * 76)

for idx, (name, acc, prec, rec, f1, cm) in enumerate(results, 1):
    rank_icon = "🥇" if idx == 1 else ("🥈" if idx == 2 else ("🥉" if idx == 3 else "  "))
    print(f"{idx:<3} | {name:<25} | {acc:>9.2f}% | {prec:>9.2f}% | {rec:>9.2f}% | {f1:>9.2f}%")

print("=" * 76)

print("\n" + "=" * 76)
print(f"{'DETAILED CONFUSION MATRIX BREAKDOWN (1,506 SAMPLES)':^76}")
print("=" * 76)
print(f"{'Algorithm':<25} | {'True Ham':<10} | {'False Spam':<10} | {'Missed Spam':<11} | {'True Spam':<10}")
print("-" * 76)

for name, acc, prec, rec, f1, cm in results:
    tn, fp = cm[0]
    fn, tp = cm[1]
    print(f"{name:<25} | {tn:<10} | {fp:<10} | {fn:<11} | {tp:<10}")

print("=" * 76 + "\n")
