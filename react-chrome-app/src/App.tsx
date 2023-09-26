import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import { User } from './services/interfaces';
import type { Lookup, Page } from './services/types';
import { collect } from './services/dictionaries';
import Infobox from './pages/Infobox/Infobox';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lookupHistory, setLookupHistory] = useState<Array<Lookup>>([]);
  const [lookupIdx, setLookupIdx] = useState<number>(0);
  const [selLang, setSelLang] = useState<string | null>(null);
  const [browserWord, setBrowserWord] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<Page>('infobox');
  console.log(`at App level lookupHistory.length is ${lookupHistory.length}, lookupIdx is ${lookupIdx}, and lookupHistory looks like this`)
  console.log(lookupHistory)
  function turnPage() {
    const pages: Record<Page, JSX.Element> = {
      'cards': <div>Cards</div>,
      'decks': <div>Decks</div>,
      'infobox': <Infobox
        lookupIdx={[lookupIdx, setLookupIdx]}
        lookupHistory={[lookupHistory, setLookupHistory]}
        selLang={[selLang, setSelLang]}
        />,
      'login': <Login
        currentPage={[currentPage, setCurrentPage]}
        user={[user, setUser]}
      />,
      'logout': <div>Log out</div>,
      'profile': <div>Profile</div>,
      'signup': <div>Sign up</div>
    };


    return pages[currentPage];
  }

  useEffect(() => {
    /* remove chrome.storage calls for troubleshooting in development */
    console.log(`RUNNING useEFFECT`)
    console.log(`at useEffect level lookupHistory.length is ${lookupHistory.length}, lookupIdx is ${lookupIdx}, and lookupHistory looks like this`)
    console.log(lookupHistory)
    if (!user) {
      chrome.storage.local.get(['user']).then((result) => {
        if (result.hasOwnProperty('user')) {
          setUser(result.user);
        }
      });
    }

    chrome.runtime.onMessage.addListener(({ name, data }) => {
      /*
        Adapted from Google Chrome's Dictionary side panel example.
        https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js
      */
      const lookup: string = data.value;
      if (name === 'glossi-define') {
        const fetchData = async () => {
          console.log(`HITTING fetchDATA`)
          console.log(`The lookup is ${lookup.toUpperCase()}`)
          try {
            const newLookup: Lookup = {
              quarry: lookup,
              result: await collect(lookup)
            };
            const wiktRes = newLookup.result.wikt.response;
            if (!wiktRes.hasOwnProperty('title')) {
              setSelLang(wiktRes.hasOwnProperty('en') ? 'en' : Object.keys(wiktRes)[0])
            } else {
              setSelLang(null);
            }
            // console.log(` in useEffect fetchData, lookupIdx is ${lookupIdx}, and lookupHistory.length is ${lookupHistory.length}`)
            // console.log(`going to try to make lookupHistory look like this`);
            // console.log([...lookupHistory.slice(0, lookupIdx + 1), newLookup]);
            const newLookupHistory = [...lookupHistory.slice(0, lookupIdx + 1), newLookup];
            const newLookupIdx = newLookupHistory.length - 1;
            // console.log(`apparently the last item in the array is at idx ${newLookupIdx}`)
            // console.log(newLookupHistory[newLookupIdx]);
            setLookupHistory(newLookupHistory);
            setLookupIdx(newLookupHistory.length - 1);
            setCurrentPage('infobox')
            // });
          } catch(err) {
            console.error('Error fetching data', err)
          }
          console.log(`EXITING fetchDATA`)
        }
        fetchData();
      }
    });
    console.log('leaving useEffect')
  }, [lookupHistory, lookupIdx, currentPage, selLang])
    


    /* 
      presetting lookup in development
    */
  //   if (lookupHistory.length < 1) {
  //     const lookup = "étoufferais";
  //     const fetchData = async () => {
  //       try {
  //         const newLookupHistory = lookupHistory.slice();
  //         const newLookup: Lookup = {
  //           quarry: lookup,
  //           result: await collect(lookup)
  //         };
  //         const wiktRes = newLookup.result.wikt.response;
  //         if (!wiktRes.hasOwnProperty('title')) {
  //           setSelLang(wiktRes.hasOwnProperty('en') ? 'en' : Object.keys(wiktRes)[0])
  //         } else {
  //           setSelLang(null);
  //         }
  //         newLookupHistory.push(newLookup);
          
  //         setLookupHistory(newLookupHistory);
  //         setCurrentPage('infobox')
  //         // });
  //       } catch(err) {
  //         console.error('Error fetching data', err)
  //       }
  //     }
  //     fetchData();
  //   }
  // }, [])

  return (
    <div>
      <Nav currentPage={[currentPage, setCurrentPage]} user={[user, setUser]} />
      <main className="container-fluid">{turnPage()}</main>
    </div>
  );
}

export default App;