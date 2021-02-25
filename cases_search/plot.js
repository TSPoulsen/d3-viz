// df1 has keys being country, there is then key for data and key for additional
var df1,x,y,svg,crnt = [];

let myPromise = new Promise(function(myResolve){
  //loads data first
  d3.json("https://raw.githubusercontent.com/TimSP98/Data/main/DeathCases/deaths_smooth.json", function(data){
    // Deaths dataset around peak (Cumulated)
    df1 = data;
    myResolve();
  });
});

// function definitions
function selectCountries(input){
  console.log("first "+crnt)
  var selected = [];
  for(var option of d3.select('#menu').property("selectedOptions")){
    selected.push(option.value)
  }
  var h=0,w=0;
  for(var c of selected){
    h = Math.max(h,d3.max(df1[c]["data"]));
    w = Math.max(w,df1[c]["data"].length);
  }
  y.domain([0,h]);
  svg.select(".x_axis")
    .transition()
    .duration(2000)
    .call(d3.axisBottom(x));
    
  svg.select(".y_axis")
    .transition()
    .duration(2000)
    .call(d3.axisLeft(y));

  for(var k of crnt){
    console.log(k);
    var path =svg.select("."+k)
      .transition()
      .duration(2000)
      .attr("d",d3.line()(combine(df1[c]["data"],x,y)));
    if(!selected.includes(k)){
      console.log("Removing "+k)
      path.style("opacity",0)
      .remove();
    }
  }

  for(var c of selected){
    if(!crnt.includes(c)){
      svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()(combine(df1[c]["data"],x,y)))
      .attr("class",c);
    }
  }
  console.log(selected)
  crnt = selected;
  console.log("crtn: "+crnt)

}
function range(start, end) {
  var ans = [];
  for (let i = start; i < end; i++) {
      ans.push(i);
  }
  return ans;
}

function combine(y_arr,x,y){
  var combined = [];
  const x_arr = range(0,y_arr.length);
  if(x_arr.length != y_arr.length){
    return
  }
  for(let i = 0; i < x_arr.length; i++){
    combined.push([x(x_arr[i]),y(y_arr[i])]);
  }
  return combined;
}

myPromise.then(function(value){
  // Then creates visualisation dasd
  var margin = {top: 50, right: 30, bottom: 50, left: 75},
  width = 900 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
  
  svg = d3.select('#my_dataviz')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform','translate('+margin.left+','+margin.top+')');
  
  x = d3.scaleTime()
    .domain(d3.extent(df1,function(d) { return d.date;}))
    .range([0,width]);

  svg.append("g")
    .call(d3.axisBottom(x))
    .attr("class","x_axis");

  y = d3.scaleLinear()
  .domain([0,1])
    .range([height,0]);
  
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class","y_axis");

  var menu = d3.select("#menu");
  var selectButton = d3.select("#select_button")
    .attr("onclick","selectCountries()");

  const countries = Object.keys(df1);

  for(let i=1;i<countries.length;i++){
    menu.append("option")
      .attr("value",countries[i])
      .text(countries[i]);
  }
    

}
, function(error){
  console.log("We fucked up")
});



