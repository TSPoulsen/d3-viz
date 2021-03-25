// df1 has keys being country, there is then key for data and key for additional
var df1;

let myPromise = new Promise(function(myResolve){
  //loads data first
  d3.json("https://raw.githubusercontent.com/TimSP98/Data/main/women_parl/women_parl.json", function(data){
    // Deaths dataset around peak (Cumulated)
    df1 = data;
    myResolve();
  });
});


myPromise.then(function(value){
    console.log(df1);
  // Then creates visualisation dasd
    var margin = {  top: 50, right: 75, bottom: 50, left: 75},
                    width = 900 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;
  
    svg = d3.select('#my_dataviz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform','translate('+margin.left+','+margin.top+')');

    var sumstat = {};
    for(var year of Object.keys(df1)){
        df1[year].sort();
        var q1 = d3.quantile(df1[year],0.25);
        var median = d3.quantile(df1[year],0.50);
        var q3 = d3.quantile(df1[year],0.75);
        interQuantileRange = q3-q1;
        min = d3.min(df1[year]);
        max = d3.max(df1[year]);
        sumstat[year] = {};
        sumstat[year]["q1"] =  q1;
        sumstat[year]["median"] =  median;
        sumstat[year]["q3"] = q3;
        sumstat[year]["min"] = min;
        sumstat[year]["max"] = max;
        sumstat[year]["mean"] = d3.mean(df1[year]);
        sumstat[year]["outliers"] = [];

    }
    console.log(sumstat);
    x = d3.scaleBand()
        .range([0,width])
        .domain(Object.keys(df1))
        .paddingInner(5)
        .paddingOuter(0.5);
    svg.append("g")
        .attr("transform","translate(0,"+height+")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .attr("transform","translate(0,10)")

    y = d3.scaleLinear()
        .domain([0,0.5])
        .range([height,0]);
        
    svg.append("text")
        .attr("y",(0-(margin.left)))
        .attr("x",-(height/2))
        .attr("dy","1em")
        .attr("transform","rotate(-90)")
        .style("text-anchor","middle")
        .style("font-weight","bold")
        .text("% of females in parlament")
    
    svg.append("text")
        .attr("y",height+margin.bottom*0.66 )
        .attr("x",width/2)
        .attr("dy","1em")
        .style("text-anchor","middle")
        .style("font-weight","bold")
        .text("Year")

        
    svg.append("text")
        .attr("y",0-margin.top/2)
        .attr("x",width/2)
        .attr("dy","1em")
        .style("text-anchor","middle")
        .style("font-weight","bold")
        .text("Percentage of female representatives in parlaments in EU")
    

    const formatter = d3.format(".0%");
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
        .style("opacity",0.3)
    
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickFormat(formatter));

    var boxw = 30;
    var avgLine = [];
    for(var year of Object.keys(df1)){

        // Vertical Line bottom
        svg.append("line")
            .attr("x1",x(year))
            .attr("y1",y(sumstat[year]["min"]))
            .attr("x2",x(year))
            .attr("y2",y(sumstat[year]["q1"]))
            .attr("stroke","black")
            .style("width",50)
            .style("opacity",0.75);
        // vertical line top
        svg.append("line")
            .attr("x1",x(year))
            .attr("y1",y(sumstat[year]["q3"]))
            .attr("x2",x(year))
            .attr("y2",y(sumstat[year]["max"]))
            .attr("stroke","black")
            .style("width",50)
            .style("opacity",0.75);
        // Bottom line   
        svg.append("line")
            .attr("x1",x(year)-boxw/2)
            .attr("y1",y(sumstat[year]["min"]))
            .attr("x2",x(year)+boxw/2)
            .attr("y2",y(sumstat[year]["min"]))
            .attr("stroke","black")
            .style("width",50)
            .style("opacity",0.75);
        // Top Line 
        svg.append("line")
            .attr("x1",x(year)-boxw/2)
            .attr("y1",y(sumstat[year]["max"]))
            .attr("x2",x(year)+boxw/2)
            .attr("y2",y(sumstat[year]["max"]))
            .attr("stroke","black")
            .style("width",50)
            .style("opacity",0.75);
        // Box
        svg.append("rect")
            .attr("x",x(year)-boxw/2)
            .attr("y",y(sumstat[year]["q3"]))
            .attr("height",y(sumstat[year]["q1"])-y(sumstat[year]["q3"]))
            .attr("width",boxw)
            .attr("stroke","black")
            .attr("fill",'#69b3a2')
            .style("opacity",0.5)
        // For average line
        var tup = [x(year),y(sumstat[year]["mean"])];
        avgLine.push(tup);
        
    }
    const last = avgLine[avgLine.length-1];
    const extra = [last[0]+25,last[1]];
    svg.append("text")
        .text("Mean")
        .attr("transform",`translate(${extra[0]-5},${extra[1]+15})`)
        .attr("stroke","steelblue")
    avgLine.push(extra);  
    svg.append("path")
        .attr("fill","none")
        .attr("stroke","steelblue")
        .attr("stroke-width",3)
        .attr("d",d3.line()(avgLine));
}
, function(error){
  console.log("We fucked up")
});



