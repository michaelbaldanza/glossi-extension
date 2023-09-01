import Nav from './components/Nav';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Nav />
      <div className="infobox">
        <Login />
      </div>
    </div>
  );
}

export default App;