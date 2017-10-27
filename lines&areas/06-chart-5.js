(function() {
	var margin = { top: 30, left: 50, right: 30, bottom: 30},
	height = 500 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 5");

	var svg = d3.select("#chart-5")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scalePoint().range([0, width]).domain(["small", "medium", "large"]).padding(0.5)
  var yPositionScale = d3.scalePoint().range([height, 0]).domain(["mouse", "cat", "dog"]).padding(0.5)
  var sizeScale = d3.scaleSqrt().domain([0, 50]).range([0, 60])

  d3.queue()
    .defer(d3.csv, "animal-sizes.csv")
    .await(ready);

	function ready(error, datapoints) {
		// Add your circles

		svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", function(d) {return sizeScale(d.amount)})
      .attr("cx", function(d) {return xPositionScale(d.size)})
      .attr("cy", function(d) {return yPositionScale(d.breed)})
      .attr("fill", "black")


    var xAxis = d3.axisBottom(xPositionScale)

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