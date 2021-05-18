import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import "./Network.css";
import { WaveLoading } from "react-loadingg";
import Network from "./Network";

function createLinks(nodes, raw) {
  let lines = [];

  raw.forEach((element) => {
    let source = element.source;
    let target = element.target;

    let sourceElement = nodes.find((element) => element.name === source);
    let targetElement = nodes.find((element) => element.name === target);

    lines.push({
      source: sourceElement.id,
      target: targetElement.id,
      weight: element.weight,
    });
  });

  return lines;
}

function createNodes(raw) {
  let characters = [];
  let nodes = [];
  let count = 0;

  raw.forEach((element, index) => {
    let source = element.source;
    let target = element.target;

    if (!characters.includes(source)) {
      characters.push(source);
      nodes.push({ id: count, name: source });
      count += 1;
    }

    if (!characters.includes(target)) {
      characters.push(target);
      nodes.push({ id: count, name: target });
      count += 1;
    }
  });
  return nodes;
}

function mergeData(nodes, links) {
  let data = { nodes: nodes, links: links };
  return data;
}

function TwitterNetwork() {
  const [status, setStatus] = useState(false);
  const [data, setData] = useState({});
  const location = useLocation();
  const oauth_token = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).oauth_token;
  const oauth_verifier = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).oauth_verifier;

  useEffect(() => {
    callbackFunction();
  }, []);

  function callbackFunction() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      oauth_token,
      oauth_verifier,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "manual",
      credentials: "include",
    };

    fetch("http://localhost:3000/callback", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        initializeData(response);
      })
      .catch((error) => console.log("error", error));
  }

  function initializeData(data) {
    console.log("DATA: ", data);
    let nodes = createNodes(data);
    console.log("NODES: ", nodes);
    let links = createLinks(nodes, data);
    console.log("LINKS: ", links);
    let mergedData = mergeData(nodes, links);

    setData(mergedData);
    setStatus(true);
  }

  return (
    <div>
      {status && (
        <div style={{ backgroundColor: "#282c34" }}>
          <Network data={data} linkColor={"#1DA1F2"} />
        </div>
      )}

      {!status && (
        <div className="App">
          <h1 style={{ fontSize: "100%", marginBottom: -100 }}>
            Fetching data...
          </h1>
          <WaveLoading />
        </div>
      )}
    </div>
  );
}

export default TwitterNetwork;
