import { isValidElement, useEffect, useState } from 'react';

function Feed() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [entries, setEntries] = useState({});

    useEffect(() => {
    fetch('/subscriptions')
        .then(res => res.json())
        .then(data => {
            console.log('Fetched data:', data);
            setSubscriptions(data);
        })
        .catch(err => console.error('Error fetching feeds', err));
    }, []);
    console.log("Rendering subscriptions:", subscriptions);
    const handleRemove = async (urlToRemove) => {
        try {
            const res = await fetch('/subscriptions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlToRemove }),
            });

            if (res.ok) {
            setSubscriptions(prev =>
                prev.filter(sub =>
                typeof sub === 'string'
                    ? sub !== urlToRemove
                    : sub.link !== urlToRemove
                )
            );
            } else {
            console.error('Failed to remove subscription');
            }
        } catch (err) {
            console.error('Error during remove:', err);
        }
    };
    const handleViewPosts = async (feedUrl) => {
        if (entries[feedUrl]) return; // already fetched
        try {
            const res = await fetch('/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: feedUrl }),
            });
            const data = await res.json();
            console.log(`Entries for ${feedUrl}:`, data); // <-- Log entries here
            setEntries(prev => ({ ...prev, [feedUrl]: data }));
        } catch (err) {
            console.error('Failed to fetch entries:', err);
        }
    };
  return (
  <div>
      <h2>Subscriptions</h2>
      {Array.isArray(subscriptions) && subscriptions.length > 0 ? (
      <ul>
          {subscriptions.map((sub) => {
          const isString = typeof sub === 'string';
          const link = isString ? sub : sub?.link ?? null;
          const title = isString ? sub : sub?.title ?? link ?? 'Untitled';
          const isValidLink = typeof link === 'string' && link.startsWith('http');
         if (!link || typeof link !== 'string') {
              console.warn(`Skipping subscription [${sub}] — invalid link:`, link, 'Full entry:', sub);
              return (
                  <li key={`invalid-${sub}`}>
                  <span>{title} (invalid or missing link)</span>
                  </li>
              );
          }
         return (
              <li key={link}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                    {title}
                    </a>{' '}
                    <button onClick={() => handleViewPosts(link)}>View Posts</button>
                    <button onClick={() => handleRemove(link)}>Remove</button>
                    {entries[link] && (
                    <ul>
                        {entries[link].map((entry) => (
                        <li key={entry}>
                            <a href={entry.link} target="_blank" rel="noopener noreferrer">
                            {entry.title}
                            </a>{' '}
                            <small>{entry.published}</small>
                        </li>
                        ))}
                    </ul>
                    )}
              </li>
          );
          })}
      </ul>
      ) : (
      <p>No subscriptions loaded.</p>
      )}
  </div>
  );
}

export default Feed;
