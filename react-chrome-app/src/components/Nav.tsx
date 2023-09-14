import Anchor from './Anchor';
import Dropdown from './Dropdown';
import ListItem from './ListItem';
import { User } from '../services/interfaces';

interface NavProps {
  user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
}

function Nav(props: NavProps) {
  const [user, setUser] = props.user;

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
            <ListItem>
              <Anchor>Decks</Anchor>
            </ListItem>
            <ListItem>
              <Anchor>Cards</Anchor>
            </ListItem>
            {
              user ?
              <Dropdown text={user.username}>
                <ListItem isDropItem={true}>
                  <Anchor isDropItem={true} link={`https://glossi.lat/users${user.username}`}>
                    View profile
                  </Anchor>
                </ListItem>
                <ListItem isDropItem={true}>
                  <Anchor isDropItem={true}>
                    Log out
                  </Anchor>
                </ListItem>
              </Dropdown>
              :
              <>
                <ListItem>
                  <Anchor>
                    Log in
                  </Anchor>
                </ListItem>
                <ListItem>
                  <Anchor link={'https://glossi.lat/signup'}>
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