(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 500 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var pie = d3.pie()
    .value(function(d) {return d.minutes})

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(100)

  var labelArc = d3.arc()
    .innerRadius(80)
    .outerRadius(150)

  var colorScale = d3.scaleOrdinal()
    .range(['#fec44f', '#74c476', '#9e9ac8'])


  d3.queue()
    .defer(d3.csv, "data/time-breakdown.csv")
    .await(ready)


  function ready(error, datapoints) {

    var container = svg.append("g")
      .attr("transform", "translate(" + width /2 + "," + height / 2 + ")")

    container.selectAll("path")
      .data(pie(datapoints))
      .enter().append("path")
      .attr("d", function(d) {return arc(d)})
      .attr("fill", function(d) {
        return colorScale(d.data.task)
      })

    container.selectAll("text")
      .data(pie(datapoints))
      .enter().append("text")
      .text(function(d) {return d.data.task})
      .attr("d", labelArc)
      .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + ")"})
      .attr("text-anchor", function(d) {
        if(d.startAngle > Math.PI) {
          return "end"
        } else {
          return "start"
        }
})

  }
})();



