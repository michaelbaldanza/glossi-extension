import Header from './Header';
import Main from './Main';
import Nav from './Nav';

function Infobox() {
  function makeDictionaryPanels() {
    const refOrder = ['wikt', 'fd'];
    return refOrder.map((dictabbr, idx0) => (
      <div key={`${dictabbr}-${idx0}`}>
        {dictabbr}
      </div>
    ))
  }

  return (
    <div className="infobox">
      <Header />
      <Nav />
      <Main />
    </div>
  );
}

export default Infobox;