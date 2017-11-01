(function() {
  var margin = {top: 50, right: 70, bottom: 40, left: 70},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // We'll set the domain once we've read in
  // the data
  var xPositionScale = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

  var yPositionScale = d3.scaleLinear()
    .range([height, 0]);

  var svg = d3.select("#chart-8")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.csv, "data/letter-frequency.csv")
    .await(ready)

  function ready(error, datapoints) {

    var letters = datapoints.map(function(d) { return d.letter; })
    xPositionScale.domain(letters);

    var frequencyMax = d3.max(datapoints, function(d) { return d.frequency; })
    yPositionScale.domain([0, frequencyMax]);

    svg.selectAll(".bar")
        .data(datapoints)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
          return xPositionScale(d.letter); 
        })
        .attr("y", function(d) { 
          return yPositionScale(d.frequency); 
        })
        .attr("width", xPositionScale.bandwidth())
        .attr("height", function(d) { 
          return height - yPositionScale(d.frequency); 
        })

    svg.append("text")
      .text("Letter Frequency in English")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 20)
      
    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)
      .tickFormat(d3.format(".0%"))

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    d3.select("#out-of-100")
      .on('click', function() {
        // STEP ONE: Update our scale
        // 1 is 100%
        yPositionScale.domain([0, 1])

        // STEP TWO: Update our visual elements
        // Any attribute that uses the updated scale
        svg.selectAll(".bar")
          .transition()
          .attr("height", function(d) {
            return height - yPositionScale(d.frequency); 
          })
          .attr("y", function(d) { 
            return yPositionScale(d.frequency); 
          })

        // Update our axis
        // Why like this?
        // Because that's how it works
        svg.select(".y-axis")
          .transition()
          .call(yAxis)
      })

    d3.select("#out-of-max-freq")
      .on('click', function() {
        // STEP ONE: Update our scale
        // 1 is 100%
        yPositionScale.domain([0, frequencyMax])

        // STEP TWO: Update our visual elements
        // Any attribute that uses the updated scale
        svg.selectAll(".bar")
          .transition()
          .attr("height", function(d) {
            return height - yPositionScale(d.frequency); 
          })
          .attr("y", function(d) { 
            return yPositionScale(d.frequency); 
          })

        // Update our axis
        // Why like this?
        // Because that's how it works
        svg.select(".y-axis")
          .transition()
          .call(yAxis)
      })

  };

})();
