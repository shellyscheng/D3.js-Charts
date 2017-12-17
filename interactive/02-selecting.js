(function () {

  var margin = { top: 50, left: 50, right: 50, bottom: 50},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // death rate
  var xPositionScale = d3.scaleLinear()
    .domain([0, 50000])
    .range([0, width])

  // life expectancy
  var yPositionScale = d3.scaleLinear()
    .domain([30, 85])
    .range([height, 0])

  var colorScale = d3.scaleOrdinal()
    .range(['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f'])

  // Make a queue of things to do
  // The first is: use d3.csv to read in countries.csv
  // and when you're done, go run ready
  d3.queue()
    .defer(d3.csv, "data/countries.csv")
    .await(ready)

  // This is 'ready':
  // it receives an error (if there is one)
  // and datapoints, our newly-read-in data

  function ready(error, countries) {
    // GDP_per_capita,life_expectancy
    svg.selectAll("circle")
      .data(countries)
      .enter().append("circle")
      .attr("class", function(d) {
        // S. America is not a good class name!
        // let's make it all lowercase
        // then replace all non-letters with hyphens
        return d.continent.toLowerCase().replace(/[^\w]+/g,"-")
      })
      .attr("r", 5)
      .attr("cx", function(d) {
        return xPositionScale(d.gdp_per_capita)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.life_expectancy)
      })
      .attr("fill", function(d) {
        return colorScale(d.continent)
      })
      .attr("opacity", 0.5)

    svg.append("text")
      .text("Life Expectancy vs. GDP")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 24)


    // Go grab the oceania button
    // Set its background to be the color of Oceania circles
    // P.S. we set its padding and font color using CSSin the HTML file
    d3.select(".oceania-select")
      .style("background", colorScale("Oceania"))
      .on('mouseover', function(d) {
        // this runs when the mouse goes over 'oceania'
        // first turn EVERYTHING grey
        svg.selectAll("circle")
          .attr("fill", "lightgrey")

        // then turn oceania the color of Oceania
        svg.selectAll(".oceania")
          .attr("fill", colorScale("Oceania"))
      })
      .on('mouseout', function(d) {
        svg.selectAll("circle")
          .attr("fill", function(d) {
            return colorScale(d.continent)
          })
      })

    // Just copy and paste from the Oceania stuff, really!
    d3.select(".asia-select")
      .style("background", colorScale("Asia"))
      .on('mouseover', function(d) {
        // this runs when the mouse goes over 'oceania'
        // first turn EVERYTHING grey
        svg.selectAll("circle")
          .attr("fill", "lightgrey")
        // then turn oceania black
        svg.selectAll(".asia")
          .attr("fill", "red")
      })
      .on('mouseout', function(d) {
        svg.selectAll("circle")
          .attr("fill", function(d) {
            return colorScale(d.continent)
          })
      })

    d3.select(".sa-select")
      .style("background", colorScale("S. America"))
      .on('mouseover', function(d) {
        // this runs when the mouse goes over 'oceania'
        // first turn EVERYTHING grey
        svg.selectAll("circle")
          .attr("fill", "lightgrey")
        // then turn south american circles black
        svg.selectAll(".s-america")
          .attr("fill", "red")
      })
      .on('mouseout', function(d) {
        svg.selectAll("circle")
          .attr("fill", function(d) {
            return colorScale(d.continent)
          })
      })

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var xAxis = d3.axisBottom(xPositionScale)
      .tickFormat(d3.format("$,d"))

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  }

})()