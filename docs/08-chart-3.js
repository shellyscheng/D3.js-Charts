(function() {

  var margin = { top: 30, left: 50, right: 30, bottom: 30},
    height = 250 - margin.top - margin.bottom,
    width = 200 - margin.left - margin.right;

  var container = d3.select("#chart-3")

  // Create our scales
  var xPositionScale = d3.scaleLinear().domain([1980,2010]).range([0, width]).nice()
  var yPositionScale = d3.scaleLinear().domain([4500, 20000]).range([height, 0]).nice()

  var line = d3.line()
    .x(function(d) {return xPositionScale(+d.year)})
    .y(function(d) {return yPositionScale(+d.income)})


  d3.queue()
    .defer(d3.csv, "middle-class-income.csv")
    .defer(d3.csv, "middle-class-income-usa.csv")
    .await(ready)


  function ready(error, otherDatapoints, usaDatapoints) {

    var nested = d3.nest()
      .key(function(d) {return d.country})
      .entries(otherDatapoints)

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

        //console.log(nested)

        var countryData = d.values
        var title = d.key

        //console.log(countryData)

        var xAxis = d3.axisBottom(xPositionScale).ticks(4).tickFormat(d3.format("d")).tickSize(-height)
        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var yAxis = d3.axisLeft(yPositionScale).ticks(4).tickFormat(d3.format("$,d")).tickSize(-width)
        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis);

        svg.append("path")
          .datum(usaDatapoints)
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", "grey")
          .attr("stroke-width", 2)

        svg.append("path")
          .datum(countryData)
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", "#A1007C")
          .attr("stroke-width", 2)

        svg.append("text")
          .attr("font-size", "12px")
          .text(title)
          .attr("fill", "#A1007C")
          .attr("x", width / 2)
          .attr("y", -6)
          .attr("text-anchor", "middle")
          .attr("font-weight", "bold")


        svg.append("text")
          .attr("font-size", "11px")
          .text("USA")
          .attr("fill", "black")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("dx", -40)
          .attr("dy", -58)
          .attr("text-anchor", "middle")
          .attr("fill", "grey")



        svg.selectAll(".tick line")
          .attr("stroke-dasharray", 2)
          .attr("fill", "#d9d9d9")


        svg.selectAll(".domain").remove()



      })
  }
  
})();