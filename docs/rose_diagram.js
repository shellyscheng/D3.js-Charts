(function() {
    var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 200 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-12")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var pie = d3.pie().value(1/12).sort(null)

  var outerLength = d3.scaleLinear().domain([0, 120]).range([0, 80])

  var arc = d3.arc()
    .innerRadius(function(d) {return outerLength(d.data.low)})
    .outerRadius(function(d) {return outerLength(d.data.high)})    

  var colorScale = d3.scaleOrdinal()
    .range(['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'])

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

    var city = nested.map(function(d) {return d.key})

    xPositionScale.domain(city)


    svg.selectAll("g")
      .data(pie(nested))
      .enter().append("g")
      .each(function(d) {

        console.log(d)

        var cityData = d.data.values
        var title = d.data.key

        console.log(title)

        var container = svg.append("g")
          .attr("transform", function(d) {return "translate(" + xPositionScale(title) + "," + height / 2 + ")"})


        container.selectAll("path")
          .data(pie(cityData))
          .enter().append("path")
          .attr("d", function(d) {return arc(d)})
          .attr("fill", function(d) {
            return colorScale(d.data.month)
          })


        container.append("text")
          .text(title)
          .attr("transform", function(d) {return "translate(0," + height *2 / 5 + ")"})
          .attr("text-anchor", "middle")
          .attr("dy", 6)
          .attr("font-size", 10)

      })


  }
})();