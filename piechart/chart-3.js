(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var pie = d3.pie().value(1/12)

  var outerLength = d3.scaleLinear().domain([0, 90]).range([0, 160])

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(function(d) {return outerLength(d.data.high)})    

  var colorScale = d3.scaleOrdinal()
    .range(['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'])

  
  d3.queue()
    .defer(d3.csv, "data/ny-temps.csv")
    .await(ready)

  function ready(error, datapoints) {
    console.log(datapoints)

    var container = svg.append("g")
      .attr("transform", "translate(" + width /2 + "," + height / 2 + ")")

    container.selectAll("path")
      .data(pie(datapoints))
      .enter().append("path")
      .attr("d", function(d) {return arc(d)})
      .attr("fill", function(d) {
        console.log(d)
        return colorScale(d.data.month)
      })


    container.append("text")
      .text("NYC High Temperatures, by month")
      .attr("font-size", "25")
      .attr("dy", -135)
      .attr("text-anchor", "middle")


  }
})();