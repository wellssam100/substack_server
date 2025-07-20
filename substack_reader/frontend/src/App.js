import './App.css';
import Feed from './components/Feed';
import SubscriptionForm from './components/SubscriptionForm';
import Sidebar from './components/Sidebar';
import './index.css';
import { useState, useEffect } from 'react';


function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    fetch('/subscriptions')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setSubscriptions(data);
      })
      .catch(err => console.error('Error fetching feeds', err));
  }, []);

  const handleSubSelect = (sub) => {
    console.log(`Clicked: ${sub.title}`);
    // You could also fetch that feed's posts here
  };
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
  
  return (
    <div className="App">
      <aside>
        <Sidebar
          subscriptions={subscriptions}
          onSelect={handleSubSelect}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          onRemove={handleSubRemove}
        />
      </aside>
      <main className="content">
        <h1>My Substacks Stuff</h1>
        <SubscriptionForm />
        <Feed />
      </main>
    </div>
  );
}

export default App;
