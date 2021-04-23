import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";

import Network from "./Network";

function GoogleNetwork() {
  const [status, setStatus] = useState(false);
  const [data, setData] = useState({});
  const location = useLocation();
  const token = qs.parse(location.search, { ignoreQueryPrefix: true }).code;

  useEffect(() => {
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

    fetch("http://localhost:3000/oauth-callback", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        initializeData(response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  function initializeData(links) {
    let nodes = [];
    let new_links = [];

    nodes.push({ id: 0, name: links[0].target });

    links.forEach((element, index) => {
      nodes.push({ id: index + 1, name: element.source });

      new_links.push({
        source: index + 1,
        target: 0,
        weight: element.weight,
      });
    });

    let data = { nodes: nodes, links: new_links };

    setData(data);
    setStatus(true);
  }

  return (
    <div>
      {status && <Network data={data} />}

      {!status && <h1>Fetching data</h1>}
    </div>
  );
}

export default GoogleNetwork;
