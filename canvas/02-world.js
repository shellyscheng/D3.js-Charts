(function() {
  
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var canvas = d3.select("#chart-2")
        .append("canvas")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)

  var context = canvas.node().getContext("2d")

  // var xPositionScale = d3.scaleLinear().range([0, width])
  // var yPositionScale = d3.scaleLinear().range([height, 0])
  var colorScale = d3.scaleOrdinal()
    .range(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd'])

  var radiusScale = d3.scaleSqrt()
    .domain([0, 23000000])
    .range([0, 10])

  var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100)

  var path = d3.geoPath()
    .projection(projection)
    .context(context)

  d3.queue()
    .defer(d3.csv, "data/world-cities.csv")
    .defer(d3.json, "data/world.topojson")
    .await(ready)

  function ready(error, datapoints, geoData) {
    var features = topojson.feature(geoData, geoData.objects.countries).features
    // all the country are in one shape
    var mesh = topojson.mesh(geoData, geoData.objects.countries)

    datapoints.forEach(function(d) {
      d.x = Math.random() * width
      d.y = Math.random() * height
      d.color = colorScale(d.country)
      d.radius = radiusScale(d.population)
    })

    function update() {
      var duration = 1500
      var ease = d3.easeCubic

      var timer = d3.timer(function(elapsed) {
        var t = ease(elapsed / duration)

        datapoints.forEach(function(d) {
          d.x = d.sx * (1 - t) + d.tx * t
          d.y = d.sy * (1 - t) + d.ty * t
        })

        if(elapsed > duration) {
          timer.stop()
        }

        draw()
      })
    }

    function draw() {
      // Clear everything
      context.clearRect(0, 0, width, height)

      // context.beginPath()
      // features.forEach(function(d) {
      //   path(d)
      // })
      // context.fillStyle = "lightgrey"
      // context.fill()
      // context.strokeStyle = "white"
      // context.stroke()
      // context.closePath()

      context.beginPath()
      path(mesh)
      // context.fillStyle = "lightgrey"
      // context.fill()
      context.strokeStyle = "black"
      context.lineWidth = 0.25
      context.stroke()
      context.closePath()

      // // Draw each datapoint as a circle
      datapoints.forEach(function(d) {  
        context.beginPath()
        // Set the styles for this point
        context.fillStyle = d.color
        context.strokeStyle = d.color
        context.lineWidth = 0.25
        // Draw the point with a fill and a stroke
        context.arc(d.x, d.y, d.radius, Math.PI * 2, 0)
        context.fill()
        context.stroke()
        context.closePath()
      })
    }

    d3.select("#use-coordinates").on('click', function() {
      datapoints.forEach(function(d) {
        d.sx = d.x
        d.sy = d.y

        var coords = projection([d.lng, d.lat])
        d.tx = coords[0]
        d.ty = coords[1]
      })

      update()
    })

    d3.select("#random-map").on('click', function() {
      datapoints.forEach(function(d) {
        d.sx = d.x
        d.sy = d.y

        d.tx = Math.random() * width
        d.ty = Math.random() * height
      })

      update()

    })

    draw()
  };

})();
