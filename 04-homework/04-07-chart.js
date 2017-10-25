(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 50, left: 70, right: 70, bottom: 50},
      height = 200 - margin.top - margin.bottom,
      width = 400 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart7")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Build your scales here

  var xPositionScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width])

  var rSize = d3.scaleSqrt()
    .domain([0, 10])
    .range([0, 60])

  var colorScale = d3.scaleOrdinal()
    .range(['blue', 'red', 'yellow'])

  d3.queue()
    .defer(d3.csv, "eating-data.csv")
    .await(ready)


  function ready(error, datapoints) {
    // Add and style your marks here
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) {
        return xPositionScale(d['hamburgers']);
      })
      .attr("r", function(d){
        return rSize(d['hotdogs']);
      })
      .attr("cy", height / 2)
      .attr('fill', function(d) {
        return colorScale(d['animal'])
      })
      .attr("opacity", 0.25)


    // Always cut and paste the code for the axes, too!

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


  }
})()