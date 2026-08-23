# Social-network dataset guide

The application classifies user-generated social-network content as **Spam** or **Ham** (legitimate content). The original `dataset/spam.csv` is retained only as a baseline SMS dataset; it should not be described as a social-network dataset.

## Recommended data format

Add a social-media CSV file under `dataset/`, with one row per post, comment, or tweet:

```csv
label,text
ham,This is a legitimate social-media post.
spam,Visit this link to receive a free prize now.
```

Accepted label columns: `label`, `class`, `v1`, `category`, `target`.

Accepted text columns: `text`, `message`, `content`, `comment`, `tweet`, `post`, `v2`.

## Train with social-media data

From the `backend` directory:

```bash
python train_model.py --dataset ../dataset/social_network_posts.csv
```

This updates `model/spam_model.pkl` and `model/vectorizer.pkl`, which the API uses for post and comment predictions. Restart the backend after training.

If a dataset is split across several CSV files, pass its directory instead. The training script combines every CSV file in that directory.

To reduce false positives for ordinary messages, you can train on more than one dataset. For example, combine a social-media collection with the supplied SMS baseline:

```bash
python train_model.py --dataset /path/to/youtube_spam_collection ../dataset/spam.csv
```

To save the merged data as a visible CSV file, add `--export-dataset`:

```bash
python train_model.py --dataset /path/to/youtube_spam_collection ../dataset/spam.csv --export-dataset ../dataset/combined_social_network_spam.csv
```

## Report wording

> The system detects spam in user-generated social-network posts and comments using word and character TF-IDF features with a calibrated Linear Support Vector Machine classifier. It is trained and evaluated on labelled social-media text.
