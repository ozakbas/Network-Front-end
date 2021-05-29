import "./App.css";
import TwitterButton from "./button_twitter.png";
import GoogleButton from "./button_google.png";
import UploadButton from "./button_upload.png";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import TwitterNetwork from "./TwitterNetwork.js";
import GoogleNetwork from "./GoogleNetwork.js";
import CustomNetwork from "./CustomNetwork.js";
import { Component } from "react";
import ImageUploader from 'react-images-upload';

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
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "manual",
    credentials: "include",
  };
  fetch("http://localhost:3000/getGoogleData", requestOptions)
    .then((response) => {
      window.open(response.url, "_self");
    })

    .catch((error) => console.log("there is an error", error));
}

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      // Initially, no file is selected
      selectedFile: null,
      jsonObject: null,
      pictures: []
    };
    this.onDrop = this.onDrop.bind(this);
  }
  
  onDrop(picture) {
    this.setState({
        pictures: this.state.pictures.concat(picture),
    });
  }

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    const allowedExtensions =  ['json','txt'];
    const fileName = event.target.files[0].name;
    const fileExtension = fileName.split(".").pop();
    if(!allowedExtensions.includes(fileExtension)){
      alert("File type not allowed.");
      event.target.value = '';
    }
    else {
      var reader = new FileReader();
      reader.onload = this.onFileRead;
      reader.readAsText(event.target.files[0]);
      this.setState({ selectedFile: event.target.files[0] });
    }
  };

  onFileRead = (event) => {
    try {
      const obj = JSON.parse(event.target.result);
      this.setState({ jsonObject: JSON.stringify(obj) });
    }
    catch {
      alert("File is not in JSON format.");
      this.setState({ selectedFile: null });
    }  
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <code style={{ fontSize: "40%" }}>
            File Name: {this.state.selectedFile.name}
            File Type: {this.state.selectedFile.type}
          </code>
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
                {this.state.selectedFile!=null &&
                  <Link
                    to={{
                      pathname: "/custom",
                      state: this.state.jsonObject,
                    }}
                  >
                    <img src={UploadButton} style={styles.button} alt="upload" />
                  </Link>
                }
                <input type="file" accept=".json, .txt" onChange={this.onFileChange} />
                {this.fileData()}
                <ImageUploader
                  withIcon={true}
                  withPreview={true}
                  buttonText='Choose images'
                  onChange={this.onDrop}
                  imgExtension={['.jpg', '.gif', '.png', '.gif']}
                  maxFileSize={5242880}
                />
                {this.state.pictures.length!==0 && <img src={URL.createObjectURL(this.state.pictures[0])}></img>}
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
            <CustomNetwork jsonData={this.state.jsonObject} pictures={this.state.pictures}/>
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
