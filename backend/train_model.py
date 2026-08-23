"""Train the social-network spam classifier from a labelled CSV file."""

import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import FeatureUnion
from sklearn.svm import LinearSVC

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATASET = ROOT / "dataset" / "spam.csv"
MODEL_PATH = ROOT / "model" / "spam_model.pkl"
VECTORIZER_PATH = ROOT / "model" / "vectorizer.pkl"
LABEL_COLUMNS = ("label", "class", "v1", "category", "target")
TEXT_COLUMNS = ("text", "message", "content", "comment", "tweet", "post", "v2")
SPAM_LABELS = {"spam", "1", "true", "yes"}
HAM_LABELS = {"ham", "not_spam", "not spam", "legitimate", "normal", "0", "false", "no"}


def find_column(columns, candidates, kind):
    normalized = {column.strip().lower(): column for column in columns}
    for candidate in candidates:
        if candidate in normalized:
            return normalized[candidate]
    raise ValueError(f"No {kind} column found. Expected one of: {', '.join(candidates)}")


def load_single_dataset(dataset_path):
    df = pd.read_csv(dataset_path, encoding="latin-1")
    label_column = find_column(df.columns, LABEL_COLUMNS, "label")
    text_column = find_column(df.columns, TEXT_COLUMNS, "text")
    data = df[[label_column, text_column]].rename(columns={label_column: "label", text_column: "text"}).dropna()
    data["text"] = data["text"].astype(str).str.strip()
    data = data[data["text"] != ""]
    labels = data["label"].astype(str).str.strip().str.lower()
    unsupported = sorted(set(labels) - SPAM_LABELS - HAM_LABELS)
    if unsupported:
        raise ValueError("Unsupported labels: " + ", ".join(unsupported) + ". Map them to spam or ham before training.")
    data["label"] = labels.isin(SPAM_LABELS).astype(int)
    return data


def load_datasets(dataset_paths):
    paths = []
    for dataset_path in dataset_paths:
        if dataset_path.is_dir():
            paths.extend(sorted(dataset_path.glob("*.csv")))
        else:
            paths.append(dataset_path)
    if not paths:
        raise ValueError("No CSV files found in the provided dataset paths.")
    data = pd.concat([load_single_dataset(path) for path in paths], ignore_index=True)
    if data["label"].nunique() != 2:
        raise ValueError("The combined training data must contain both spam and non-spam examples.")
    return data


def main():
    parser = argparse.ArgumentParser(description="Train a social-network text spam classifier.")
    parser.add_argument(
        "--dataset",
        nargs="+",
        type=Path,
        default=[DEFAULT_DATASET],
        help="One or more CSV files/directories. Directories combine every CSV file inside them.",
    )
    parser.add_argument(
        "--export-dataset",
        type=Path,
        help="Optional path for saving the combined, normalized label/text training CSV.",
    )
    args = parser.parse_args()
    data = load_datasets(args.dataset)

    print(f"Training with {len(data)} posts from: {', '.join(map(str, args.dataset))}")
    if args.export_dataset:
        args.export_dataset.parent.mkdir(parents=True, exist_ok=True)
        data.to_csv(args.export_dataset, index=False)
        print(f"Combined dataset exported to {args.export_dataset}")
    X_train, X_test, y_train, y_test = train_test_split(
        data["text"], data["label"], test_size=0.2, random_state=42, stratify=data["label"]
    )
    vectorizer = FeatureUnion([
        ("word", TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)),
        ("character", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=2, sublinear_tf=True)),
    ])
    X_train = vectorizer.fit_transform(X_train)
    X_test = vectorizer.transform(X_test)
    # Calibration exposes reliable class probabilities for the API confidence score.
    model = CalibratedClassifierCV(LinearSVC(C=1), method="isotonic", cv=5).fit(X_train, y_train)
    predictions = model.predict(X_test)

    print("=" * 50)
    print("SOCIAL-NETWORK SPAM MODEL PERFORMANCE")
    print("=" * 50)
    print(f"Accuracy:  {accuracy_score(y_test, predictions):.4f}")
    print(f"Precision: {precision_score(y_test, predictions, zero_division=0):.4f}")
    print(f"Recall:    {recall_score(y_test, predictions, zero_division=0):.4f}")
    print(f"F1 Score:  {f1_score(y_test, predictions, zero_division=0):.4f}")
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, predictions))
    print(classification_report(y_test, predictions, target_names=["Ham", "Spam"], zero_division=0))

    MODEL_PATH.parent.mkdir(exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    print(f"Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
