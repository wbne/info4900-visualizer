d3.select("body").append("p").text("omegalul")
d3.selectAll("p").style("color", "blue");

var rawText
var file

function fileSubmitted()
{
  file = document.getElementById("myFile");
  console.log(file)

  var rawFile = file.files[0]
  var reader = new FileReader()
  reader.addEventListener('load', function(e){
      let text = e.target.result
      console.log(text)
      rawText = text
  })
  reader.readAsText(rawFile)
}

function clearGraphs()
{
  d3.selectAll(".graph").remove()
}
function boxplot()
{
  clearGraphs()
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
  .append("svg")
    .classed("graph", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // data from the sample text file
  var data = rawText.split(",").map(Number) //might include other delimiters in the future as options
  // Compute summary statistics used for the box:
  var data_sorted = data.sort(d3.ascending)
  var q1 = d3.quantile(data_sorted, .25)
  var median = d3.quantile(data_sorted, .5)
  var q3 = d3.quantile(data_sorted, .75)
  var interQuantileRange = q3 - q1
  var min = data_sorted[0]
  var max = data_sorted[data_sorted.length - 1]

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([min,max])
    .range([height, 0]);
  svg.call(d3.axisLeft(y))

  // a few features for the box
  var center = 200
  var width = 100

  // Show the main vertical line
  svg
  .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min) )
    .attr("y2", y(max) )
    .attr("stroke", "black")

  // Show the box
  svg
  .append("rect")
    .attr("x", center - width/2)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", width )
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

  // show median, min and max horizontal lines
  svg
  .selectAll("toto")
  .data([min, median, max])
  .enter()
  .append("line")
    .attr("x1", center-width/2)
    .attr("x2", center+width/2)
    .attr("y1", function(d){ return(y(d))} )
    .attr("y2", function(d){ return(y(d))} )
    .attr("stroke", "black")
}

function barplot()
{
  clearGraphs()
  // set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz2")
  .append("svg")
    .classed("graph", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
data = d3.csvParse(rawText)

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d[data.columns[0]]; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return +d[data.columns[1]]})])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d[data.columns[0]]); })
    .attr("y", function(d) { return y(d[data.columns[1]]); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d[data.columns[1]]); })
    .attr("fill", "#69b3a2")
}

function dotplot()
{
  clearGraphs()
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz3")
    .append("svg")
      .classed("graph", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
    data = d3.csvParse(rawText)
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[0]]} )])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[1]]} )])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d[data.columns[0]]); } )
        .attr("cy", function (d) { return y(d[data.columns[1]]); } )
        .attr("r", 4)
        .style("fill", "#69b3a2")
}
