import "./App.css";
import TwitterButton from "./button_twitter.png";
import GoogleButton from "./button_google.png";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import TwitterNetwork from "./TwitterNetwork.js";
import GoogleNetwork from "./GoogleNetwork.js";

function App() {
  function loginTwitter() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "manual",
      credentials: "include",
    };
    fetch("http://localhost:3000/twitter/authorize", requestOptions)
      .then((response) => {
        window.open(response.url, "_self");
      })

      .catch((error) => console.log("there is an error", error));
  }

  function loginGoogle() {
    fetch("http://localhost:3000/getGoogleData")
      .then((response) => response.text())

      .then((result) => console.log(result))
      .catch((error) => console.log("there is an error", error));
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <header className="App-header">
              <div style={styles.container}>
                <h1>Sign in to visualise your network</h1>
                <img
                  src={TwitterButton}
                  onClick={() => loginTwitter()}
                  style={styles.button}
                  alt="twitter"
                />
                <img
                  src={GoogleButton}
                  onClick={() => loginGoogle()}
                  style={styles.button}
                  alt="google"
                />
              </div>
            </header>
          </div>
        </Route>
        <Route path="/twitter/callback">
          <TwitterNetwork />
        </Route>

        <Route path="/oauth-callback">
          <GoogleNetwork />
        </Route>
      </Switch>
    </Router>
  );
}

const styles = {
  container: {
    maxWidth: "45%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    width: 180,
    cursor: "pointer",
    margin: 10,
  },
};

export default App;
