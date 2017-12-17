(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  /*
    The simulation needs to know about...
    1) pushing apart
    2) acknowledging links,
    3) not overlapping/colliding
    4) default positions on the x and y

    Node-link charts (can) require: 
      forceManyBody, forceCenter, forceCollide, 
      forceLink, forceX and forceY

    Create your simulation here
  */

  var linkForce = d3.forceLink()
    .id(function(d) { return d.id })

  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.02))
    .force("y", d3.forceY(height / 2).strength(0.02))
    .force("collide", d3.forceCollide(17))
    .force("manybody", d3.forceManyBody(-200))
    .force("links", linkForce)

  d3.queue()
    .defer(d3.json, "network.json")
    .await(ready)

  function ready (error, graph) {
    // 'datapoints' has been renamed to 'graph'
    // all our links are graph.links
    // all of our nodes are graph.nodes

    console.log(graph)

    /*
      If we end up wanting patterns our pattern wants to look something like this
      <pattern height="100%" width="100%" patternContentUnits="objectBoundingBox">
        <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="snow.png"></image>
      </pattern>
    */

    var draggable = d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended)

    // Let's add a line for every link

    // Let's add a circle for every node

    var circles = svg.selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 15)
      .attr("fill", "pink")
      .attr("cx", 0)
      .attr("cy", 0)
      .call(draggable)

    var lines = svg.selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke", "black")
      .attr("stroke-width", function(d) {
        return d.weight
      })

    // If you get tired of doing svg.selectAll(".artist")
    // you can always just save it into a variable
    // probably you should call it 'nodes'
    // make it draggable!


    // tell the simulation about the nodes
    // and what to do when the tick event fires
    simulation.nodes(graph.nodes)
      .on('tick', ticked)

    // lets go grab the force we called 'links'
    // and tell it about the links between nodes
    simulation.force("links")
      .links(graph.links)

    // Every tick, let's update the links and nodes
    function ticked() {
      lines
        .attr("x1", function(d) { return d.source.x })
        .attr("y1", function(d) { return d.source.y })
        .attr("x2", function(d) { return d.target.x })
        .attr("y2", function(d) { return d.target.y })

      circles
        .attr("cx", function(d) { return d.x })
        .attr("cy", function(d) { return d.y })
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      // Don't let the circle move!
      // Keep .fx and .fy to be the same as its current position.
      // FIXED x and FIXED y
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragged(d) {
      // d.fx and d.fx
      // they mean "FORCE IT TO BE HERE DON'T LET IT MOVE"
      // d3.event has an x and a y............
      // maybe we could do something with those
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      // allow them to go back to wherever
      d.fx = null
      d.fy = null
    }

  }

})();