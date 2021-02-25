// df1 has keys being country, there is then key for data and key for additional
var df1,x,y,yr,svg,crnt= [];
var colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'];
var used = [false,false,false,false,false,false,false,false,false]

let myPromise = new Promise(function(myResolve){
  //loads data first
  d3.json("https://raw.githubusercontent.com/TimSP98/Data/main/DeathCases/deaths_smooth.json", function(data){
    // Deaths dataset around peak (Cumulated)
    var i = 0;
    for(var d of data["date"]){
        data["date"][i] = d3.timeParse("%Y-%m-%d")(data["date"][i]);
        i++;
    }
    df1 = data;
    console.log(df1["Belgium"][100])
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
  var h=0;
  for(var c of selected){
    h = Math.max(h,d3.max(df1[c]));
  }
  for(var c of crnt){
    if(selected.includes(c)){
      h = Math.max(h,d3.max(df1[c]));
    }
  }
  y.domain([0,h]);
    
  svg.select(".y_axis")
    .transition()
    .duration(2000)
    .call(d3.axisRight(y));


  for(var c of crnt){
    console.log(c);
    var path =svg.select("."+c)
      .transition()
      .duration(2000)
      .attr("d",d3.line()(combine(df1[c],df1["date"])));
    if(!selected.includes(c)){
      console.log("Removing "+c)
      path.style("opacity",0)
      .remove();
      delCol(c);
    }
  }

  for(var c of selected){
    if(!crnt.includes(c)){
      svg.append("path")
      .transition()
      .duration(2000)
      .attr("stroke-width", 2)
      .attr("stroke",findCol(c))
      .attr("fill","none")
      .attr("d", d3.line()(combine(df1[c],df1["date"])))
      .attr("class",c)

    }
  }
  crnt = selected;
  
}
function findCol(c){
  for(var i=0;i<colors.length;i++){
    if(used[i] == false) {break;}
  }
  used[i] = c;
  return colors[i];
}
function delCol(c){
  for(var i=0;i<colors.length;i++){
    if(used[i]==c){
      used[i] = false;
    }
  }
}

function combine(y_arr,x_arr){
  var combined = [];
  if(x_arr.length != y_arr.length){
      console.log("ERROR: not same lengths in combine")
    return
  }
  for(let i = 0; i < x_arr.length; i++){
    combined.push([x(x_arr[i]),y(y_arr[i])]);
  }
  return combined;
}


myPromise.then(function(value){
  // Then creates visualisation dasd
  var margin = {top: 50, right: 75, bottom: 50, left: 75},
  width = 1000 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;
  
  svg = d3.select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform','translate('+margin.left+','+margin.top+')');
  
  x = d3.scaleTime()
    .domain(d3.extent(df1["date"]))
    .range([0,width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        
  yr = d3.scaleLinear()
    .domain([0,100])
    .range([height,0])
        
  y = d3.scaleLinear()
    .domain([0,1])
    .range([height,0]);
  
  svg.append("g")
    .call(d3.axisLeft(yr));

  svg.append("g")
    .attr("transform", "translate("+width+",0)")
    .call(d3.axisRight(y))
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



