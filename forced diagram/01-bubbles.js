(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  var radiusScale = d3.scaleSqrt()
    .domain([0, 300])
    .range([0, 80])

  /*
    Needs a d3 forceSimulation!
    used to figure out where everything goes

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

  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.sales) + 1
    }))

  d3.queue()
    .defer(d3.csv, "sales.csv")
    .await(ready)

  function ready (error, datapoints) {

    // Add a circle for every datapoint
    // move them all to... I don't know, the middle
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr('fill', 'lightblue')
      .attr('r', function(d) {
        return radiusScale(d.sales)
      })
      .attr('cx', 0)
      .attr('cy', 0)
      
    // We'll use this later
    // Hey simulation, here are our datapoints!

    simulation.nodes(datapoints)
      .on('tick', ticked)

    d3.select("#decades").on('click', function() {
      var splitForce = d3.forceX(function(d) {
        if(d.decade === "pre-2000") {
          return width * 0.3
        } else {
          return width * 0.7
        }
      }).strength(1)
      // some of you go left, some of you go right
      simulation.force("x", splitForce)
      // Now restart the simulation
      simulation.alphaTarget(0.3).restart()
    })

    d3.select("#no-decades").on('click', function() {
      // Go back to the middle EVERYONE
      simulation.force("x", d3.forceX(width / 2))
      // Now restart the simulation
      simulation.alphaTarget(0.3).restart()
    })
  
    // We'll use this later
    function ticked() {
      svg.selectAll("circle")
          .attr("cx", function(d) { 
            return d.x;
          })
          .attr("cy", function(d) { return d.y; });
    }

  }

})();