import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import { User } from './services/interfaces';
import { type Page } from './services/types';
import { collect } from './services/dictionaries';
import Home from './pages/Home';
import Infobox from './pages/Infobox/Infobox';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lookupHistory, setLookupHistory] = useState<Array<object>>([]);
  const [lookup, setLookup] = useState<string>('promulgate');

  const [currentPage, setCurrentPage] = useState<Page>('infobox');

  function turnPage() {
    const pages: Record<Page, JSX.Element> = {
      'cards': <div>Cards</div>,
      'decks': <div>Decks</div>,
      'infobox': <Infobox />,
      'home': <Home />,
      'login': <Login user={[user, setUser]} />,
      'logout': <div>Log out</div>,
      'profile': <div>Profile</div>,
      'signup': <div>Sign up</div>
    };


    return pages[currentPage];
  }

  // useEffect(() => {
  //   chrome.storage.local.get(['user']).then((result) => {
  //     if (result.hasOwnProperty('user')) {
  //       setUser(result.user);
  //     }
  //   });

  //   chrome.runtime.onMessage.addListener(({ name, data }) => {
  //     console.log(data);
  //     /*
  //       Adapted from Google Chrome's Dictionary side panel example.
  //       https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js
  //     */
  //     setLookup(data.value);

  //     if (name === 'glossi-define') {
  //       const fetchData = async () => {
  //         try {
  //           const result = await collect(data.value);
  //           const newLookupHistory = lookupHistory.slice();
  //           newLookupHistory.push(result);
  //           setLookupHistory(newLookupHistory);
  //           console.log(result)
  //         } catch(err) {
  //           console.error('Error fetching data', err)
  //         }
  //       }
  //       fetchData();
  //     }
  //   });

  // }, [])

  return (
    <div>
      <Nav currentPage={[currentPage, setCurrentPage]} user={[user, setUser]} />
      <div>{turnPage()}</div>
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