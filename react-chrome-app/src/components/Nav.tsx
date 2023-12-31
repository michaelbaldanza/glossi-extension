import Anchor from './Anchor';
import Dropdown from './Dropdown';
import ListItem from './ListItem';
import { User } from '../services/interfaces';
import { type DictAbbr, type Page } from '../services/types';

interface NavProps {
  anyLookup: boolean;
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
}

function Nav(props: NavProps) {
  const anyLookup = props.anyLookup;
  const [user, setUser] = props.user;
  const [currentPage, setCurrentPage] = props.currentPage;

  const togglerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>;

  return (
    <nav className="nav navbar navbar-expand-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="https://glossi.lat" target="_blank" title="Open glossi.lat in a new tab">Glossi</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          {/* <span className="navbar-toggler-icon"></span> */}
          <span className="custom-toggler-icon">
            {togglerIcon}
          </span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {
              anyLookup ?
                <ListItem>
                  <Anchor currentPage={[currentPage, setCurrentPage]}  linkedPage={'infobox'}>
                    Look up
                  </Anchor>
                </ListItem>
              :
                ''
            }
            <ListItem>
              <Anchor currentPage={[currentPage, setCurrentPage]}  linkedPage={'decks'}>Decks</Anchor>
            </ListItem>
            <ListItem>
              <Anchor currentPage={[currentPage, setCurrentPage]} linkedPage={'cards'}>Cards</Anchor>
            </ListItem>
            {
              user ?
              <Dropdown text={user.username}>
                <ListItem isDropItem={true}>
                  <Anchor currentPage={[currentPage, setCurrentPage]}  linkedPage={'profile'} isDropItem={true} link={`https://glossi.lat/users/${user.username}`}>
                    View profile
                  </Anchor>
                </ListItem>
                <ListItem isDropItem={true}>
                    <button
                      className="btn btn-link dropdown-item dropdown-link p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUser(null);
                        setCurrentPage('infobox');
                        chrome.storage.local.remove('user');
                      }}
                    >
                      Log out
                    </button>
                </ListItem>
              </Dropdown>
              :
              <>
                <ListItem>
                  <Anchor currentPage={[currentPage, setCurrentPage]}  linkedPage={'login'}>
                    Log in
                  </Anchor>
                </ListItem>
                <ListItem>
                  <Anchor currentPage={[currentPage, setCurrentPage]}  linkedPage={'signup'} link={'https://glossi.lat/signup'}>
                    Sign up
                  </Anchor>
                </ListItem>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav;