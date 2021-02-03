var rawText
var file
var g = "#graphArea"
var boring = false
var varNum = 0
var selectedValue = 0
var newFile = true
var selectedData = []
const graphWidth  = (window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth) / 2;
const graphHeight = (window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight) / 2;

function fileSubmitted()
{
  clearGraphs()
  uncheckRadio()
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
  uncheckCheckbox()
  rbs = document.querySelectorAll('input[name="radio"]');
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue = rb.value;
                    disableGraphs()
                    var div = document.getElementById('variables');
                    while(div.firstChild){
                      div.removeChild(div.firstChild);
                    }
                    if(selectedValue == 3)
                    {document.getElementById("varWrapper").hidden = true}
                    else
                    {
                      document.getElementById("varWrapper").hidden = false
                      loadVariables()
                    }
                    break;
                }
            }
}

function disableGraphs()
{
  oneBut = document.querySelectorAll('[id=one]')
  for(i = 0; i < oneBut.length; i++){
    if(selectedValue != 1)
    {oneBut[i].disabled = true}
    else
    {oneBut[i].disabled = false}
  }

  twoBut = document.querySelectorAll('#two')
  for(i = 0; i < twoBut.length; i++){
    if(selectedValue != 2)
    {twoBut[i].disabled = true}
    else
    {twoBut[i].disabled = false}
  }

  allBut = document.querySelectorAll('#all')
  for(i = 0; i < allBut.length; i++){
    if(selectedValue != -1)
    {allBut[i].disabled = true}
    else
    {allBut[i].disabled = false}
  }

  textBut = document.querySelectorAll('#text')
  for(i = 0; i < textBut.length; i++){
    if(selectedValue != 3)
    {textBut[i].disabled = true}
    else
    {textBut[i].disabled = false}
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
                      varNum = selectedValue
                    }
                }
            }
}

function uncheckCheckbox()
{
  cbs = document.querySelectorAll('#varOption');
            for (const cb of cbs)
            {
                if (cb.checked)
                {cb.checked = false}
            }
}

function uncheckRadio()
{
  rbs = document.querySelectorAll('input[name="radio"]');
            for (const rb of rbs) {rb.checked = false}
  bbs = document.querySelectorAll('button');
            for(const b of bbs) {b.disabled = false}
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
    box.setAttribute('name', i)
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
  d3.select("#legend").html("")
  selectedData = []
  cbs = document.querySelectorAll('#varOption');
            for (const cb of cbs)
            {
                if (cb.checked)
                {selectedData.push(cb.name)}
            }
}
function boxplot()
{
  clearGraphs()
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = graphWidth - margin.left - margin.right,
    height = graphHeight - margin.top - margin.bottom;

  var svg = d3.select(g)
  .append("svg")
    .classed("graph", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  var data = d3.csvParse(rawText)

  var max = d3.max(data, function(d) {return +d[data.columns[selectedData]]})
  var min = d3.min(data, function(d) {return +d[data.columns[selectedData]]})
  var median = (max + min) / 2
  var q1 = min + (median/2)
  var q3 = max - (median/2)
  var interQuantileRange = q3 - q1


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
    width = graphWidth - margin.left - margin.right,
    height = graphHeight - margin.top - margin.bottom;

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
  .domain(data.map(function(d) { return d[data.columns[selectedData[0]]]; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return +d[data.columns[selectedData[1]]]})])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d[data.columns[selectedData[0]]]); })
    .attr("y", function(d) { return y(d[data.columns[selectedData[1]]]); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d[data.columns[selectedData[1]]]); })
    .attr("fill", "#69b3a2")
}

function dotplot()
{
  clearGraphs()
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = graphWidth - margin.left - margin.right,
      height = graphHeight - margin.top - margin.bottom;

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
      .domain([0, d3.max(data, function(d) {return +d[data.columns[selectedData[0]]]} )])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[selectedData[1]]]} )])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d[data.columns[selectedData[0]]]); } )
        .attr("cy", function (d) { return y(d[data.columns[selectedData[1]]]); } )
        .attr("r", 4)
        .style("fill", "#69b3a2")
}

function wordcloud()
{
  clearGraphs()

  // List of words
var myWords = rawText
  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  .replace(/\s\s+/g, ' ')
  .split(" ")
var freqMap = {}
  myWords.forEach(function(w) {
    if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
  })

var orig = {}
myWords.forEach(function(w){
  if(!orig[w]) {
    orig[w] = 1
  }
})
myWords = Object.keys(orig)

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = graphWidth - margin.left - margin.right,
    height = graphHeight - margin.top - margin.bottom;

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
  .words(myWords.map(function(d) { return {text: d, size: (freqMap[d] * 5), color: [Math.random()*128+64, Math.random()*128+64, Math.random()*128+64]}; }))
  .padding(3)
  .fontSize(function(d) {return d.size})
  .font("Comic Sans MS")
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
        .style("font-size", function(d) {return d.size + "px"})
        .style("font-family", "Comic Sans MS")
        .style("fill", function(d) {return "rgb("+d.color[0]+","+d.color[1]+","+d.color[2]+")"})
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
    width = graphWidth - margin.left - margin.right,
    height = graphHeight - margin.top - margin.bottom;


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
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 10) + "px")
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

  // colors
  tempColors = []
  for(i = 0; i < keys.length; i++)
  {
    tempColors.push("rgba("+ Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+",.9)")
  }
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(tempColors)

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

  divlegend = document.getElementById("legend")
  for(i = 0; i < keys.length; i++)
  {
    legend = document.createElement("p")
    legend.textContent = keys[i]
    legend.style.backgroundColor = color(keys[i])
    legend.style.width = "400px"
    legend.style.padding = "10px"

    divlegend.append(legend)
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
