(function () {

  // ~~~ NOTE ~~~
  // if you want to steal things for axes/etc
  // chart-5.js is a good source

  var margin = { top: 30, left: 150, right: 30, bottom: 30},
    height = 3000 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select("#chart-6")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Read in some external data.
  // When we're done, run the function 'ready'
  var xPositionScale = d3.scaleLinear()
    .domain([0, 80000])
    .range([0, width])

  var colorScale = d3.scaleOrdinal()
    .range(['lightblue', 'pink'])

  var yPositionScale = d3.scalePoint()
    .range([0, height])

  d3.queue()
    .defer(d3.csv, "data/wide_gdp.csv")
    .await(ready)


  // This is 'ready':
  // it receives an error (if there is one)
  // and datapoints, our newly-read-in data

  function ready(error, datapoints) {
    console.log(datapoints)

    // pluck out the datapoint's coutnry
    // save it to a varialbe calleed ... countries.
    var countries = datapoints.map(function(d) {return d.country})

    var gdp2015 = datapoints.map(function(d) {return +d['2015']})

    var gdp1970 = datapoints.map(function(d) {return +d['1970']})

    // d3 reads data as string
    var maxGDP = d3.max(gdp2015)

    yPositionScale.domain(countries)

    // overwrites the old domain 80000
    xPositionScale.domain([0, maxGDP * 1.03])

    // draw axixs before circles
    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);


    svg.selectAll(".connector")
      .data(datapoints)
      .enter().append("line")
      .attr("class", "connector")
      .attr("stroke-width", 1)
      .attr("stroke", 'black')
      .attr("x1", function(d) {
        return xPositionScale(d['1970'])
      })
      .attr("y1", function(d) {
        return yPositionScale(d.country)
      })
      .attr("x2", function(d) {
        return xPositionScale(d['2015'])
      })
      .attr("y2", function(d) {
        return yPositionScale(d.country)
      })


    svg.selectAll(".gdp1970")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "gdp1970")
      .attr("r", 5)
      .attr("cx", function(d) {
        return xPositionScale(d['1970'])
      })
      .attr("cy", function(d) {
        return yPositionScale(d.country)
      })
    .attr("fill", 'pink')


    svg.selectAll(".gdp2015")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "gdp2015")
      .attr("r", 5)
      .attr("cx", function(d) {
        return xPositionScale(d['2015'])
      })
      .attr("cy", function(d) {
        return yPositionScale(d.country)
      })
      .attr("fill", 'lightblue')

    
  }

})()