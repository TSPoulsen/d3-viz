var margin = {top: 50, right: 30, bottom: 50, left: 75},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var svg = d3.select('#my_dataviz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform','translate('+margin.left+','+margin.top+')');

d3.csv("https://raw.githubusercontent.com/TimSP98/Game/main/weekly_data.csv", function(data){

  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Week; }))
    .padding(0.2);
  
  svg.append("g")
    .attr("transform","translate(0,"+height+")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform","translate(-10,0)rotate(-45)")
      .style("text-anchor","end");

    var y = d3.scaleLinear()
      .domain([0,100000])
      .range([height,0]);
  
  // y-label
  svg.append("text")
  .attr("y",(0-(margin.left)))
  .attr("x",-(height/2))
  .attr("dy","1em")
  .attr("transform","rotate(-90)")
  .style("text-anchor","middle")
  .style("font-weight","bold")
  .text("# Vaccinations")

  svg.append("g")
    .call(d3.axisLeft(y));

// Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Week); })
      .attr("y", function(d) { return y(d.vaccinated_people); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.vaccinated_people); })
      .attr("fill", "#69b3a2")

})
