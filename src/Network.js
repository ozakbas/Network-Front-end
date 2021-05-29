import React, { useEffect } from "react";
import * as d3 from "d3";

function Network({ data, linkColor, pictures }) {
  let max = 0;

  function MaxWeight(data) {
    for (let i = 0; i < data.links.length; i++) {
      if (data.links[i].weight > max) {
        max = data.links[i].weight;
      }
    }
  }
  function initializeGraph(data, svgClass, width, height) {
    //Initializing chart
    const previousSmallChart = d3.select(svgClass);
    previousSmallChart.selectAll("g").remove();

    const removeElements = (elms) => elms.forEach((el) => el.remove());
    removeElements(document.querySelectorAll(".node"));

    const chart = d3
      .select(svgClass) //.chart
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const tooltip = d3
      .select(".container")
      .append("div")
      .attr("class", "tooltip")
      .html("Tooltip");

    //Initializing force simulation
    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .distance(function (d) {
            let w = d.weight;
            if (w >= 1 && w <= max * 0.3) return 600;
            else if (w > max * 0.3 && w <= max * 0.5) return 400;
            else if (w > max * 0.5 && w <= max * 0.9) return 200;
            else if (w > max * 0.9) return 100;
          })
          .strength(0.3)
      )
      .force("forceX", d3.forceX().strength(height / 10000))
      .force("forceY", d3.forceY().strength(width / 10000))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("collide", d3.forceCollide().strength(0.5).radius(50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(0))
      .force("x", d3.forceX(0));

    //Drag functions
    const dragStart = (e, d) => {
      if (!e.active) simulation.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const drag = (e, d) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragEnd = (e, d) => {
      if (!e.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    //Creating links
    const link = chart
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke-width", function (d) {
        return d.weight / 3;
      })
      .style("stroke", linkColor)
      .style("opacity", 0.8);

    //Creating nodes
    const node = d3
      .select(".chartContainer")
      .selectAll("div")
      .data(data.nodes)
      .enter()
      .append("div")

      .attr("class", (d) => {
        return "node node-" + d.name;
      })
      .call(
        d3.drag().on("start", dragStart).on("drag", drag).on("end", dragEnd)
      )
      .on("mouseover", (e, d) => {
        tooltip
          .html(d.name)
          .style("left", e.pageX + 5 + "px")
          .style("top", e.pageY + 5 + "px")
          .style("opacity", 0.8);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0).style("left", "0px").style("top", "0px");
      });
    // Append images
    node
    .append("img")
    .attr("class", "img")
    .attr("src", function (d) {
      const extensions = ['.jpg', '.gif', '.png', '.gif'];
      let index = -1;
      extensions.forEach(ext => {
        const i = pictures.findIndex(pic => pic.name === `${d.name}${ext}`);
        console.log({ext,i});
        if(i!==-1) { index=i; } 
      });
      if(index!==-1) { return URL.createObjectURL(pictures[index]); }
    })

    .attr("height", 60)
    .attr("width", 60)
    .on("error", function () {
      d3.select(this).remove();
    });
    node
      .append("text")
      .text(function (d) {
        var email = d.name.split("@");
        var name = email[0];
        return name + "\n";
      })
      .style("font-size", function (d) {
        let min = 2;
        let maxFont = 50;
        let minFont = 15;
        let scaledWeight =
          ((maxFont - minFont) * (d.weight - min)) / (max - min) + minFont;
        return `${scaledWeight}px`;
      })
      .style("font-weight", "700");
    node
      .append("text")
      .text(function (d) {
        var email = d.name.split("@");
        var domain = email[1];
        return domain;
      })
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("opacity", 0.5);

    //Setting location when ticked
    const ticked = () => {
      link
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });

      node.attr("style", (d) => {
        return "left: " + (d.x - 20) + "px; top: " + (d.y - 20) + "px";
      });
    };

    //Starting simulation
    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);
  }

  useEffect(() => {
    console.log(data);

    MaxWeight(data);
    console.log(window.innerHeight, window.innerWidth);
    initializeGraph(data, ".chart", window.innerWidth, window.innerHeight);
  }, []);

  return (
    <div className="network">
      <div className="container">
        <div className="chartContainer">
          <svg className="chart"></svg>
        </div>
      </div>
    </div>
  );
}

export default Network;
