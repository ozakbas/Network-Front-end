import "./Network.css";
import { WaveLoading } from "react-loadingg";
import Network from "./Network";
import React from "react";

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
      info: element.info,
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

class CustomNetwork extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      status: false,
      data: {}  
    };
  }

  initializeData() {
    const data = JSON.parse(this.props.jsonData);
    let nodes = createNodes(data);
    let links = createLinks(nodes, data);
    let mergedData = mergeData(nodes, links);
    this.setState({status: true, data: mergedData});
  }

  render () {
    return(
      <div>
        {this.state.status && 
          (
        <div style={{ backgroundColor: "#282c34" }}>
          <Network data={this.state.data} linkColor={"#c2680e"} pictures={this.props.pictures} />
        </div>
      )}
        {!this.state.status && this.initializeData() &&
          (
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
}
export default CustomNetwork;
