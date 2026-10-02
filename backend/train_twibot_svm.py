import warnings
warnings.filterwarnings("ignore")

import json
import numpy as np
from pathlib import Path
from scipy.sparse import hstack, csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV

ROOT = Path(__file__).resolve().parent.parent
TRAIN_JSON = ROOT / "dataset" / "train.json"
TEST_JSON = ROOT / "dataset" / "test.json"

print("=" * 65)
print(f"{'OPTIMIZED SVM FOR TWIBOT-20 SOCIAL NETWORK BENCHMARK':^65}")
print("=" * 65)

def extract_features(json_path, max_tweets=30):
    print(f"Loading and extracting features from {json_path.name}...")
    with open(json_path, "r", encoding="utf-8") as f:
        users = json.load(f)
    texts = []
    meta = []
    labels = []
    
    for u in users:
        label = int(u.get("label", 0))
        p = u.get("profile", {}) or {}
        
        # Profile meta features
        followers = float(p.get("followers_count", 0) or 0)
        following = float(p.get("friends_count", 0) or 0)
        statuses = float(p.get("statuses_count", 0) or 0)
        favourites = float(p.get("favourites_count", 0) or 0)
        listed = float(p.get("listed_count", 0) or 0)
        verified = 1.0 if str(p.get("verified", "false")).strip().lower() in ["true", "1"] else 0.0
        default_img = 1.0 if str(p.get("default_profile_image", "false")).strip().lower() in ["true", "1"] else 0.0
        
        ratio = followers / (following + 1.0)
        log_followers = np.log1p(followers)
        log_following = np.log1p(following)
        log_statuses = np.log1p(statuses)
        
        meta.append([log_followers, log_following, log_statuses, ratio, verified, default_img, favourites, listed])
        
        bio = p.get("description", "") or ""
        name = p.get("name", "") or ""
        screen_name = p.get("screen_name", "") or ""
        tweets = u.get("tweet", []) or []
        combined_text = f"{name} {screen_name} {bio} " + " ".join(tweets[:max_tweets])
        texts.append(combined_text)
        labels.append(label)
        
    return texts, np.array(meta), np.array(labels)

X_tr_txt, X_tr_meta, y_tr = extract_features(TRAIN_JSON, max_tweets=30)
X_te_txt, X_te_meta, y_te = extract_features(TEST_JSON, max_tweets=30)

print(f"\nTraining on {len(X_tr_txt)} users | Evaluating on {len(X_te_txt)} held-out test users")

# Scale meta features
scaler = StandardScaler()
X_tr_meta_sc = scaler.fit_transform(X_tr_meta)
X_te_meta_sc = scaler.transform(X_te_meta)

# TF-IDF Feature Union
vectorizer = FeatureUnion([
    ("word", TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=3, max_features=40000)),
    ("char", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=3, sublinear_tf=True, max_features=40000)),
])

print("Extracting Word & Character TF-IDF matrices...")
X_tr_v = vectorizer.fit_transform(X_tr_txt)
X_te_v = vectorizer.transform(X_te_txt)

# Combine Sparse Text Features + Metadata Features
X_train_full = hstack([X_tr_v, csr_matrix(X_tr_meta_sc)])
X_test_full = hstack([X_te_v, csr_matrix(X_te_meta_sc)])

print("Training Calibrated Linear SVM (C=0.5, squared_hinge)...")
base_svm = LinearSVC(C=0.5, loss="squared_hinge", dual=False, random_state=42, max_iter=3000)
model = CalibratedClassifierCV(base_svm, method="isotonic", cv=5).fit(X_train_full, y_tr)

preds = model.predict(X_test_full)

acc = accuracy_score(y_te, preds) * 100
prec = precision_score(y_te, preds, zero_division=0) * 100
rec = recall_score(y_te, preds, zero_division=0) * 100
f1 = f1_score(y_te, preds, zero_division=0) * 100
cm = confusion_matrix(y_te, preds)

print("\n" + "=" * 65)
print(f"{'OPTIMIZED SVM PERFORMANCE ON TWIBOT-20':^65}")
print("=" * 65)
print(f"  • Accuracy:   {acc:.2f}%")
print(f"  • Precision:  {prec:.2f}%")
print(f"  • Recall:     {rec:.2f}%")
print(f"  • F1 Score:   {f1:.2f}%")
print("\n" + "-" * 65)
print(f"{'Confusion Matrix (1,183 Test Users)':^65}")
print("-" * 65)
print(f"  True Humans: {cm[0][0]:<6} | False Spam (False Positives): {cm[0][1]}")
print(f"  Missed Bots: {cm[1][0]:<6} | True Bots  (True Positives):   {cm[1][1]}")
print("=" * 65 + "\n")
