(function() {
  var margin = { top: 50, left: 100, right: 100, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-5")
        .append("svg")
        .style("background", "#bfd3e6")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var radiusScale = d3.scaleSqrt().domain([0, 10]).range([0, 30])
  var colorScale = d3.scaleOrdinal()
    .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])

  var yPositionScale = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0])

  var xPositionScale = d3.scalePoint()
    .padding(0.5)
    .range([0, width])

  /* Pull in world and capitals */
  
  d3.queue()
    .defer(d3.csv, "data/capitals.csv")
    .defer(d3.json, "data/world.topojson")
    .await(ready)

  /* 
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale)
  */

  var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100)

  /*
    create a path (geoPath)
    using the projection
  */
  var path = d3.geoPath()
    .projection(projection)

  function ready (error, capitals, world) {

    console.log(capitals)
    console.log(world)

    /* Tell the xPositionScale the continents */
    var continents = capitals.map(function(d) {
      return d.continent
    })

    xPositionScale.domain(continents)


    /* 
      topojson.feature gets..
        1) ALL OF YOUR DATA
        2) the subset of your data that you're interested in

      Usually you'll just be changing 
        world.objects.______
    */
    var worldData = topojson.feature(world, world.objects.countries).features

    console.log(worldData)

    /* Draw your countries */

    svg.selectAll(".country")
      .data(worldData)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", function(d) {
        return path(d)
      })
      .attr("fill", "#cccccc")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)

    /* Draw your circles */

    svg.selectAll(".capital")
      .data(capitals)
      .enter().append("circle")
      .attr("class", "capital")
      .attr("r", 5)
      .on('mouseover', function(d) {
        console.log(d)
      })
      .attr("fill", function(d) {
        return colorScale(d.continent)
      })
      .attr("opacity", 0.8)
      .attr("stroke", "black")

    function updateMap() {
        svg.selectAll(".axis")
          .attr("opacity", 1)
          .transition()
          .duration(1500)
          .attr("opacity", 0)
          .remove()

        svg.selectAll(".country")
          .transition()
          .duration(1500)
          .attr("opacity", 1)

        svg.selectAll(".capital")
          .transition()
          .duration(1500)
          .attr("cx", function(d) {
            var coords = projection([d.long, d.lat])
            return coords[0]
          })
          .attr("cy", function(d) {
            var coords = projection([d.long, d.lat])
            return coords[1]
          })
          .attr('r', function(d) {
            return radiusScale(d.population)
          })
    }

    function updateChart () {
        svg.selectAll(".capital")
          .transition()
          .duration(1500)
          .attr("r", 5)
          .attr("cx", function(d) {
            return xPositionScale(d.continent)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.population)
          })

        svg.selectAll(".country")
          .attr("opacity", 1)
          .transition()
          .duration(1500)
          .attr("opacity", 0)

        var xAxis = d3.axisBottom(xPositionScale)
        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)

        var yAxis = d3.axisLeft(yPositionScale)
        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis)
    }

    d3.select("#make-a-map")
      .on('click', updateMap)

    d3.select("#make-a-chart")
      .on('click', updateChart)

    updateMap()
  }

})();