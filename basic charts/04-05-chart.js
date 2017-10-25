(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 50, left: 50, right: 50, bottom: 50},
      height = 400 - margin.top - margin.bottom,
      width = 400 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart5")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Build your scales here

  var xPositionScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width])

  var yPositionScale = d3.scaleLinear()
    .domain([0,10])
    .range([height, 0])

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
      .attr("cy", function(d){
        return yPositionScale(d['hotdogs']);
      })
      .attr('fill', "lightpink")


    // Always cut and paste the code for the axes, too!

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


  }
})()