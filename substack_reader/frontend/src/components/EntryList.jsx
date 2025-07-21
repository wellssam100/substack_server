function EntryList({ entries, sourceColors }) {
    const sourceTitle = entries[0]?.source || 'Feed';
    console.log('EntryList received entries:', entries);
    return (
       <div className="feed-wrapper">
         <h1 className="feed-header">{sourceTitle}</h1>
         <div className="entries-grid">
           {entries.map((entry, i) => {
                const bgColor = sourceColors[entry.source] || '#222'; // ← THIS LINE
                return(
                    <div className="entry-card" key={i} style={{backgroundColor : bgColor}} >
                    <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="entry-title"
                    >
                        {entry.title}
                    </a>
                    <div className="entry-meta">
                        <span>{entry.published}</span>
                    </div>
                    </div>
                );
           })}
         </div>
       </div>
     );
}

export default EntryList;
