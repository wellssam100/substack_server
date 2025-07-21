from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, timezone
import feedparser
import json
import os

app = Flask(__name__)

SUBSCRIPTIONS_FILE = "subscriptions.json"

# Load existing subscriptions
def load_subscriptions():
    if not os.path.exists(SUBSCRIPTIONS_FILE):
        return []
    with open(SUBSCRIPTIONS_FILE, "r") as f:
        return json.load(f)

# Save subscriptions
def save_subscriptions(feeds):
    with open(SUBSCRIPTIONS_FILE, "w") as f:
        json.dump(feeds, f, indent=2)

# Get posts from a feed URL
def fetch_feed(feed_url):
    parsed = feedparser.parse(feed_url)
    if parsed.bozo:
        return {"error": "Invalid or inaccessible feed"}
    return {
        "title": parsed.feed.get("title", "Untitled"),
        "entries": [
            {
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published": entry.get("published", "")
            } for entry in parsed.entries
        ]
    }

# Routes

@app.route("/subscriptions", methods=["GET"])
def list_subscriptions():
    return jsonify(load_subscriptions())

@app.route("/subscriptions", methods=["POST"])
def add_subscription():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing URL"}), 400
    feeds = load_subscriptions()
    if any((f == url or f.get("link") == url) for f in feeds):
        return jsonify({"message": "Already subscribed"}), 200
    # Parse RSS feed
    parsed = feedparser.parse(url)
    title = parsed.feed.get("title", "Untitled")

    # Save as object with title + link
    feeds.append({ "title": title, "link": url })
    save_subscriptions(feeds)

    return jsonify({ "message": "Subscribed" }), 201

@app.route("/feed", methods=["GET"])
def get_all_feeds():
    feeds = load_subscriptions()
    all_data = []
    for url in feeds:
        data = fetch_feed(url)
        all_data.append({
            "url": url,
            "feed": data
        })
    return jsonify(all_data)

@app.route("/subscriptions", methods=["DELETE"])
def delete_subscription():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing URL"}), 400

    feeds = load_subscriptions()
    new_feeds = [
        f for f in feeds
        if not (f == url or (isinstance(f, dict) and f.get("link") == url))
    ]
    save_subscriptions(new_feeds)
    return jsonify({"message": "Deleted"}), 200

@app.route("/entries", methods=["POST"])
def get_feed_entries():
    data = request.json
    url = data.get("url", "").strip()
    if not url:
        return jsonify({ "error": "Missing URL" }), 400

    parsed = feedparser.parse(url)
    entries = [
        {
            "title": entry.get("title", "Untitled"),
            "link": entry.get("link", "#"),
            "published": entry.get("published", "")
        }
        for entry in parsed.entries[:5]  # latest 5 posts
    ]
    return jsonify(entries)

@app.route("/entries/today", methods=["GET"])
def entries_today():
    feeds = load_subscriptions()
    all_entries = []

    now = datetime.now(timezone.utc).date()

    for feed_url in feeds:
        parsed = feedparser.parse(feed_url if isinstance(feed_url, str) else feed_url.get("link"))
        for entry in parsed.entries:
            published = entry.get("published_parsed")
            if not published:
                continue

            published_date = datetime(*published[:6], tzinfo=timezone.utc).date()
            if published_date == now:
                all_entries.append({
                    "title": entry.get("title"),
                    "link": entry.get("link"),
                    "published": entry.get("published"),
                    "source": parsed.feed.get("title", feed_url)
                })

    return jsonify(all_entries)

@app.route("/entries/single", methods=["POST"])
def entries_for_feed():
    data = request.json
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "Missing URL"}), 400

    parsed = feedparser.parse(url)
    entries = []
    for entry in parsed.entries[:10]:
        entries.append({
            "title": entry.get("title"),
            "link": entry.get("link"),
            "published": entry.get("published"),
            "source": parsed.feed.get("title", url)
        })

    return jsonify(entries)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

if __name__ == "__main__":
    app.run(debug=True)
