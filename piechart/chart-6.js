(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 600 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right;

  var svg = d3.select("#chart-6")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var angleScale = d3.scaleBand().range([0, Math.PI * 2])

  var radius = 300

  var radiusScale = d3.scaleLinear().range([20, radius])
  
  var line = d3.radialArea()
    .angle(function(d) {return angleScale(d.time)})
    .innerRadius(function(d) {return radiusScale(d.total)})
    .outerRadius(function(d) {return 3 * radiusScale(d.total)})
    

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(function(d) {return 1.5 * radiusScale(d.total)})
    .startAngle(function(d) {return angleScale(d.time)})
    .endAngle(function(d) {return angleScale(d.time) + angleScale.bandwidth()})

  var colorScale = d3.scaleOrdinal().range(['pink', '#feebe2'])

  d3.queue()
    .defer(d3.csv, "data/time-binned.csv")
    .await(ready)


  function ready(error, datapoints) {

    var maxTotal = d3.max(datapoints, function(d) {return d.total})
    radiusScale.domain([0, maxTotal])
    //console.log(maxTotal)

    var times = datapoints.map(function(d) {return d.time})
    //console.log(times)
    angleScale.domain(times)
    colorScale.domain(times)

    var container = svg.append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
  
    datapoints.push(datapoints[0])

    container.selectAll("path")
      .data(datapoints)
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", function(d) {
        return colorScale(d.time)
      })
    
    container.append("path")
      .datum(datapoints)
      .attr("d", line)
      .attr("fill", "#f9f9f9") 
      .attr("stroke", "#f9f9f9")

    container.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("cx", function(d) {
        var a = angleScale(d.time)
        var r = radiusScale(d.total)

        return r * Math.sin(a)
      })
      .attr("cy", function(d) {
        var a = angleScale(d.time)
        var r = radiusScale(d.total)

        return r * Math.cos(a) * -1
      })
      .attr("r", 2)

    //Ttile
    svg.append("text")
      .text("Every one ever is born at 8am")
      .attr("transform", function(d) {return "translate(" + width /2 + ", 0)"})
      .attr("dy", 80)
      .attr("text-anchor", "middle")
      .attr("font-size", 30)
      .attr("font-weight", "bold")


    //Subtitle
    svg.append("text")
      .text("(and some people are born after lunch)")
      .attr("transform", function(d) {return "translate(" + width /2 + ", 0)"})
      .attr("dy", 110)
      .attr("text-anchor", "middle")
      .attr("font-size", 20)


    //8am
    svg.append("text")
      .text("8am")
      .attr("transform", "translate(520, 435)")
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .attr("font-weight", "bold")

    //1pm
    svg.append("text")
      .text("1pm")
      .attr("transform", "translate(260, 510)")
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .attr("font-weight", "bold")

     
  }
})();