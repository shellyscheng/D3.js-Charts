(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic

  var margin = { top: 50, left: 50, right: 50, bottom: 50},
      height = 400 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart9")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Build your scales here

  var heightScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, height])

  var xPositionScale = d3.scaleBand()
    .domain(["Stevie", "Nicholas", "Bubbletree", "Particle", "Jumpup", "Parlay", "Hio"])
    .range([0, width])

  var yPositionScale = d3.scaleLinear()
    .domain([0,10])
    .range([height, 0])

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
      .attr("height", function(d) {
        return heightScale(d['hamburgers']);
      })
      .attr("width", width / 7)
      .attr("y", function(d){
        return 300 - heightScale(d['hamburgers'])})
      .attr("x", function(d, i){
        return xPositionScale(d['name']);
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