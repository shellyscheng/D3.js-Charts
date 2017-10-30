(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-2")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var pie = d3.pie()
    .value(function(d) {return d.minutes})


  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(80)

  var colorScale = d3.scaleOrdinal()
    .range(['#fec44f', '#74c476', '#9e9ac8'])

  var xPositionScale = d3.scalePoint()
    .domain(["Project 1", "Project 2", "Project 3", "Project 4"])
    .range([0, width])
    .padding(0.5)

  d3.queue()
    .defer(d3.csv, "data/time-breakdown-all.csv")
    .await(ready)


  function ready(error, datapoints) {

    var nested = d3.nest()
      .key(function(d) {return d.project})
      .entries(datapoints)

    svg.selectAll("g")
      .data(nested)
      .enter().append("g")
      .each(function(d) {
        var projectData = d.values
        var title = d.key

        var container = svg.append("g")
          .attr("transform", function(d) {return "translate(" + xPositionScale(title) + "," + height / 2 + ")"})

        console.log(xPositionScale(title))

        container.selectAll("path")
          .data(pie(projectData))
          .enter().append("path")
          .attr("d", function(d) {return arc(d)})
          .attr("fill", function(d) {
            return colorScale(d.data.task)
          })


        container.append("text")
          .text(title)
          .attr("transform", function(d) {return "translate(0," + height *2 / 5 + ")"})
          .attr("text-anchor", "middle")

      })


  }
})();



