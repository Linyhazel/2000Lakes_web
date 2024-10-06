const lake_total_number = 237;
const gashapon_svg = d3.select("#gashapon");
var gashapon_width = gashapon_svg.node().getBoundingClientRect().width*0.5,
    gashapon_height = gashapon_svg.node().getBoundingClientRect().height;
const lakeBallColors = ["LightGoldenRodYellow","LightSkyBlue","pink","LightCoral","violet","LightGreen"];

const lake_div = d3.select("#gashapon_lake");

function openBall(lake_ind){
	d3.select(".lakeBall")
		.transition()
    	.duration(800)
    	.attr("transform", "translate("+gashapon_width+",0)")
    	.on('end', function(){
    		d3.select(".lakeBallhalf1")
		    	.transition()
		    	.duration(400)
		    	.attr("transform", "translate("+gashapon_width*0.44+","+gashapon_height*0.83+")rotate(-170)")
		    	.on('end', function() {
		    		// add div to the document.
				    //console.log(lake_info[lake_ind]);
				    var lake_obj = lake_info[lake_ind];
				    lake_div.selectAll('*').remove();
				    var gashapon_content = lake_div.append("div").attr("class","gashapon_content");
				    gashapon_content.append('p').attr('class','gashapon_title')
				    	.text(lake_obj.name)
				    	.on('click', function(){
				    		lakeInfo(lake_obj);
				    	});
				    var area_str;
				    if(lake_obj.area != NaN){
				    	area_str = ""+lake_obj.area+" hectares";
				    }
				    else{
				    	area_str = "unknown";				    	
				    }
		
				    gashapon_content.append('p')
				    	.text("Hey, the lake you get is the lake "+lake_obj.name+". It locates in Canton "+lake_obj.canton+". Its elevation is "+
				    			lake_obj.elevation+" meters and its surface area is "+area_str+".");
		
				    gashapon_content.append('p')
				    	.text("Click the lake name to see more detailed information. Would you like to help create or enrich its Wikipedia page with the information provided?")
		    	});
    	});
    d3.select(".lakeBall").on('click',null);
}

