import logo from './logo.svg';
import './App.css';
import Feed from './components/Feed';
import SubscriptionForm from './components/SubscriptionForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Substacks Stuff</h1>
        <SubscriptionForm />
        <Feed />
      </header>
    </div>
  );
}

export default App;
