(function () {

  var margin = { top: 50, left: 50, right: 50, bottom: 50},
      height = 500 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart-1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Country:</strong> <span>" + d.country + "</span>";
    })

  svg.call(tip)



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
      .on("click", function(d) {
        // d3, go get the
        // element and make
        // the radius 30

        var element = d3.select(this)

        if(element.attr("r") === '30') {
          element.transition().attr("r", 3)
        } else {
          element.transition().attr("r", 30)
        }
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      // .on("mouseover", function(d) {
      //   d3.select(this)
      //     .attr("fill", "black")
      // })
      // .on("mouseout", function(d) {
      //   d3.select(this)
      //     .attr("fill", colorScale(d.continent))
      // })




    // Always cut and paste the code for the axes, too!

    svg.append("text")
      .text("Life Expectancy vs. GDP")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 24)

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