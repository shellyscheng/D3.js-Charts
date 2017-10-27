(function() {
	var margin = { top: 30, left: 50, right: 80, bottom: 50},
	height = 400 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 4");

	var svg = d3.select("#chart-4")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xPositionScale = d3.scaleLinear().range([0, width]).domain([2000, 2014])
  var yPositionScale = d3.scaleLinear().range([height, 0]).domain([0, 500])

  //var colorScale = d3.scaleOrdinal().range(['orange','green','purple','blue','yellow'])

	var line = d3.line()
    .x(function(d) { return xPositionScale(d.Year) })
    .y(function(d) { return yPositionScale(d.Value) })

  d3.queue()
    .defer(d3.csv, "air-emissions.csv")
    .await(ready)

	function ready(error, datapoints) {

		var nested = d3.nest()
			.key(function(d) {return d.Country})
			.entries(datapoints)

		console.log(nested)

		svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("d", function(d) {return line(d.values)})
      .attr("stroke", function(d) {
      	if(d.key === "France")
      		return "blue"
      	else
      		return "grey"
      })
      .attr("fill", "none")
      .attr("stroke-width", 2)

    svg.selectAll("circle")
     	.data(nested)
     	.enter().append("circle")
     	.attr("r", 3)
     	.attr("cx", function(d) {return xPositionScale(2014)})
     	.attr("cy", function(d) {return yPositionScale(d.values[d.values.length-1].Value)})
     	.attr("fill", function(d) {
     		if(d.key === 'France') {
      		return 'blue'
      	} else {
      		return 'grey'
      	}
     	})


     svg.selectAll("text")
     	.data(nested)
     	.enter().append("text")
     	.attr("font-size", "12px")
     	.text(function(d) {return d.key})
     	.attr("fill", function(d) {
     		if(d.key === 'France') {
      		return 'blue'
      	} else {
      		return 'grey'
      	}
     	})
     	.attr("x", function(d) {return xPositionScale(2014)})
     	.attr("y", function(d) {return yPositionScale(d.values[d.values.length-1].Value)})
     	.attr("dx", 5)
     	.attr("dy", 5)



    var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format("d"))

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);
  }
})();