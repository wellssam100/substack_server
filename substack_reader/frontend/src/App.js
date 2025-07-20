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
  
  return (
    <div className="App">
      <aside>
        <Sidebar
          subscriptions={subscriptions}
          onSelect={handleSubSelect}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
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
