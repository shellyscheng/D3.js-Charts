(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-4")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var angleScale = d3.scaleBand().range([0, Math.PI * 2])

  var radius = 135

  var radiusScale = d3.scaleLinear().domain([0,70]).range([20, radius])

  var highLine = d3.radialLine()
    .angle(function(d) {return angleScale(d.month)})
    .radius(function(d) {return radiusScale(d.high)})

  var lowLine = d3.radialLine()
    .angle(function(d) {return angleScale(d.month)})
    .radius(function(d) {return radiusScale(d.low)})
  

  d3.queue()
    .defer(d3.csv, "data/ny-temps.csv")
    .await(ready)

  function ready(error, datapoints) {

    var months = datapoints.map(function(d) {return d.month})
    angleScale.domain(months)

    var container = svg.append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")")

      // console.log(datapoints)
      // console.log(highLine)
      // console.log(highLine(datapoints))

    datapoints.push(datapoints[0])

    container.append("path")
      .datum(datapoints)
      .attr("d", highLine)
      .attr("fill", "lightblue")
      .attr("stroke", "none")

     container.append("path")
      .datum(datapoints)
      .attr("d", lowLine)
      .attr("fill", "white")
      .attr("stroke", "none")

    container.append("text")
      .text("NYC")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .attr("dy", 5)
      .attr("font-weight", "bold")

    var bands = [ 10, 20, 30, 40, 50, 60, 70, 80, 90]

    container.selectAll(".band")
      .data(bands)
      .enter().append("circle")
      .attr("class", "band")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", function(d) {return radiusScale(d)})


    container.selectAll(".band-label")
      .data(bands)
      .enter().append("text")
      .attr("class", "band-label")
      .text(function(d) {
        if(d >= 30 && (d / 10) % 2){
           return d + "°"
        }
       })
      .attr("text-anchor", "middle")
      .attr("y", function(d) {return -radiusScale(d)})
      .attr("dy", -2)
      .attr("font-size", 10)



  }
})();