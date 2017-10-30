(function() {

  var margin = { top: 20, left: 30, right: 20, bottom: 20},
    height = 120 - margin.top - margin.bottom,
    width = 90 - margin.left - margin.right;

  var container = d3.select("#chart-3")

  // Create our scales
  var xPositionScale = d3.scaleLinear().domain([10,50]).range([0, width]);
  var yPositionScale = d3.scaleLinear().domain([0, 0.3]).range([height, 0]);

  var area1 = d3.area()
    .x0(function(d) {return xPositionScale(d.Age)})
    .y0(function(d) {return yPositionScale(d.ASFR_us)})
    .x1(function(d) {return xPositionScale(d.Age)})
    .y1(function(d) {return height})

  var area2 = d3.area()
    .x0(function(d) {return xPositionScale(d.Age)})
    .y0(function(d) {return yPositionScale(d.ASFR_jp)})
    .x1(function(d) {return xPositionScale(d.Age)})
    .y1(function(d) {return height})


  d3.queue()
    .defer(d3.csv, "data/fertility.csv")
    .await(ready);


  function ready(error, datapoints) {

    var nested = d3.nest()
      .key(function(d) {return d.Year})
      .entries(datapoints)

    //console.log(nested)


    container.selectAll("svg")
      .data(nested)
      .enter().append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .each(function(d) {
        
        var svg = d3.select(this)
        var year = d.key
        var datayear = d.values
        var totalUSAge = d3.sum(datayear.map(function(d) {return d.ASFR_us})).toFixed(2)
        var totalJPAge = d3.sum(datayear.map(function(d) {return d.ASFR_jp})).toFixed(2)

        //console.log(datayear)

        svg.append("path")
          .datum(datayear)
          .attr("d", area1)
          .attr("fill", "#377eb8")
          .attr("opacity", 0.5)

        svg.append("path")
          .datum(datayear)
          .attr("d", area2)
          .attr("fill", "red")
          .attr("opacity", 0.5)

        svg.append("text")
          .attr("font-size", "12px")
          .text(year)
          .attr("fill", "black")
          .attr("x", width / 2)
          .attr("y", -6)
          .attr("text-anchor", "middle")
        
        svg.append("text")
          .datum(datayear)
          .attr("font-size", "10px")
          .text(totalUSAge)
          .attr("fill", "black")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("dx", 20)
          .attr("text-anchor", "middle")
          .attr("fill", "#377eb8")

        svg.append("text")
          .datum(datayear)
          .attr("font-size", "10px")
          .text(totalJPAge)
          .attr("fill", "black")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("dx", 20)
          .attr("dy", 10)
          .attr("fill", "red")


        var xAxis = d3.axisBottom(xPositionScale).ticks(2)

        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var yAxis = d3.axisLeft(yPositionScale).ticks(3)
        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis);

      })

  }
  
})();