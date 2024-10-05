var bar_svg = d3.select("#bar"),
    bar_width = bar_svg.node().getBoundingClientRect().width,
    bar_height = bar_svg.node().getBoundingClientRect().height;

const num_promise = d3.csv("data/tot_sampled.csv").then((data) => {
    data.forEach((row) => {
        total_lakes =  parseInt(row.Total);
        sampled_lakes =  parseInt(row.Sampled);
    });
    return [total_lakes, sampled_lakes];
});

var bar_g = bar_svg.append('g');

function drawBar(){
    bar_g.selectAll('*').remove();

    Promise.all([num_promise]).then((results) => {
        let total_lakes = results[0];

        var len_scale = d3.scaleLinear().domain([0, total_lakes[0]]).range([0, bar_width]);

        bar_g.append('rect')
            .attr("width", len_scale(total_lakes[0]))
            .attr("height", bar_height*0.3)
            .attr("rx", 4)
            .attr("fill",  "#90E0EF")
            .attr("transform", "translate(0,"+(bar_height-30)+")");

        bar_g.append('rect')
            .attr("width", 0)
            .attr("height", bar_height*0.3)
            .attr("rx", 4)
            .attr("fill",  "#02C39A")
            .attr("transform", "translate(0,"+(bar_height-30)+")")
            .transition()
            .duration(2000)
            .attr("width", len_scale(total_lakes[1]))
            .on('end',  function() {showText(total_lakes[0], total_lakes[1], len_scale(total_lakes[1]))});
    });

}

function showText(total, sampled, horizontal_position){
    var text_div = d3.select("#intro");
    var text = sampled.toString() + " lakes out of " + total.toString() + " have been sampled by now.";
    text_div.html(text)
            .style('display', 'block')
            .style("top", (bar_height*0.15)+"%")
            .style("left", (horizontal_position)+'px')
            .style("font-size", "12px")
            .style('opacity', 1);
}

drawBar();