function draw_machine(){
	gashapon_svg.selectAll('*').remove();
	var gashapon_g = gashapon_svg.append("g");

	//handle (actual interactions!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
	const curve = d3.line().curve(d3.curveNatural);
	const points = [[0, gashapon_width*0.1], [gashapon_width*0.1-5, gashapon_width*0.1-5], [gashapon_width*0.1, 0]];

	var handler_g = gashapon_g.append("g").attr("id","handler");

	handler_g.append('path')
			.attr('d', curve(points))
			.attr("stroke-width", gashapon_width*0.03)
			.attr('stroke', '#011a38')
			.attr('fill', 'none')
			.attr("transform", "translate("+(gashapon_width*0.83)+","+(gashapon_height*0.63)+")");
	handler_g.append('circle')
            .attr("r", gashapon_width*0.05)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "orange")
            .attr("transform", "translate("+(gashapon_width*0.93)+","+(gashapon_height*0.63-gashapon_width*0.05)+")");
    handler_g.on("click", function(){
    			const arcGenerator = d3.arc()
					  .outerRadius(gashapon_width*0.07)
					  .innerRadius(0)
					  .startAngle(-Math.PI / 2)
					  .endAngle(Math.PI / 2);
            	//console.log("move the handler! sound effect! and get the gashapon ball!");
            	var handler = d3.select("#handler");
            	handler.transition()
                	.duration(700)
                	.attr("transform", "translate(0,0)rotate(2)")
                	.on('end',  function() {
                		handler.transition()
		                	.duration(700)
		                	.attr("transform", "translate(0,0)rotate(0)");
                	});
                ball_exit_g.select(".lakeBall").remove();
                let gashaball = ball_exit_g.append('g').attr("class", "lakeBall");
                gashaball.append('path')
                		.attr("class", "lakeBallhalf1")
			            .attr("d", arcGenerator())
			            .attr("stroke", "#011a38")
			            .attr("stroke-width", 4)
			            .attr("fill",  lakeBallColors[Math.floor(Math.random() * 6)])
			            .attr("transform", "translate("+(gashapon_width*0.58)+","+(gashapon_height*0.7)+")")
			            .transition()
	                	.duration(1000)
	                	.attr("transform", "translate("+(gashapon_width*0.58)+","+(gashapon_height*0.83)+")");
	            gashaball.append('path')
                		.attr("class", "lakeBallhalf2")
			            .attr("d", arcGenerator())
			            .attr("stroke", "#011a38")
			            .attr("stroke-width", 4)
			            .attr("fill",  lakeBallColors[Math.floor(Math.random() * 6)])
			            .attr("transform", "translate("+(gashapon_width*0.58)+","+(gashapon_height*0.7)+")rotate(180)")
			            .transition()
	                	.duration(1000)
	                	.attr("transform", "translate("+(gashapon_width*0.58)+","+(gashapon_height*0.83)+")rotate(180)");
	            gashaball.append('rect')
                		.attr("class", "lakeBallhalf2")
			            .attr("width", gashapon_width*0.05)
			            .attr("height", gashapon_width*0.05)
			            .attr("rx", 2)
			            .attr("fill",  "#011a38")
			            .attr("transform", "translate("+(gashapon_width*0.555)+","+(gashapon_height*0.685)+")")
			            .transition()
	                	.duration(1000)
	                	.attr("transform", "translate("+(gashapon_width*0.555)+","+(gashapon_height*0.815)+")");
	            gashaball.on("click", function(){openBall(Math.floor(Math.random() * lake_total_number));});
            });	
	gashapon_g.append('rect')
            .attr("width", gashapon_width*0.05)
            .attr("height", gashapon_height*0.12)
            .attr("rx", 10)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "pink")
            .attr("transform", "translate("+(gashapon_width*0.8)+","+(gashapon_height*0.65)+")"); 

	// body (main part to interact!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
	gashapon_g.append('rect')
            .attr("width", gashapon_width*0.7)
            .attr("height", gashapon_height*0.35)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "#02c39a")
            .attr("transform", "translate("+(gashapon_width*0.1)+","+(gashapon_height*0.6)+")"); 
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.2)
            .attr("height", gashapon_height*0.25)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "MidnightBlue")
            .attr("transform", "translate("+(gashapon_width*0.15)+","+(gashapon_height*0.65)+")"); 
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.05)
            .attr("height", gashapon_height*0.08)
            .attr("rx", 10)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.2)+","+(gashapon_height*0.67)+")"); 
    gashapon_g.append('line')
		    .style("stroke", "#011a38")
		    .style("stroke-width", 5)
		    .attr("x1", 0)
		    .attr("y1", 0)
		    .attr("x2", 0)
		    .attr("y2", gashapon_height*0.05)
		    .attr("transform", "translate("+(gashapon_width*0.225)+","+(gashapon_height*0.685)+")");
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.05)
            .attr("height", gashapon_height*0.08)
            .attr("rx", 10)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.2)+","+(gashapon_height*0.78)+")"); 
    gashapon_g.append('line')
		    .style("stroke", "#011a38")
		    .style("stroke-width", 5)
		    .attr("x1", 0)
		    .attr("y1", 0)
		    .attr("x2", 0)
		    .attr("y2", gashapon_height*0.05)
		    .attr("transform", "translate("+(gashapon_width*0.225)+","+(gashapon_height*0.795)+")");
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.02)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.3)+","+(gashapon_height*0.69)+")");
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.02)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.3)+","+(gashapon_height*0.74)+")");
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.02)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.3)+","+(gashapon_height*0.79)+")");
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.02)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.3)+","+(gashapon_height*0.84)+")");
    var ball_exit_g = gashapon_g.append("g");
    ball_exit_g.append('rect')
            .attr("width", gashapon_width*0.33)
            .attr("height", gashapon_height*0.24)
            .attr("rx", 10)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.41)+","+(gashapon_height*0.65)+")"); 
    gashapon_g.append('rect')
			.attr("id", "cap")
            .attr("width", gashapon_width*0.35)
            .attr("height", gashapon_height*0.12)
            .attr("rx", 10)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "lightgray")
            .attr("transform", "translate("+(gashapon_width*0.4)+","+(gashapon_height*0.65)+")"); 

    // bottom
	gashapon_g.append('rect')
            .attr("width", gashapon_width*0.9)
            .attr("height", gashapon_height*0.15)
            .attr("rx", 20)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "MidnightBlue")
            .attr("transform", "translate(2,"+(gashapon_height*0.93)+")"); 
    // decoration
	gashapon_g.append('rect')
            .attr("width", gashapon_width*0.7)
            .attr("height", gashapon_height*0.08)
            .attr("rx", 20)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "DarkSlateBlue")
            .attr("transform", "translate("+(gashapon_width*0.1)+","+(gashapon_height*0.55)+")");
    // machine outer box
	gashapon_g.append('rect')
            .attr("width", gashapon_width*0.8)
            .attr("height", gashapon_height*0.6)
            .attr("rx", 6)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "MidnightBlue")
            .attr("transform", "translate("+(gashapon_width*0.05)+",2)");;
    // machine inner box glass part
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.6)
            .attr("height", gashapon_height*0.45)
            .attr("rx", 4)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  '#e4f8fb')
            .attr("transform", "translate("+(gashapon_width*0.15)+","+(gashapon_height*0.08)+")");
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.25)
            .attr("height", gashapon_height*0.02)
            .attr("rx", 80)
            .attr("fill",  'white')
            .attr("transform", "translate("+(gashapon_width*0.25)+","+(gashapon_height*0.35)+")rotate(45)");
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.1)
            .attr("height", gashapon_height*0.02)
            .attr("rx", 80)
            .attr("fill",  'white')
            .attr("transform", "translate("+(gashapon_width*0.22)+","+(gashapon_height*0.45)+")rotate(45)");
    gashapon_g.append('rect')
            .attr("width", gashapon_width*0.5)
            .attr("height", gashapon_height*0.1)
            .attr("rx", 30)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  '#02c39a')
            .attr("transform", "translate("+(gashapon_width*0.2)+","+(gashapon_height*0.04)+")");
    gashapon_g.append('text')
            .text("Lake Gashapon")
            .attr("font-size", "15px")
            .attr("fill","#011A38")
            .attr("text-anchor","middle")
            .attr("transform", "translate("+(gashapon_width*0.45)+","+(gashapon_height*0.1)+")");

    // 4 nails
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.025)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.1)+","+(gashapon_height*0.03)+")");
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.025)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.8)+","+(gashapon_height*0.03)+")");
	gashapon_g.append('circle')
            .attr("r", gashapon_width*0.025)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.1)+","+(gashapon_height*0.56)+")");
    gashapon_g.append('circle')
            .attr("r", gashapon_width*0.025)
            .attr("stroke", "#011a38")
            .attr("stroke-width", 4)
            .attr("fill",  "white")
            .attr("transform", "translate("+(gashapon_width*0.8)+","+(gashapon_height*0.56)+")");     
}

draw_machine();