// update size-related forces
d3.select(window).on("resize", function(){
    bar_width = bar_svg.node().getBoundingClientRect().width;
    bar_height = bar_svg.node().getBoundingClientRect().height;

    drawBar();

    map_width = map_div.node().getBoundingClientRect().width;
    map_height = map_div.node().getBoundingClientRect().height;

    drawMap();

    //measure_width = do_div.node().getBoundingClientRect().width;
    //measure_height = do_div.node().getBoundingClientRect().height;
    //console.log(measure_width);
    //drawMeasure(do_svg, do_data, "Dissolved Oxygen (mg/L)");
    //drawMeasure(cond_svg, cond_data, "Conductivity (µS/cm)");
    //drawMeasure(ph_svg, ph_data, "pH Value");

    info_width = info_div.node().getBoundingClientRect().width;
    info_height = info_div.node().getBoundingClientRect().height;
    initLakeInfo();
});