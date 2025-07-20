import { useState } from 'react';

function SubscriptionForm() {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    setUrl('');
    window.location.reload(); // or trigger Feed update via shared state
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Substack URL"
      />
      <button type="submit">Subscribe</button>
    </form>
  );
}

export default SubscriptionForm;
