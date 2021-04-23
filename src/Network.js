import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function Network({ data }) {
  function initializeGraph(data, svgClass, width, height) {
    //Initializing chart
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
            if (w > 1 && w <= 50) return 270;
            else if (w > 50 && w <= 200) return 250;
            else if (w > 200) return 200;
          })
          .strength(0.3)
      )
      .force("forceX", d3.forceX().strength(0.1))
      .force("forceY", d3.forceY().strength(0.4))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("collide", d3.forceCollide().strength(0.5).radius(30))
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
        return d.weight / 20 + 1;
      })
      .style("stroke", function (d) {
        return `rgba(0, ${d.weight * 5}, 0,  ${d.weight / 25})`;
      })
      .style("opacity", 0.2);

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

    /*
    node
      .append("img")
      .attr("class", "img")
      .attr("src", function (d) {
        let path = `/resized-images/${d.name}.jpg`;
        return process.env.PUBLIC_URL + path;
      })

      .attr("height", 60)
      .attr("width", 60)
      .on("error", function () {
        d3.select(this).remove();
      });
*/

    node
      .append("text")
      .text(function (d) {
        return d.name;
      })
      .style("font-size", "12px")
      .style("color", "#212121")
      .style("font-weight", "600");

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
        return "left: " + d.x + "px; top: " + (d.y + 72) + "px";
      });
    };

    //Starting simulation
    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);
  }

  useEffect(() => {
    console.log(data);
    initializeGraph(data, ".chart", 1680, 800);
  }, []);

  return (
    <div className="container">
      <div className="chartContainer">
        <svg className="chart"></svg>
      </div>
    </div>
  );
}

export default Network;
