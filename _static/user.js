var width = 1024;
var height = 1024;
var margin = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

data = [
  1,
  2,
  3
]
function main() {
  d3.select("body")
    .append("svg")
    .attr("id", "viz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var myRects=d3.select("body").select("svg").selectAll("rect");
  myRects=myRects.data(data).enter();
  myRects.append("rect");
  d3.selectAll("rect").attr("width", "20px")
    .attr("height", (d, i) => {
      return d * 20;
    })
    .attr("rx", "5")
    .attr("ry", "5")
    .attr("y", "20")
    .attr("x", (d, i) => {
      return 20 + (i * 40);
    })
  console.log(myRects)
}

window.onload = main
