import { useEffect, useState } from 'react';

function HomePage({sourceColors}) {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    fetch('/entries/today')
      .then(res => res.json())
      .then(data => {
        console.log("Today's entries:", data);
        setEntries(data);
      })
      .catch(err => console.error('Failed to fetch today’s entries', err));
  }, []);

  return (
    <div className="homepage">
      <h1>Today's Posts</h1>
      <div className="entries-grid">
        {entries.map((entry, i) => {
            const bgColor = sourceColors[entry.source] || '#222'; // ← THIS LINE
            return(
            <div className="entry-card" key={i} style={{backgroundColor:bgColor}}>
                <a href={entry.link} target="_blank" rel="noopener noreferrer" className="entry-title">
                    {entry.title}
                </a>
            <div className="entry-meta">
                <span className="entry-source">{entry.source}</span>
                <span className="entry-published">{entry.published}</span>
            </div>
            </div>
            );
        })}
      </div>
    </div>
  );
}

export default HomePage;