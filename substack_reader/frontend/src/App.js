import './App.css';
import Sidebar from './components/Sidebar';
import './index.css';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import EntryList from './components/EntryList';


function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [feedEntries, setFeedEntries] = useState([]);
  const [sourceColors, setSourceColors] = useState({});


  useEffect(() => {
    fetch('/subscriptions')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setSubscriptions(data);
        const colorMap = {};
        data.forEach(sub => {
          const source = typeof sub === 'string' ? sub : sub.title || sub.link;
          colorMap[source] = getDarkColorForSource(source);
        });
        setSourceColors(colorMap);
      })
      .catch(err => console.error('Error fetching feeds', err));
  }, []);

  function getDarkColorForSource(source) {
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      hash = source.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Make sure hash is positive
    hash = Math.abs(hash);

    // More color variety by spreading across H, S, L
    const hue = hash % 360;
    const sat = 30 + (hash % 40);    // 30–70%
    const light = (hash % 20);  // 10–30%

    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }


  const handleSubRemove = async (urlToRemove) => {
        try {
            const res = await fetch('/subscriptions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlToRemove }),
            });
        if (res.ok) {
            // Update the frontend list without refetching
            setSubscriptions(prev =>
                prev.filter(sub => (typeof sub === 'string' ? sub !== urlToRemove : sub.link !== urlToRemove))
            );
        } else {
            console.error('Failed to remove subscription');
        }
        } catch (err) {
            console.error('Error during remove:', err);
        }
    };

    const handleSelect = async (sub) => {
    if (sub === 'all') {
      setCurrentView('home');
    } else {
      const url = typeof sub === 'string' ? sub : sub.link;

      try {
        const res = await fetch('/entries/single', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();
        setFeedEntries(data);
        setCurrentView('feed');
        console.log('Fetched feed entries:', data);
      } catch (err) {
        console.error('Error fetching feed:', err);
      }
    }
  };

  return (
    <div className="App">
      <aside>
        <Sidebar
          subscriptions={subscriptions}
          onSelect={handleSelect}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          onRemove={handleSubRemove}
          sourceColors={sourceColors}
        />
      </aside>
      <main className="main">
        {currentView === 'home' && <HomePage sourceColors={sourceColors}/>}
        {currentView === 'feed' && <EntryList entries={feedEntries} sourceColors={sourceColors} />}
      </main>      
    </div>
  );
}

export default App;
