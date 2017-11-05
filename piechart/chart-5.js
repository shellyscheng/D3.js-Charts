(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 450 - margin.top - margin.bottom,
    width = 1080 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-5")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var angleScale = d3.scaleBand().range([0, Math.PI * 2])

  var radius = 90

  var radiusScale = d3.scaleLinear().domain([0,120]).range([10, radius])

  var highLine = d3.radialLine()
    .angle(function(d) {return angleScale(d.month)})
    .radius(function(d) {return radiusScale(d.high)})

  var lowLine = d3.radialLine()
    .angle(function(d) {return angleScale(d.month)})
    .radius(function(d) {return radiusScale(d.low)})

  var xPositionScale = d3.scalePoint()
    .range([0, width])
    .padding(0.5)

  d3.queue()
    .defer(d3.csv, "data/all-temps.csv")
    .await(ready)

  function ready(error, datapoints) {

    var nested = d3.nest()
      .key(function(d) {return d.city})
      .entries(datapoints)

    var cities = nested.map(function(d) {return d.key})
    //console.log(nested)
    //console.log(cities)

    xPositionScale.domain(cities)

    //Title
    svg.append("text")
        .text("Average Monthly Temperature")
        .attr("transform", function(d) {return "translate(" + width /2 + ", 0)"})
        .attr("dy", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", 30)
        .attr("font-weight", "bold")

    //Subtitle
    svg.append("text")
        .text("in cities around the world")
        .attr("transform", function(d) {return "translate(" + width /2 + ", 0)"})
        .attr("dy", 50)
        .attr("text-anchor", "middle")
        .attr("font-size", 15)


    svg.selectAll("g")
      .data(nested)
      .enter().append("g")
      .each(function(d) {

        var cityData = d.values
        var title = d.key

        var months = cityData.map(function(d) {return d.month})
        angleScale.domain(months)

        // console.log(cityData)
        // console.log(months)
        
        var container = svg.append("g")
          .attr("transform", function(d) {return "translate(" + xPositionScale(title) + "," + height / 2 + ")"})

        datapoints.push(datapoints[0])

        container.append("path")
          .datum(cityData)
          .attr("d", highLine)
          .attr("fill", "red")
          .attr("opacity", 0.5)
          .attr("stroke", "none")

         container.append("path")
          .datum(cityData)
          .attr("d", lowLine)
          .attr("fill", "white")
          .attr("stroke", "none")

        container.append("text")
          .text(title)
          .attr("x", 0)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .attr("dy", 5)
          .attr("font-weight", "bold")

        var bands = [ 20, 40, 60, 80, 60, 100]

        container.selectAll(".band")
          .data(bands)
          .enter().append("circle")
          .attr("class", "band")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 0.8)
          .attr("r", function(d) {return radiusScale(d)})


        container.selectAll(".band-label")
          .data(bands)
          .enter().append("text")
          .attr("class", "band-label")
          .text(function(d) {
            if(d >= 20 && ((d -20) % 40) == 0){
               return d + "°"
            }
           })
          .attr("text-anchor", "middle")
          .attr("y", function(d) {return -radiusScale(d)})
          .attr("dy", -2)
          .attr("font-size", 10)

          })



  }
})();