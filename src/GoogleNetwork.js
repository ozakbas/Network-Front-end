import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
function GoogleNetwork() {
  const [status, setStatus] = useState("Fetching data...");
  const location = useLocation();
  const token = qs.parse(location.search, { ignoreQueryPrefix: true }).code;

  useEffect(() => {
    callbackFunction();
  }, []);

  function callbackFunction() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      token,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "manual",
    };

    console.log(token);

    fetch("http://localhost:3000/oauth-callback", requestOptions)
      .then((response) => response.json())
      .then((response) => setStatus(JSON.stringify(response)))
      .catch((error) => console.log("error", error));
  }

  return (
    <div>
      <h1>welcome</h1>
      <h1>{status}</h1>
      <h1>log out</h1>
    </div>
  );
}

export default GoogleNetwork;
