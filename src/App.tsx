import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Client from './Client';
import MainMenu from './MainMenu';

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <MainMenu />
          </Route>
          <Route path="/test">
            <Client debug={"test"}/>
          </Route>
          <Route path="/:matchID/:numPlayers/:playerID">
              <Client />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
