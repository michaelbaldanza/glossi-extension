import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import { User } from './services/interfaces';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lookup, setLookup] = useState<string>('');

  useEffect(() => {
    chrome.storage.local.get(['user']).then((result) => {
      if (result.hasOwnProperty('user')) {
        setUser(result.user);
      }
    });

    chrome.runtime.onMessage.addListener(({ name, data }) => {
      /*
        Adapted from Google Chrome's Dictionary side panel example.
        https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js
      */
      if (name === 'glossi-define') {
        setLookup(data.value);
      }
    });

  }, [])

  return (
    <div>
      <Nav user={[user, setUser]} />
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
      <div>
        {
          lookup.length ?
          'Going to look up ' + lookup :
          'Right click on a word and select the Glossi option to get started.'
        }
      </div>
    </div>
  );
}

export default App;