var s16_data = [{"line":0.5, "orig": "black", "range": [0, 1], "color": "grey", "explain": " "},
               {"line":0.2, "orig": "grey", "range": [1, 2], "color": "grey", "explain": " "},
               {"line":0.5, "orig": "black", "range": [2, 3], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [3, 4], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [4, 5], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [5, 6], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [6, 7], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [7, 8], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [8, 9], "color": "grey", "explain": " "}];

var s18_data = [{"line":0.5, "orig": "black", "range": [0, 1], "color": "grey", "explain": " "},
               {"line":0.2, "orig": "grey", "range": [1, 2], "color": "grey", "explain": " "},
               {"line":0.5, "orig": "black", "range": [2, 3], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [3, 4], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [4, 5], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [5, 6], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [6, 7], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [7, 8], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [8, 9], "color": "grey", "explain": " "}];

var temp_data = [{"line":0.5, "orig": "black", "range": [0, 4], "color": "grey", "explain": " "},
               {"line":0.2, "orig": "grey", "range": [4, 8], "color": "grey", "explain": " "},
               {"line":0.5, "orig": "black", "range": [8, 12], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [12, 16], "color": "grey", "explain": " "},
               {"line":0.3, "orig": "grey", "range": [16, 20], "color": "grey", "explain": " "}];

var do_data = [{"line":0.5, "orig": "black", "range": [0, 4], "color": "#DA291C", "explain": "Dissolved oxygen with a range from 0 to 4.0 mg/L is dangerous, all fish will be dead."},
               {"line":0.2, "orig": "grey", "range": [4, 6.5], "color": "yellow", "explain": "Very few fish can live when the range is between 4.0 and 6.5 mg/L."},
               {"line":0.5, "orig": "black", "range": [6.5, 9.5], "color": "lightgreen", "explain": "Most big fish can live but some small fish cannot live when the dissolved oxygen is in this range."},
               {"line":0.3, "orig": "grey", "range": [9.5, 12], "color": "#02C39A", "explain": "This is the safe range! All fish can live!"}];

var cond_data = [{"line":0.5, "orig": "black", "range": [0, 200], "color": "#02C39A", "explain": "Low conductivity, an indicator of pristine or background conditions."},
                 {"line":0.2, "orig": "grey", "range": [200, 1000], "color": "lightgreen", "explain": "Mid-range conductivity, the normal background for most major rivers."},
                 {"line":0.4, "orig": "black", "range": [1000, 1200], "color": "#DA291C", "explain": "High conductivity, an indicator of saline conditions, the water is not suitable for certain species of fish or bugs."}]

var ph_data = [{"line":0.5, "orig": "black", "range": [0, 4], "color": "#DA291C", "explain": "All fish will be dead when the pH value is below 4."},
               {"line":0.2, "orig": "grey", "range": [4, 6.5], "color": "lightyellow", "explain": "Create living pressure for some fish."},
               {"line":0.4, "orig": "black", "range": [6.5, 8.5], "color": "#02C39A", "explain": "Best pH condition for all kinds of fish."},
               {"line":0.5, "orig": "grey", "range": [8.5, 11.5], "color": "lightyellow", "explain": "Create living pressure for some fish."},
               {"line":0.3, "orig": "black", "range": [11.5, 14], "color": "#DA291C", "explain": "All fish will be dead when the pH value is above 11.5."}];

var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";//"⁰","¹","²"."³","⁴","⁵","⁶","⁷","⁸","⁹"];

// draw svg for do
var temperature_div = d3.select("#temperature-slide");
var do_div = d3.select("#DO-slide"),
    measure_width = do_div.node().getBoundingClientRect().width,
    measure_height = do_div.node().getBoundingClientRect().height; //measure_w/h is the w/h of the silde!
var cond_div = d3.select("#conductivity-slide");
var ph_div = d3.select("#pH-slide");

var do_svg = do_div.append("svg");
var cond_svg = cond_div.append("svg");
var ph_svg = ph_div.append("svg");


function drawMeasure(measure_svg, data, title){
    measure_svg.selectAll('*').remove();
    measure_svg.attr("transform", "translate("+(measure_width*0.53)+",20)").attr("width", measure_width*0.45).attr("height", measure_height*0.9);
    var measure_g = measure_svg.append("g").attr("transform", "translate(0,"+measure_height*0.6+")");

    var measure_scale = d3.scaleLinear().domain([data[0].range[0], data[data.length-1].range[1]]).range([0, measure_width*0.4]);

    measure_g.append("text")
        .attr("x", 0)
        .attr("y", 45)
        .text("0");

    measure_g.selectAll("rect")
        .data(data)
        .enter() 
        .append('rect')
        .attr("width", (d) => measure_scale(d.range[1]-d.range[0]))
        .attr("height", 30)
        .attr("fill", (d) => d.orig)
        .attr("transform", (d) => "translate("+measure_scale(d.range[0])+",0)")
        .on("mouseover", function(d){
            d3.select(this).style("cursor", "pointer");
        })
        .on("click", function(d){
            d3.select(this).attr("fill",  d.color);
            measure_g.append('line')
                .attr("x1", measure_scale(d.range[0])+5).attr("y1", 5).attr("x2", measure_scale(d.range[0])+5).attr("y2", 5)
                .attr("stroke", "#011A38")
                .attr("stroke-width",1.5)
                .attr("stroke-opacity", 0.3)
                .transition()
                .duration(1000)
                .attr("y2", -(measure_height*d.line))
                .on('end',  function() {
                    measure_g.append('circle')
                        .attr("r", 3)
                        .attr("fill","#011A38")
                        .attr("transform", "translate("+(measure_scale(d.range[0])+5)+"," + (-(measure_height*d.line)) + ")");
                    measure_g.append('text')
                        .attr("y", -(measure_height*d.line))
                        .attr("dy",0)
                        .attr("transform", "translate("+(measure_scale(d.range[0])+10)+",0)")
                        .text(d.explain)
                        .attr("font-size", "1vw")
                        .attr("fill","#011A38")
                        .call(wrap,(measure_scale(d.range[1]-d.range[0])));
                });
        })
    measure_g.selectAll("xlabels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d)=>measure_scale(d.range[1]))
        .attr("y", 45)
        .text((d)=>String(d.range[1]));

    measure_g.append("text")
        .attr("x", measure_width*0.12)
        .attr("y", 65)
        .text(title);
}

drawMeasure(do_svg, do_data, "Dissolved Oxygen (mg/L)");
drawMeasure(cond_svg, cond_data, "Conductivity (µS/cm)");
drawMeasure(ph_svg, ph_data, "pH Value");

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  });
}

