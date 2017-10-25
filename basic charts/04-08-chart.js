(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 80, left: 80, right: 50, bottom: 80},
      height = 600 - margin.top - margin.bottom,
      width = 400 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart8")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Build your scales here

  var widthScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width])

  var yPositionScale = d3.scaleBand()
    .domain(["Stevie", "Nicholas", "Bubbletree", "Particle", "Jumpup", "Parlay", "Hio"])
    .range([height, 0])

  var xPositionScale = d3.scaleLinear()
    .domain([0,10])
    .range([0, width])

  var colorScale = d3.scaleOrdinal()
    .range(['darkred', 'red', 'pink'])

  d3.queue()
    .defer(d3.csv, "eating-data.csv")
    .await(ready)


  function ready(error, datapoints) {
    // Add and style your marks here
    svg.selectAll("rect")
      .data(datapoints)
      .enter().append("rect")
      .attr("width", function(d) {
        return widthScale(d['hamburgers']);
      })
      .attr("height", height / 7)
      .attr("x", function(d){
        return xPositionScale(d)})
      .attr("y", function(d, i){
        return yPositionScale(d['name']);
      })
      .attr('fill', function(d) {
        return colorScale(d['animal'])
      })


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