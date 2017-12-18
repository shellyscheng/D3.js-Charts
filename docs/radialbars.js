(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 400 - margin.top - margin.bottom,
    width = 400 - margin.left - margin.right;

  var svg = d3.select("#chart-9")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var parseTime = d3.timeParse("%b")

  var angleScale = d3.scaleBand()
    .domain(months)
    .range([0, Math.PI * 2])

  var colorScale = d3.scaleLinear()
    .domain([30, 60])
    .range(['lightblue', 'pink'])

  var radius = 170

  var radiusScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, radius])

  var arc = d3.arc()
    .startAngle(function(d) {
      return angleScale(d.month)
    })
    .endAngle(function(d) {
      return angleScale(d.month) + angleScale.bandwidth()
    })
    .outerRadius(function(d) {
      return radiusScale(d.high)
    })
    .innerRadius(function(d) {
      return radiusScale(d.low)
    })

  d3.queue()
    .defer(d3.csv, "data/03-high-low-by-month.csv")
    .await(ready)

  function ready(error, datapoints) {
    var container = svg.append("g")
      .attr("transform", "translate(200,200)")

    container.selectAll("path")
      .data(datapoints)
      .enter().append("path")
      .attr("d", function(d) {
        console.log("Our data is", d)
        console.log("Our arc is", arc(d))
        return arc(d)
      })
      .attr("fill", function(d) {
        return colorScale(d.high)
      })

    container.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 3)

    var bands = [10, 20, 30, 40, 50, 60]

    container.selectAll(".band")
      .data(bands)
      .enter().append("circle")
      .attr("class", "band")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", function(d) {
        return radiusScale(d)
      })

    container.selectAll(".month-label")
      .data(months)
      .enter().append("text")
      .attr("class", "month-label")
      .text(function(d) {
        return d
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        var a = angleScale(d)
        var r = radius

        return r * Math.sin(a)
      })
      .attr("y", function(d) {
        var a = angleScale(d)
        var r = radius

        return r * Math.cos(a) * -1
      })


  }
})();





