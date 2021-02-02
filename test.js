var rawText
var file
var g = "#graphArea"
var boring = false
var varNum = 0
var selectedValue = 0
var newFile = true

function fileSubmitted()
{
  file = document.getElementById("myFile");
  newFile = true
  document.getElementById("varWrapper").hidden = true

  var rawFile = file.files[0]
  var reader = new FileReader()
  reader.addEventListener('load', function(e){
      let text = e.target.result
      rawText = text
  })
  reader.readAsText(rawFile)

}

function variableCount()
{
  selectedValue = "test"
  rbs = document.querySelectorAll('input[name="radio"]');
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue = rb.value;
                    if(newFile)
                    {
                      var div = document.getElementById('variables');
                      while(div.firstChild){
                        div.removeChild(div.firstChild);
                      }
                      document.getElementById("varWrapper").hidden = false
                      loadVariables()
                      newFile = false
                    }
                    break;
                }
            }
}

function checkCheckbox()
{
  varNum = 0
  cbs = document.querySelectorAll('#varOption');
            for (const cb of cbs)
            {
                if (cb.checked)
                {
                    varNum = varNum + 1
                    if(varNum > selectedValue)
                    {
                      cb.checked = false
                    }
                }
            }
}

function loadVariables()
{
  data = d3.csvParse(rawText)
  count = data.columns.length
  container = document.getElementById("variables")
  for(i = 0; i < count; i++)
  {
    box = document.createElement('input')
    box.setAttribute('type', 'checkbox')
    box.setAttribute('id', 'varOption')
    box.onclick = checkCheckbox
    lab = document.createElement('label')
    lab.textContent = data.columns[i]
    container.append(box)
    container.append(lab)
    container.append(document.createElement('br'))
  }
}

function clearGraphs()
{
  d3.select(g).html("")
}
function boxplot()
{
  clearGraphs()
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var svg = d3.select(g)
  .append("svg")
    .classed("graph", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  var data = rawText.split(",").map(Number) //might include other delimiters in the future as options

  var data_sorted = data.sort(d3.ascending)
  var q1 = d3.quantile(data_sorted, .25)
  var median = d3.quantile(data_sorted, .5)
  var q3 = d3.quantile(data_sorted, .75)
  var interQuantileRange = q3 - q1
  var min = data_sorted[0]
  var max = data_sorted[data_sorted.length - 1]

  var y = d3.scaleLinear()
    .domain([min,max])
    .range([height, 0]);
  svg.call(d3.axisLeft(y))

  var center = 200
  var width = 100

  svg
  .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min) )
    .attr("y2", y(max) )
    .attr("stroke", "black")

  svg
  .append("rect")
    .attr("x", center - width/2)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", width )
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

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

var svg = d3.select(g)
  .append("svg")
    .classed("graph", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

data = d3.csvParse(rawText)

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

var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return +d[data.columns[1]]})])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

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
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var svg = d3.select(g)
    .append("svg")
      .classed("graph", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = d3.csvParse(rawText)
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[0]]} )])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[1]]} )])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
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

function wordcloud()
{
  // List of words
var myWords = ["Hello", "Everybody", "How", "Are", "You", "Today", "It", "Is", "A", "Lovely", "Day", "I", "Love", "Coding", "In", "My", "Van", "Mate"]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(g).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d}; }))
  .padding(10)
  .fontSize(60)
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' variable above
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}
}

function streamline()
{
  clearGraphs()

  // set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select(g)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // create a tooltip
    var Tooltip = d3.select("#graphArea")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html(d.key)
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
    }

// Parse the Data
data = d3.csvParse(rawText)

  // List of groups = header of the csv files
  var keys = data.columns.slice(1)
  temp_max = d3.max(data, function(d) {return +d[data.columns[1]]})
  max_time = d3.max(data, function(d) {return +d[data.columns[0]]})
  min_time = d3.min(data, function(d) {return +d[data.columns[0]]})
  avg_time = (max_time + min_time) / 2
  // Add X axis
  var x = d3.scaleLinear()
    .domain([min_time, max_time])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height).tickValues([min_time, min_time+avg_time/2, avg_time, max_time-avg_time/2, max_time]))
    .select(".domain").remove()
  svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height+30 )
    .text(""+data.columns[0])

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-.5*keys.length*temp_max, .5*keys.length*temp_max])
    .range([ height, 0 ]);
  if(boring)
  {
    y = d3.scaleLinear()
      .domain([0, keys.length*temp_max])
      .range([ height, 0 ]);
  }
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)
  if(boring)
  {
    stackedData = d3.stack()
      .keys(keys)
      (data)
    boring = false
  }


  // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data[data.columns[0]]); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

}

function stacked()
{
  boring = true
  streamline(true)
}
