import "./App.css";
import TwitterButton from "./button_twitter.png";
import GoogleButton from "./button_google.png";
import UploadButton from "./button_upload.png";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import TwitterNetwork from "./TwitterNetwork.js";
import GoogleNetwork from "./GoogleNetwork.js";
import CustomNetwork from "./CustomNetwork.js";
import { Component } from "react";

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

class App extends Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
    jsonObject: null,
  };

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    var reader = new FileReader();
    reader.onload = this.onFileRead;
    reader.readAsText(event.target.files[0]);
    //this.setState({ selectedFile: obj });
  };

  onFileRead = (event) => {
    const obj = JSON.parse(event.target.result);
    console.log(obj);
    this.setState({ jsonObject: JSON.stringify(obj) });
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h5>File Details:</h5>
          <p>
            <small>
              <small>File Name: {this.state.selectedFile.name}</small>
            </small>
          </p>
          <p>
            <small>
              <small>File Type: {this.state.selectedFile.type}</small>
            </small>
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <code style={{ fontSize: "60%" }}>
            Make sure your JSON file is in the following format: [
            {JSON.stringify({
              source: "...",
              target: "...",
              weight: 10,
            })}
            ...]
          </code>
        </div>
      );
    }
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <div className="App">
              <div style={styles.container}>
                <h1>Sign in or upload JSON file to visualise your network</h1>
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
                <Link
                  to={{
                    pathname: "/custom",
                    state: this.state.jsonObject,
                  }}
                >
                  <img src={UploadButton} style={styles.button} alt="upload" />
                </Link>

                <input type="file" onChange={this.onFileChange} />
                {this.fileData()}
              </div>
            </div>
          </Route>
          <Route path="/twitter/callback">
            <TwitterNetwork />
          </Route>

          <Route path="/oauth-callback">
            <GoogleNetwork />
          </Route>

          <Route path="/custom">
            <CustomNetwork />
          </Route>
        </Switch>
      </Router>
    );
  }
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
