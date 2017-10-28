(function() {

  var margin = { top: 70, left: 50, right: 115, bottom: 30},
    height = 700 - margin.top - margin.bottom,
    width = 450 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%y-%b")

  var xPositionScale = d3.scaleLinear().range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([150,340]).range([height, 0]);
  var colorScale = d3.scaleOrdinal().range(["#e41a1c","#377eb8","#4daf4a", "#984ea3", "#ff7f00", "#F9CB1F"])

  var line = d3.line()
    .x(function(d) {return xPositionScale(d.datetime)})
    .y(function(d) {return yPositionScale(d.price)})

  var area = d3.area()
    .y0(function(d) { return 0})
    .y1(function(d) { return height})

  d3.queue()
    .defer(d3.csv, "housing-prices.csv", function(d) {
      d.datetime = parseTime(d.month);
      return d;
    })
    .await(ready);


  function ready(error, datapoints) {

    var dates = datapoints.map(function(d) {return d.datetime})

    var dateMax = d3.max(dates)
    var dateMin = d3.min(dates)

    xPositionScale.domain([dateMin, dateMax])

    //console.log(datapoints)

    // svg.selectAll("circle")
    //   .data(datapoints)
    //   .enter().append("circle")
    //   .attr("cx", function(d) {return xPositionScale(d.datetime)})
    //   .attr("cy", function(d) {return yPositionScale(d.price)})
    //   .attr("r", 3)


    var nested = d3.nest()
      .key(function(d) {return d.region})
      .entries(datapoints)

    //console.log(nested)

    svg.append("rect")
      .data(nested)
      .attr("x", function(d) {return xPositionScale(d.values[7].datetime)})
      .attr("y", 0)
      .attr("height", height)
      .attr("width", function(d) {return xPositionScale(d.values[6].datetime) - xPositionScale(d.values[8].datetime)})
      .attr("fill", "lightgrey")


    
    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("d", function(d) {return line(d.values)})
      .attr("stroke", function(d) {return colorScale(d.key)})
      .attr("fill", "none")
      .attr("stroke-width", 2)

    svg.selectAll("circle")
      .data(nested)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {return xPositionScale(d.values[0].datetime)})
      .attr("cy", function(d) {return yPositionScale(d.values[0].price)})
      .attr("fill", function(d) {return colorScale(d.key)})


    svg.selectAll("text")
      .data(nested)
      .enter().append("text")
      .attr("font-size", "10px")
      .text(function(d) {return d.key})
      .attr("fill", "black")
      .attr("x", function(d) {return xPositionScale(d.values[0].datetime)})
      .attr("y", function(d) {return yPositionScale(d.values[0].price)})
      .attr("dx", 5)
      .attr("dy", 5)


    svg.append("text")
      .attr("font-size", "20px")
      .text("U.S. housing prices fall in winter")
      .attr("x", width/2)
      .attr("y", -30)
      .attr("text-anchor", "middle")


     
    var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat("%b %y"));
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);


  }
  
})();