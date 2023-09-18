function Main() {
  function makeDictionaryPanels() {
    const refOrder = ['wikt', 'fd'];
    return refOrder.map((dictabbr, idx0) => (
      <div key={`${dictabbr}-${idx0}`}>
        {dictabbr}
      </div>
    ))
  }

  return (
    <div>
      {makeDictionaryPanels()}
    </div>
  );
}

export default Main;