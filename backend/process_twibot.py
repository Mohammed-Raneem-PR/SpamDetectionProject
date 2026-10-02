import json
import re
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = ROOT / "dataset"

def clean_tweet_text(text: str) -> str:
    if not text:
        return ""
    # Strip URLs or standardize them
    text = re.sub(r'[\r\n\t]+', ' ', text)
    # Remove surrogate characters / broken utf-8 sequences
    text = text.encode("utf-8", "ignore").decode("utf-8", "ignore")
    # Normalize multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_tweets_from_file(json_file: Path, tweets_per_user: int = 4):
    print(f"Reading {json_file.name}...")
    with open(json_file, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    records = []
    seen = set()
    
    for u in users:
        label = int(u.get('label', 0))
        tweets = u.get('tweet', []) or []
        
        # Take up to `tweets_per_user` tweets per account for balanced representation
        count = 0
        for t in tweets:
            if not t or not isinstance(t, str):
                continue
            cleaned = clean_tweet_text(t)
            # Filter out very short or duplicate tweets
            if len(cleaned) < 15 or cleaned in seen:
                continue
            seen.add(cleaned)
            records.append((label, cleaned))
            count += 1
            if count >= tweets_per_user:
                break
                
    print(f"Extracted {len(records)} clean tweets from {len(users)} users in {json_file.name}")
    return records

def save_to_csv(records, output_csv: Path):
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["label", "text"])
        for label, text in records:
            writer.writerow([label, text])
    print(f"Saved {len(records)} rows to {output_csv}")

def main():
    print("=" * 60)
    print("STEP 1: EXTRACTING & CLEANING TWIBOT-20 DATASET")
    print("=" * 60)
    
    train_file = DATASET_DIR / "train.json"
    dev_file = DATASET_DIR / "dev.json"
    test_file = DATASET_DIR / "test.json"
    
    train_records = extract_tweets_from_file(train_file, tweets_per_user=4)
    dev_records = extract_tweets_from_file(dev_file, tweets_per_user=4)
    test_records = extract_tweets_from_file(test_file, tweets_per_user=4)
    
    # Save split files
    save_to_csv(train_records, DATASET_DIR / "twibot20_tweets_train.csv")
    save_to_csv(test_records, DATASET_DIR / "twibot20_tweets_test.csv")
    
    # Save combined master dataset
    all_records = train_records + dev_records + test_records
    save_to_csv(all_records, DATASET_DIR / "twibot20_tweets_combined.csv")
    
    print("\n✅ Step 1 Completed Successfully!")
    print(f"Total TwiBot-20 clean tweets extracted: {len(all_records)}")
    
if __name__ == "__main__":
    main()
