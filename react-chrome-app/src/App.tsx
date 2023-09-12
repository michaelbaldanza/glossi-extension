import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import { User } from './services/interfaces';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['user']).then((result) => {
      if (result.hasOwnProperty('user')) {
        setUser(result.user);
      }
    });
  }, [])

  return (
    <div>
      <Nav />
      <div className="infobox">
        {
          user ? 
          <div>
            Hello, {user.username}
          </div>
          :
          <Login user={[user, setUser]} />
        }
      </div>
    </div>
  );
}

export default App;