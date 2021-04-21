import "./App.css";
import TwitterButton from "./button_twitter.png";
import GoogleButton from "./button_google.png";
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Network from "./Network.js";

function App() {
  const [info, setInfo] = useState("not logged in");

  function callbackFunction() {
    fetch("http://localhost:3000/twitter/callback", {
      method: "GET",
      body: {},
    })
      .then((response) => {
        console.log(response);
      })

      .catch((error) => console.log("there is an error", error));
  }

  function loginTwitter() {
    fetch("http://localhost:3000/twitter/authorize", {
      method: "GET",
      redirect: "manual",
    })
      .then((response) => {
        setInfo(response);

        //window.location = response.url;

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
          <Network />
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
