import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import "./Network.css";

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

function CustomNetwork() {
  const [status, setStatus] = useState(false);
  const [data, setData] = useState({});
  const location = useLocation();
  const token = qs.parse(location.search, { ignoreQueryPrefix: true }).code;

  useEffect(() => {
    const data = JSON.parse(location.state);
    console.log(data);
    initializeData(data);
  }, []);

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
      {status && <Network data={data} />}

      {!status && <h1>Preparing Network</h1>}
    </div>
  );
}

export default CustomNetwork;
