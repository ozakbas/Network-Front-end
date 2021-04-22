import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
function Network() {
  const [info, setInfo] = useState("not logged in");
  const location = useLocation();
  const oauth_token = qs.parse(location.search, { ignoreQueryPrefix: true })
    .oauth_token;
  const oauth_verifier = qs.parse(location.search, { ignoreQueryPrefix: true })
    .oauth_verifier;

  useEffect(() => {
    callbackFunction();
  }, []);

  function callbackFunction() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      oauth_verifier: oauth_verifier,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "manual",
      credentials: "include",
    };

    fetch("http://localhost:3000/callback", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <div>
      <h1>welcome</h1>
      <h1>{info}</h1>
      <h1>log out</h1>
    </div>
  );
}

export default Network;
