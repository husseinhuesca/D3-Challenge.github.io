// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight + 50)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data and draw the chart
d3.csv("assets/data/data.csv").then(function(data, err) {
    // console.log(data)
    if (err) throw err;
  
    // parse data
    data.forEach(d => {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });
  
    // xLinearScale 
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) * 0.9,d3.max(data, d => d.poverty) * 1.1])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xLinearScale));
    // yLinearScale
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare)-2,d3.max(data, d => d.healthcare)+2])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yLinearScale));
    
    //Circles
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .append("circle")
            .attr("cx", function (d) { return xLinearScale(d.poverty); } )
              .attr("cy", function (d) { return yLinearScale(d.healthcare); } )
              .attr("r", 12)
              .classed('stateCircle', true);
    //Labels Circles
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .append("text")
            .text(d => d.abbr)
            .attr("dx", d => xLinearScale(d.poverty))
            .attr("dy", d => yLinearScale(d.healthcare)+4)
            .attr("font-size", "8px")
            .classed('stateText', true);   
    //XLabel
    svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .append("text")
            .attr("x", 0)
            .attr("y", 20)
            .classed("active", true)
            .text("In Poverty (%)");      
     //YLabel
     svg.append("g")
            .attr("transform", "rotate(-90)")
        .append("text")
            .attr("y", -50)
            .attr("x", -(height/2))
            .attr("dy", "1em")
            .classed("active", true)
            .text("Lacks Healthcare (%)");      
    }).catch(function(error) {
        console.log(error);
    });