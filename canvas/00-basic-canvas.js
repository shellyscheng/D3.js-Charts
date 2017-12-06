(function() {
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var canvas = d3.select("#chart-0")
        .append("canvas") //<canvas> </canvas>
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)

  var context = canvas.node().getContext("2d")

  d3.queue()
    .await(ready)

  // Reference at https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

  function ready(error) {
    // arc(x, y, radius, startAngle, endAngle, counterclockwise)

    context.arc(20, 20, 10, 0, Math.PI * 2)
    context.fill() //without begin and close path, fill will all the things drawing before

    context.beginPath()
    context.fillStyle = "green"
    context.arc(80, 100, 10, 0, Math.PI * 2)
    context.fill()
    context.closePath()

    // context.fillStyle = "pink"
    // moveTo(x, y)
    // lineTo(y, y)
    context.beginPath()
    context.moveTo(10,300)
    context.lineTo(500, 250)
    context.stroke()
    context.fill()
    context.closePath()


    // fillRect(x, y, width, height)
    context.fillStyle = "coral"
    context.fillRect(300, 100, 300, 100)

    context.fillStyle = "pink" //everything drawing afterwards will be pink
    context.fillRect(100, 100, 20, 20)
    context.fillRect(150, 150, 20, 20)
    context.fillRect(200, 200, 20, 20)
  };

})();
