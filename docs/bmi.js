(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // We always just pretend the g is the svg
  var container = d3.select("#chart-16")

  // Let's make some scales
  
  var xPositionScale = d3.scaleLinear()
    .domain([5, 60])
    .range([0, width])

  var yPositionScale = d3.scaleLinear()
    .domain([10, 65])
    .range([height, 0])

  // Read in our data
  // Let's add in multiple files
  d3.queue()
    .defer(d3.csv, "data/bmi_fat.csv")
    .await(ready)

  function ready(error, datapoints) {
    // Draw everything
    // bmi,fat_pct

    // group the datapoints together
    // based on their 'gender' column
    var nested = d3.nest()
      .key(function(d) {
        return d.gender
      })
      .entries(datapoints)

    // Add an svg inside of 'container'
    // for each element of 'nested'
    // (which is two - 1 for male, 1 for female)
    container.selectAll("svg")
      .data(nested)
      .enter().append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .each(function(d) {
        var svg = d3.select(this)

        var xAxis = d3.axisBottom(xPositionScale)
          .tickSize(-height)
          .tickValues([15, 20, 25, 30, 35, 40, 45, 50, 55])

        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var yAxis = d3.axisLeft(yPositionScale)
          .tickValues([18.5, 25, 30, 40, 50, 60])
          .tickSize(-width)

        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis);

        svg.selectAll(".person")
          .data(d.values)
          .enter().append("circle")
          .attr("class", "person")
          .attr("r", 4)
          .attr("cx", function(d) {
            return xPositionScale(d.fat_pct)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.bmi)
          })
          .attr("fill", function(d) {
            // "Healthy Obese"
            if(d.gender === "Male" && d.fat_pct < 25 && d.bmi > 25) {
              return "darkred"
            }

            // "Skinny fat"
            if(d.gender === "Male" && d.fat_pct > 25 && d.bmi < 25) {
              return "darkred"
            }

            // "Healthy Obese"
            if(d.gender === "Female" && d.fat_pct < 35 && d.bmi > 25) {
              return "darkred"
            }

            // "Skinny fat"
            if(d.gender === "Female" && d.fat_pct > 35 && d.bmi < 25) {
              return "darkred"
            }

            return "#636363"
          })
          .attr("opacity", 0.35)

        // line needs x, y for start and end
        // yPositionScale to say "wherever 25 BMI is", put this line

        svg.append("line")
          .attr("x1", 0)
          .attr("x2", width)
          .attr("y1", yPositionScale(25))
          .attr("y2", yPositionScale(25))
          .attr("stroke", "black")

        if(d.key === "Male") {
          svg.append("line")
            .attr("x1", xPositionScale(25))
            .attr("x2", xPositionScale(25))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "black")
        } else {
          svg.append("line")
            .attr("x1", xPositionScale(35))
            .attr("x2", xPositionScale(35))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "black")
        }
      })
  }

})();