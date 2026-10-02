import warnings
warnings.filterwarnings("ignore")

import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

ROOT = Path(__file__).resolve().parent.parent
TRAIN_PATH = ROOT / "dataset" / "twibot20_tweets_train.csv"
TEST_PATH = ROOT / "dataset" / "twibot20_tweets_test.csv"

print("=" * 76)
print("STEP 2: BENCHMARKING ML ALGORITHMS ON TWIBOT-20 TWITTER DATASET")
print("=" * 76)

train_data = pd.read_csv(TRAIN_PATH).dropna()
test_data = pd.read_csv(TEST_PATH).dropna()

print(f"Training on {len(train_data)} tweets from twibot20_tweets_train.csv")
print(f"Testing on {len(test_data)} held-out tweets from twibot20_tweets_test.csv\n")

vectorizer = FeatureUnion([
    ("word", TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True, max_features=35000)),
    ("character", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=3, sublinear_tf=True, max_features=35000)),
])

print("Vectorizing tweets with Word (1-2) and Character (3-5) TF-IDF...")
X_train = vectorizer.fit_transform(train_data["text"])
X_test = vectorizer.transform(test_data["text"])
y_train = train_data["label"].astype(int)
y_test = test_data["label"].astype(int)

models = {
    "Linear SVM (Calibrated)": CalibratedClassifierCV(LinearSVC(C=1.0), method="isotonic", cv=3),
    "Logistic Regression": LogisticRegression(max_iter=1000, C=1.0),
    "Random Forest": RandomForestClassifier(n_estimators=80, max_depth=25, random_state=42, n_jobs=-1),
    "Multinomial Naive Bayes": MultinomialNB(alpha=0.1)
}

results = []

for name, clf in models.items():
    print(f"Training & evaluating {name}...")
    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    
    acc = accuracy_score(y_test, preds) * 100
    prec = precision_score(y_test, preds, zero_division=0) * 100
    rec = recall_score(y_test, preds, zero_division=0) * 100
    f1 = f1_score(y_test, preds, zero_division=0) * 100
    cm = confusion_matrix(y_test, preds)
    results.append((name, acc, prec, rec, f1, cm))

# Sort results by Accuracy
results.sort(key=lambda x: x[1], reverse=True)

print("\n" + "=" * 76)
print(f"{'TWIBOT-20 TWITTER DATASET PERFORMANCE BENCHMARK':^76}")
print(f"{'(Evaluated on 4,587 held-out Test Tweets)':^76}")
print("=" * 76)
print(f"{'#':<3} | {'Algorithm':<25} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}")
print("-" * 76)

for idx, (name, acc, prec, rec, f1, cm) in enumerate(results, 1):
    print(f"{idx:<3} | {name:<25} | {acc:>9.2f}% | {prec:>9.2f}% | {rec:>9.2f}% | {f1:>9.2f}%")

print("=" * 76)

print("\n" + "=" * 76)
print(f"{'CONFUSION MATRIX BREAKDOWN (4,587 TEST TWEETS)':^76}")
print("=" * 76)
print(f"{'Algorithm':<25} | {'True Human':<11} | {'False Spam':<11} | {'Missed Spam':<12} | {'True Bot/Spam':<13}")
print("-" * 76)

for name, acc, prec, rec, f1, cm in results:
    tn, fp = cm[0]
    fn, tp = cm[1]
    print(f"{name:<25} | {tn:<11} | {fp:<11} | {fn:<12} | {tp:<13}")

print("=" * 76 + "\n")