function initLakeInfo(){
    lake_info_measure_svg.selectAll("*").remove();
    lake_info_measure_svg.attr("transform", "translate(0,"+info_height*0.21+")").attr("width", info_width).attr("height", info_height*0.7);
    //temperature set to [0,20]
    var arr = [s16_data, s18_data, temp_data, do_data, cond_data, ph_data];

    for (var i = 0; i < 6; i++){
        g = lake_info_measure_svg.append("g");
        if(i == 0){
            g.attr("id", "s16_data");
            g.attr("transform", "translate("+info_width*0.05+",10)");
            g.append("text")
                .attr("x", info_width*0.02)
                .attr("y", 40)
                .text("Abundance of Bacteria and Archaea in Order of Magnitude (gc/L)")
                .attr("font-size", "1vw");
        }
        else if(i == 1){
            g.attr("id", "s18_data");
            g.attr("transform", "translate("+info_width*0.55+",10)");
            g.append("text")
                .attr("x", info_width*0.02)
                .attr("y", 40)
                .text("Abundance of Eukaryotic DNA in Order of Magnitude (gc/L)")
                .attr("font-size", "1vw");
        }
        else if(i == 2){
            g.attr("id", "temp_data");
            g.attr("transform", "translate("+(info_width*0.05)+","+(info_height*0.22+10)+")");
            g.append("text")
                .attr("x", info_width*0.15)
                .attr("y", 40)
                .text("Temperature (°C)")
                .attr("font-size", "1vw");
        }
        else if(i == 3){
            g.attr("id", "do_data");
            g.attr("transform", "translate("+info_width*0.55+","+(info_height*0.22+10)+")");
            g.append("text")
                .attr("x", info_width*0.15)
                .attr("y", 40)
                .text("Dissolved Oxygen (mg/L)")
                .attr("font-size", "1vw");
        }
        else if(i == 4){
            g.attr("id", "cond_data");
            g.attr("transform", "translate("+(info_width*0.05)+","+(info_height*0.45+10)+")");
            g.append("text")
                .attr("x", info_width*0.15)
                .attr("y", 40)
                .text("Conductivity (µS/cm)")
                .attr("font-size", "1vw");
        }
        else{
            g.attr("id", "ph_data");
            g.attr("transform", "translate("+info_width*0.55+","+(info_height*0.45+10)+")");
            g.append("text")
                .attr("x", info_width*0.15)
                .attr("y", 40)
                .text("pH Value")
                .attr("font-size", "1vw");
        }
        
        var scale = d3.scaleLinear().domain([arr[i][0].range[0], arr[i][arr[i].length-1].range[1]]).range([0, info_width*0.43]);

        g.append("text")
            .attr("x", 0)
            .attr("y", 25)
            .text("0")
            .attr("font-size", "1vw");

        g.selectAll("rect")
            .data(arr[i])
            .enter() 
            .append('rect')
            .attr("width", (d) => scale(d.range[1]-d.range[0]))
            .attr("height", 15)
            .attr("fill", (d) => d.color)
            .attr("stroke-width", "1.5px")
            .attr("transform", (d) => "translate("+scale(d.range[0])+",0)");

        if(i == 0 || i == 1){
            g.selectAll("xlabels")
                .data(arr[i])
                .enter()
                .append("text")
                .attr("x", (d)=>scale(d.range[1]))
                .attr("y", 25)
                .text((d)=>"10"+superscript[d.range[1]])
                .attr("font-size", "1vw");
        }
        else{
            g.selectAll("xlabels")
                .data(arr[i])
                .enter()
                .append("text")
                .attr("x", (d)=>scale(d.range[1]))
                .attr("y", 25)
                .text((d)=>String(d.range[1]))
                .attr("font-size", "1vw");
        }

        // draw pointer
        var pointer_g = g.append("g").attr("class", "pointer")
        pointer_g.append("line")
            .attr("x1", 0)
            .attr("y1", -5)
            .attr("x2", 0)
            .attr("y2", 15)
            .attr("stroke", "#011A38")
            .attr("stroke-width",2);
        pointer_g.append('circle')
            .attr("r", 3)
            .attr("transform", "translate(0,-5)")
            .attr("fill","#011A38");
    }

}

initLakeInfo();
