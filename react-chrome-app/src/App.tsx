import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import { User } from './services/interfaces';
import { collect } from './services/dictionaries';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lookupHistory, setLookupHistory] = useState<Array<object>>([]);
  const [lookup, setLookup] = useState<string>('');

  useEffect(() => {
    chrome.storage.local.get(['user']).then((result) => {
      if (result.hasOwnProperty('user')) {
        setUser(result.user);
      }
    });

    chrome.runtime.onMessage.addListener(({ name, data }) => {
      console.log(data);
      /*
        Adapted from Google Chrome's Dictionary side panel example.
        https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js
      */
      setLookup(data.value);

      if (name === 'glossi-define') {
        const fetchData = async () => {
          try {
            const result = await collect(data.value);
            const newLookupHistory = lookupHistory.slice();
            newLookupHistory.push(result);
            setLookupHistory(newLookupHistory);
            console.log(result)
          } catch(err) {
            console.error('Error fetching data', err)
          }
        }
        fetchData();
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
        {
          lookupHistory.length > 0 ? '# of items in lookupHistory: ' + lookupHistory.length : ''
        }
      </div>
    </div>
  );
}

export default App;