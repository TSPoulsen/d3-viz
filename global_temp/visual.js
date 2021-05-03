  
  
d3.json("https://raw.githubusercontent.com/TimSP98/Data/main/global_temp/high_temps_summary.json", function(data){


var margin = {  top: 50, right: 75, bottom: 50, left: 75};
var width = 900 - margin.left - margin.right, height = 600 - margin.top - margin.bottom;

var svg = d3.select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform','translate('+margin.left+','+margin.top+')');
console.log(data);

var years = [];
for(var y=1880;y < 2021;y++){
    years.push(y);
}
var x = d3.scaleBand()
  .range([0,width])
  .domain(years);
svg.append("g")
    .attr("transform","translate(0,"+height+")")
    .call(d3.axisBottom(x)
        .tickValues([1880,1900,1920,1940,1960,1980,2000,2020])
        .tickSize("")
        .tickPadding(10));
var y = d3.scaleLinear()
    .range([height,0])
    .domain([9,17]);
svg.append("g")
    .call(d3.axisLeft(y));

    





});









