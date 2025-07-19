from flask import Flask, request, jsonify, send_from_directory
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
    if url in feeds:
        return jsonify({"message": "Already subscribed"}), 200
    feeds.append(url)
    save_subscriptions(feeds)
    return jsonify({"message": "Subscribed"}), 201

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

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

if __name__ == "__main__":
    app.run(debug=True)
