import './App.css';
import './factionComponents';
import FactionButtons from "./factionComponents";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Header/>
          <FactionButtons/>

      </header>
    </div>
  );
}

function Header() {
  return (
      <div className="KillTeamHeader">
            <h1>Kill Team</h1>
            <h2>Choose a faction:</h2>
      </div>
  );
}

export default App;
