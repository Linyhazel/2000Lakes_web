//map for google api
var map_invisible = new google.maps.Map(document.getElementById("map_invisible"), {
        zoom: 8.5, //8.5
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: {lat: 46.8, lng: 8.2}, // center of switzerland lat: 46.8, lng: 8.2
    });

var color_sampled = "#DA291C",
    color_not_sampled = "#90E0EF";
// zoom in: either change viewbox of the svg canvas or transform the grouped svg
// viewbox is not used here for svg! otherwise it's too messy! use only the transform method
var map_div = d3.select("#map"),
    map_width = map_div.node().getBoundingClientRect().width,
    map_height = map_div.node().getBoundingClientRect().height;

var info_div = d3.select("#description"),
    info_width = info_div.node().getBoundingClientRect().width,
    info_height = info_div.node().getBoundingClientRect().height;
var lake_info_measure_svg = info_div.append("svg");

// for tooltip
var map_tip = d3.select("#map-tooltip");

// if the canton is selected, zoom in that canton
var selected_canton = null; //store the name of the selected canton string!



// load density data
const density_promise = d3.csv("data/canton_density.csv").then((data) => {
    let canton_density = {};
    data.forEach((row) => {
        canton_density[row.id] =  parseInt(row.density);
    });
    return canton_density;
});

//load canton coords for zoom in in google maps
const canton_promise = d3.csv("data/canton_coords.csv").then((data) => {
    let canton_coords = {};
    data.forEach((row) => {
        canton_coords[row.canton_id ] =  JSON.parse("[" + row.coords + "]")[0];
    });
    return canton_coords;
});

//load lake data for google map rendering
const lake_promise = d3.csv("data/full_data.csv").then((data) => {
    let lake_info = [];
    data.forEach((row) => {
        var cant = row.Canton.split('/')[0]
        var lake = {lakeId: row.lake_id, name: row.Lake, link:row.link, canton: cant, elevation: parseInt(row.Elevation), area: parseFloat(row.Area), 
                lon: parseFloat(row.latlng.slice(1, -1).split(", ")[1]), lat: parseFloat(row.latlng.slice(1, -1).split(", ")[0]),l: row.max_length, w: row.max_width, dep: row.max_depth,
                volumn: row.water_volume, ph: row.pH, cond: row.Conductivity , temp: row.Temperature , o2: row.O2 };
        lake_info.push(lake);
    });
    return lake_info;
});

// load the map data
const map_promise = d3.json("data/cantons.geojson").then((data) => data);



var projection_swiss = d3.geoMercator().scale(9000).center([8.9, 46.8]);
var path_swiss = d3.geoPath().projection(projection_swiss);

function drawMap(){
    var vizop = document.getElementById("vizop");
    var op = vizop.value;

    selected_canton = null;

    var ifgoogle = document.getElementById("googleCheck");

    map_div.selectAll('*').remove();

    Promise.all([density_promise, canton_promise, lake_promise, map_promise]).then((results) => {
        let cantonId_to_density = results[0];
        let canton_data = results[1];
        let lake_info = results[2];
        let map_data = results[3];

        if(ifgoogle.checked){
            renderWithGoogle(cantonId_to_density, canton_data, lake_info, map_data, op);
        }
        else{
            renderOnlySVG(cantonId_to_density, map_data, op);
        }
    });
}

function renderWithGoogle(cantonId_to_density, canton_data, lake_info, map_data, op){
    var googlemap = new google.maps.Map(document.getElementById("map"), {
            zoom: 8.5, //8.5
            mapTypeId: 'satellite',
            center: {lat: 0, lng: 0}, // center of switzerland lat: 46.8, lng: 8.2
            styles:[{"stylers": [{"saturation": -75},{"lightness": 75}]}],
            gestureHandling: "none",
            zoomControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER,
            },
        });
    //for update google map setting: googlemap.setOptions({zoomControl: false,gestureHandling: 'none'});
    //googlemap.fitBounds(google_bounds);

    //make google map bound to CH
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': "Switzerland"}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            googlemap.setCenter(results[0].geometry.location);
            googlemap.fitBounds(results[0].geometry.viewport);
            googlemap.setZoom(googlemap.getZoom()+0.5);
          }
    });

    var overlayongoogle = new google.maps.OverlayView();
    overlayongoogle.onAdd = function () {
        var maplayer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
        var g = maplayer.append("svg").append("g");

        // draw() will be called everytime the map is zoomed
        overlayongoogle.draw = function () {
            var markerOverlay = this;
            var overlayProjection = markerOverlay.getProjection();

            // Turn the overlay projection into a d3 projection
            var googleMapProjection = function (coordinates) {
                var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
                var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
                return [pixelCoordinates.x+1000 , pixelCoordinates.y+1000 ];
            }

            //draw all lake svg but set to hidden
            g.selectAll('a').remove();

            if(op == "byCoord"){
                g.append("a").attr("href", "#lake_info")
                    .selectAll("circle")
                    .data(lake_info)
                    .enter() // different object rendered for diff render option op == 'byCoord' / op == 'byElevation'
                    .append("circle")
                    .attr("class", (d) => d.canton)
                    .style("visibility", function(d){return (selected_canton == d.canton) ? "visible" : "hidden";})
                    .attr("fill", function(d){
                        if(d.ph === ''){
                            return color_not_sampled;
                        }else{
                            return color_sampled;
                        }
                    })
                    .attr("opacity", 0.6)
                    .attr("r", 5)
                    .attr("transform", (d) => "translate(" + googleMapProjection([d.lon,d.lat]) + ")")
                    .on("mouseover", function(d){
                        d3.select(this).style("cursor", "pointer");
                        map_tip.html("<b>Name: </b>" + d.name + "</br> <b>Elevation: </b>" + d.elevation + " m</br> <b>Surface area: </b>" + d.area + " hectares")
                            .style('display', 'block')
                            .style('opacity', 2);
                    })
                    .on("mousemove", function(d){
                        map_tip.style('top', (d3.event.layerY-580) + 'px')
                            .style('left', (d3.event.layerX-340) + 'px');
                    })
                    .on("mouseout", function(d){
                        map_tip.style('display', 'none').style('opacity', 0);
                    })
                    .on("click", function(d){
                        d3.select(this).attr("fill","yellow");
                        lakeInfo(d);
                    });
            } 
            else if(op == "byElevation"){
                lake_info = lake_info.sort(function(x, y){return d3.descending(x.elevation, y.elevation);})
                var eleva = lake_info.map(a => a.elevation);
                var elevation_scale = d3.scaleLinear().domain([d3.min(eleva), d3.max(eleva)]).range([6, 100]);

                g.append("a")
                    .attr("href", "#lake_info")
                    .selectAll(".point")
                    .data(lake_info)
                    .enter()
                    .append('polyline')
                    .attr('points', (d) => "0,0 4,"+(-elevation_scale(d.elevation))+" 8,0")
                    .attr("class", (d) => d.canton)
                    .style("visibility", function(d){return (selected_canton == d.canton) ? "visible" : "hidden";})
                    .attr("fill", function(d){
                        if(d.ph === ''){
                            return color_not_sampled;
                        }else{
                            return color_sampled;
                        }
                    })
                    .attr("opacity", 0.7)
                    .attr("transform", (d) => "translate(" + googleMapProjection([d.lon,d.lat]) + ")")
                    .on("mouseover", function(d){
                        d3.select(this).style("cursor", "pointer");
                        map_tip.html("<b>Name: </b>" + d.name + "</br> <b>Elevation: </b>" + d.elevation + " m</br> <b>Surface area: </b>" + d.area + " hectares")
                            .style('display', 'block')
                            .style('opacity', 2);
                    })
                    .on("mousemove", function(d){
                        map_tip.style('top', (d3.event.layerY-580) + 'px')
                            .style('left', (d3.event.layerX-340) + 'px');
                    })
                    .on("mouseout", function(d){
                        map_tip.style('display', 'none').style('opacity', 0);
                    })
                    .on("click", function(d){
                        d3.select(this).attr("fill","yellow");
                        lakeInfo(d);
                    });
            }
            else{
                lake_info = lake_info.sort(function(x, y){return d3.descending(x.area, y.area);})
                let areas = lake_info.map(a => a.area);
                //console.log(areas);

                var area_scale = d3.scaleLinear().domain([d3.min(areas), d3.max(areas)]).range([6, 150]);

                g.append("a")
                    .attr("href", "#lake_info")
                    .selectAll(".point")
                    .data(lake_info)
                    .enter()
                    .append("circle")
                    .attr("class", (d) => d.canton)
                    .style("visibility", function(d){return (selected_canton == d.canton) ? "visible" : "hidden";})
                    .attr("fill", function(d){
                        if(d.ph === ''){
                            return color_not_sampled;
                        }else{
                            return color_sampled;
                        }
                    })
                    .attr("opacity", 0.3)
                    .attr("r", (d) => area_scale(d.area)) //change to r is related to the area of the lake
                    .attr("transform", (d) => "translate(" + googleMapProjection([d.lon,d.lat]) + ")")
                    .on("mouseover", function(d){
                        d3.select(this).style("cursor", "pointer");
                        map_tip.html("<b>Name: </b>" + d.name + "</br> <b>Elevation: </b>" + d.elevation + " m</br> <b>Surface area: </b>" + d.area + " hectares")
                            .style('display', 'block')
                            .style('opacity', 2);
                    })
                    .on("mousemove", function(d){
                        map_tip.style('top', (d3.event.layerY-580) + 'px')
                            .style('left', (d3.event.layerX-340) + 'px');
                    })
                    .on("mouseout", function(d){
                        map_tip.style('display', 'none').style('opacity', 0);
                    })
                    .on("click", function(d){
                        d3.select(this).attr("fill","yellow");
                        lakeInfo(d);
                    });
            }

            var ongooglepath = d3.geoPath().projection(googleMapProjection);
            g.selectAll("path")
                .data(map_data.features)
                .attr("d", ongooglepath)
                .enter().append("svg:path")
                .attr("d", ongooglepath)
                .on("mouseover",function(d,i){
                    map_tip.style('top', (d3.event.layerY-580) + 'px')
                        .style('left', (d3.event.layerX-340) + 'px');
                    map_tip.html("<b>Canton: </b>" + d.properties.name + "</br> <b>Number of recorded lakes: </b>" + cantonId_to_density[d.id])
                        .style('display', 'block')
                        .style('opacity', 2);
                    if(selected_canton == d.properties.name.split('/')[0]){
                        d3.select(this).style("cursor", "zoom-out");
                    }else{
                        d3.select(this).style("cursor", "zoom-in");
                    }
                })
                .on("mousemove", function (d) {
                    map_tip.style('top', (d3.event.layerY-580) + 'px')
                        .style('left', (d3.event.layerX-340) + 'px');
                })
                .on("mouseout",function(d,i){
                    map_tip.style('display', 'none').style('opacity', 0);
                })
                .on("click", function(d){
                    // click on selected canton will zoom out to the swiss map
                    if(selected_canton == d.properties.name.split('/')[0]){
                        selected_canton = null;
                        d3.select(this).style("cursor", "zoom-in");

                        //zoom out to country level
                        geocoder.geocode( { 'address': "Switzerland"}, function(results, status) {
                              if (status == google.maps.GeocoderStatus.OK) {
                                googlemap.setCenter(results[0].geometry.location);
                                googlemap.fitBounds(results[0].geometry.viewport);
                                googlemap.setZoom(googlemap.getZoom()+0.5);
                              }
                        });
                    }
                    else{
                        d3.select(this).style("cursor", "zoom-out");
                        selected_canton = d.properties.name.split('/')[0];

                        //zoom in to canton level
                        var google_bounds = new google.maps.LatLngBounds();
                        var point1 = new google.maps.LatLng(canton_data[d.id][0], canton_data[d.id][2]),
                            point2 = new google.maps.LatLng(canton_data[d.id][1], canton_data[d.id][3]);
                        google_bounds.extend(point1);
                        google_bounds.extend(point2);
                        
                        googlemap.fitBounds(google_bounds); 
                        googlemap.setZoom(googlemap.getZoom()+0.5);
                        showCantonLakes(d.properties.name.split('/')[0], g);               
                    }
                });            
        };
    };
    overlayongoogle.setMap(googlemap);
}

function showCantonLakes(cname, g){
    //set lakes from corresponding canton id class visible
    var class_name = "."+cname;
    g.selectAll(class_name).style("visibility", "visible");
}

function renderOnlySVG(cantonId_to_density, map_data, op){
    var map_svg = map_div.append("svg").attr("class", "svgMap"),
        g = map_svg.append("g"),
        g_coord = map_svg.append("g");

    const densities = Object.values(cantonId_to_density);
    var color_scale = d3.scaleLinear().domain([d3.min(densities), d3.max(densities)]).range(["white", "#011A38"]);

    // set the viewbox to be the swissmap so that the map will be fill up the page
    var swiss_bounds  = path_swiss.bounds(map_data),
        swiss_dx = swiss_bounds[1][0] - swiss_bounds[0][0],
        swiss_dy = swiss_bounds[1][1] - swiss_bounds[0][1],

        swiss_x = (swiss_bounds[0][0] + swiss_bounds[1][0]) / 2,
        swiss_y = (swiss_bounds[0][1] + swiss_bounds[1][1]) / 2,
                    
        swiss_scale = .95 / Math.max(swiss_dx / map_width, swiss_dy / map_height),
        swiss_translate = [map_width / 2 - swiss_scale * swiss_x, map_height / 2 - swiss_scale * swiss_y];

    g.attr("transform", "translate(" + swiss_translate + ")scale(" + swiss_scale + ")");
    g_coord.attr("transform", "translate(" + swiss_translate + ")scale(" + swiss_scale + ")");

    g.selectAll("path")
        .data(map_data.features)
        .enter().append("path")
        .attr("d", path_swiss)
        .attr("stroke",d3.rgb('#011A38'))
        .attr("stroke-width",1)
        .attr("fill",(d) => color_scale(cantonId_to_density[d.id]))
        .on("mouseover",function(d,i){
            //d3.select(this).attr("stroke-width",2);
            map_tip.style('top', (d3.event.layerY+5) + 'px')
                .style('left', (d3.event.layerX+5) + 'px');
            map_tip.html("<b>Canton: </b>" + d.properties.name + "</br> <b>Number of recorded lakes: </b>" + cantonId_to_density[d.id])
                .style('display', 'block')
                .style('opacity', 2);
            if(selected_canton == d.properties.name.split('/')[0]){
                d3.select(this).style("cursor", "zoom-out");
            }else{
                d3.select(this).style("cursor", "zoom-in");
            }
        })
        .on("mousemove", function (d) {
            map_tip.style('top', (d3.event.layerY+5) + 'px')
                .style('left', (d3.event.layerX+5) + 'px');
        })
        .on("mouseout",function(d,i){
            d3.select(this).attr("stroke-width",1);
            map_tip.style('display', 'none').style('opacity', 0);
        })
        .on("click", function(d){
            // click on selected canton will zoom out to the swiss map
            if(selected_canton == d.properties.name.split('/')[0]){
                selected_canton = null;
                d3.select(this).style("cursor", "zoom-in");
                g.transition()
                    .duration(750)
                    .style("stroke-width", "1px")
                    .attr("transform", "translate(" + swiss_translate + ")scale(" + swiss_scale + ")");
                g_coord.selectAll('*').remove();
            }
            else{
                g_coord.selectAll('*').remove();
                d3.select(this).style("cursor", "zoom-out");
                selected_canton = d.properties.name.split('/')[0];

                var bounds = path_swiss.bounds(d), //this bound is the bound of the clicked canton
                    dx = bounds[1][0] - bounds[0][0],
                    dy = bounds[1][1] - bounds[0][1],

                    // for new center
                    x = (bounds[0][0] + bounds[1][0]) / 2,
                    y = (bounds[0][1] + bounds[1][1]) / 2,
                    
                    scale = .95 / Math.max(dx / map_width, dy / map_height),
                    translate = [map_width / 2 - scale * x, map_height / 2 - scale * y];

                g.transition()
                    .duration(750)
                    .style("stroke-width", 1.5 / scale + "px")
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                
                g_coord.transition()
                    .duration(750)
                    //.style("stroke-width", 1.5 / scale + "px")
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

                if (op == 'byCoord') {
                    drawCantonLakes(d.id, scale, g_coord);
                }
                else if (op == 'byElevation'){
                    drawCantonLakesbyElevation(d.id, scale, g_coord);
                }
                else{
                    drawCantonLakesbyArea(d.id, scale, g_coord);
                }                    
            }
        });
}

function drawCantonLakes(cid, scale, g_coord){
    // load lake coordinates for this canton
    d3.csv("data/cantons/"+cid+".csv").then((data) => {
        let lake_info = [];
        data.forEach((row) => {
            var lake = {lakeId: row.lake_id, name: row.Lake, link:row.link, canton: row.Canton, elevation: parseInt(row.Elevation), area: parseFloat(row.Area), 
                    lon: parseFloat(row.latlng.slice(1, -1).split(", ")[1]), lat: parseFloat(row.latlng.slice(1, -1).split(", ")[0]),l: row.max_length, w: row.max_width, dep: row.max_depth,
                    volumn: row.water_volume, ph: row.pH, cond: row.Conductivity , temp: row.Temperature , o2: row.O2 };
            lake_info.push(lake);
        });

        g_coord
            .append("a")
            .attr("href", "#lake_info")
            .selectAll(".point")
            .data(lake_info)
            .enter()
            .append("circle")
            .attr("fill", function(d){
                if(d.ph === ''){
                    return color_not_sampled;
                }else{
                    return color_sampled;
                }
            })
            .attr("opacity", 0.6)
            .attr("r", 6/scale)
            .attr("transform", (d) => "translate(" + projection_swiss([d.lon,d.lat]) + ")")
            .on("mouseover", function(d){
                d3.select(this).style("cursor", "pointer");
                map_tip.html("<b>Name: </b>" + d.name + "</br> <b>Elevation: </b>" + d.elevation + " m</br> <b>Surface area: </b>" + d.area + " hectares")
                    .style('display', 'block')
                    .style('opacity', 2);
            })
            .on("mousemove", function(d){
                map_tip.style('top', (d3.event.layerY+5) + 'px')
                    .style('left', (d3.event.layerX+5) + 'px');
            })
            .on("mouseout", function(d){
                map_tip.style('display', 'none').style('opacity', 0);
            })
            .on("click", function(d){
                d3.select(this).attr("fill","yellow");
                lakeInfo(d);
            });

    });
}

function drawCantonLakesbyElevation(cid, scale, g_coord){
    // load lake coordinates for this canton
    d3.csv("data/cantons/"+cid+".csv").then((data) => {
        let lake_info = [];
        data.forEach((row) => {
            var lake = {lakeId: row.lake_id, name: row.Lake, link:row.link, canton: row.Canton, elevation: parseInt(row.Elevation), area: parseFloat(row.Area), 
                    lon: parseFloat(row.latlng.slice(1, -1).split(", ")[1]), lat: parseFloat(row.latlng.slice(1, -1).split(", ")[0]),l: row.max_length, w: row.max_width, dep: row.max_depth,
                    volumn: row.water_volume, ph: row.pH, cond: row.Conductivity , temp: row.Temperature , o2: row.O2 };
            lake_info.push(lake);
        });

        lake_info = lake_info.sort(function(x, y){return d3.descending(x.elevation, y.elevation);})
        var eleva = lake_info.map(a => a.elevation);
        var elevation_scale = d3.scaleLinear().domain([d3.min(eleva), d3.max(eleva)]).range([2, 20]);

        g_coord
            .append("a")
            .attr("href", "#lake_info")
            .selectAll(".point")
            .data(lake_info)
            .enter()
            .append('polyline')
            .attr('points', (d) => "0,0 1,"+(-elevation_scale(d.elevation))+" 2,0")///////////
            .attr("fill", function(d){
                if(d.ph === ''){
                    return color_not_sampled;
                }
                else{
                    return color_sampled;
                }
            })
            .attr("opacity", 0.7)
            .attr("transform", (d) => "translate(" + projection_swiss([d.lon,d.lat]) + ")")
            .on("mouseover", function(d){
                d3.select(this).style("cursor", "pointer");
                map_tip.html("<b>Name: </b>" + d.name + "</br> <b>Elevation: </b>" + d.elevation + " m</br> <b>Surface area: </b>" + d.area + " hectares")
                    .style('display', 'block')
                    .style('opacity', 2);
            })
            .on("mousemove", function(d){
                map_tip.style('top', (d3.event.layerY+5) + 'px')
                    .style('left', (d3.event.layerX+5) + 'px');
            })
            .on("mouseout", function(d){
                map_tip.style('display', 'none').style('opacity', 0);
            })
            .on("click", function(d){
                d3.select(this).attr("fill","yellow");
                lakeInfo(d);
            });

    });
}

function drawCantonLakesbyArea(cid, scale, g_coord){
    // load lake coordinates for this canton
    d3.csv("data/cantons/"+cid+".csv").then((data) => {
        let lake_info = [];
        data.forEach((row) => {
            var lake = {lakeId: row.lake_id, name: row.Lake, link:row.link, canton: row.Canton, elevation: parseInt(row.Elevation), area: parseFloat(row.Area), 
                    lon: parseFloat(row.latlng.slice(1, -1).split(", ")[1]), lat: parseFloat(row.latlng.slice(1, -1).split(", ")[0]), l: row.max_length, w: row.max_width, dep: row.max_depth,
                    volumn: row.water_volume, ph: row.pH, cond: row.Conductivity , temp: row.Temperature , o2: row.O2 };
            lake_info.push(lake);
        });

        lake_info = lake_info.sort(function(x, y){return d3.descending(x.area, y.area);})
        let areas = lake_info.map(a => a.area);
        //console.log(areas);

        var area_scale = d3.scaleLinear().domain([d3.min(areas), d3.max(areas)]).range([2, 20]);

        g_coord
            .append("a")
            .attr("href", "#lake_info")
            .selectAll(".point")
            .data(lake_info)
            .enter()
            .append("circle")
            .attr("fill", function(d){
                if(d.ph === ''){
                    return color_not_sampled;
                }else{
                    return color_sampled;
                }
            })
            .attr("opacity", 0.3)
            .attr("r", (d) => area_scale(d.area)) //change to r is related to the area of the lake
            .attr("transform", (d) => "translate(" + projection_swiss([d.lon,d.lat]) + ")")
            .on("mouseover", function(d){
                d3.select(this).style("cursor", "pointer");
                map_tip.html("<b>Name: </b>" + d.name + "</br> <b>Elevation: </b>" + d.elevation + " m</br> <b>Surface area: </b>" + d.area + " hectares")
                    .style('display', 'block')
                    .style('opacity', 2);
            })
            .on("mousemove", function(d){
                map_tip.style('top', (d3.event.layerY+5) + 'px')
                    .style('left', (d3.event.layerX+5) + 'px');
            })
            .on("mouseout", function(d){
                map_tip.style('display', 'none').style('opacity', 0);
            })
            .on("click", function(d){
                d3.select(this).attr("fill","yellow");
                lakeInfo(d);
            });

    });
}

function lakeInfo(d){
    var info_text_div = d3.select("#text_descrition");
    var lake_data_div = d3.select("#lake_data");
    var lake_svg = d3.select("#lake_geojson"),
        width = lake_svg.node().getBoundingClientRect().width,
        height = lake_svg.node().getBoundingClientRect().height;
    lake_svg.selectAll("*").remove();

    var g = lake_svg.append("g");

    d3.json("data/lakes/"+d.lakeId.toString()+".geojson").then((data) =>{
        //console.log(d.lakeId);
        var lake_bounds  = path_swiss.bounds(data),
            lake_dx = lake_bounds[1][0] - lake_bounds[0][0],
            lake_dy = lake_bounds[1][1] - lake_bounds[0][1],

            lake_x = (lake_bounds[0][0] + lake_bounds[1][0]) / 2,
            lake_y = (lake_bounds[0][1] + lake_bounds[1][1]) / 2,
                        
            lake_scale = .95 / Math.max(lake_dx / width, lake_dy / height),
            lake_translate = [width / 2 - lake_scale * lake_x, height / 2 - lake_scale * lake_y];

        g.attr("transform", "translate(" + lake_translate + ")scale(" + lake_scale + ")");
        g.selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("d", path_swiss)
            .attr("stroke",d3.rgb('#90E0EF'))
            .attr("fill", "#90E0EF")
            .attr("stroke-width",2/lake_scale);
    });

    if(d.l == ""){
        d.l = "NA";
    }
    if(d.w == ""){
        d.w = "NA";
    }
    if(d.dep == ""){
        d.dep = "NA";
    }
    if(d.volumn == ""){
        d.volumn = "NA";
    }

    lake_data_div.html("<b style=\"font-size:bold;\">Max length: </b>" + d.l + "</br> <b>Max width: </b>" + d.w + " </br> <b>Max depth: </b>" + d.dep + "</br><b>Water volume: </b>" + d.volumn + "</br>" )
        .style('display', 'block')
        .style('opacity', 2);

    if(d.link == ""){
        d.link = "/empty_wiki.html";
    }
    info_text_div.html("<h5>" + d.name + "  <a href="+d.link+" target=\"_blank\" title=\"to Wiki\"><img src=\"data/wiki.png\" height=\"20px\"></a></h5> ")
        .style('display', 'block');

    var temp_temp_scale = d3.scaleLinear().domain([0, 20]).range([0, info_width*0.43]);
    var pointer_temp_g = info_div.select("#temp_data").select(".pointer");
    var temp_do_scale = d3.scaleLinear().domain([0, 12]).range([0, info_width*0.43]);
    var pointer_do_g = info_div.select("#do_data").select(".pointer");
    var temp_cond_scale = d3.scaleLinear().domain([0, 1200]).range([0, info_width*0.43]);
    var pointer_cond_g = info_div.select("#cond_data").select(".pointer");
    var temp_ph_scale = d3.scaleLinear().domain([0, 14]).range([0, info_width*0.43]);
    var pointer_ph_g = info_div.select("#ph_data").select(".pointer");
    
    if(d.ph === ''){
        //deavtivate four measures
        pointer_temp_g.transition()
            .duration(1000)
            .attr("transform", "translate(0,0)");
        pointer_do_g.transition()
            .duration(1000)
            .attr("transform", "translate(0,0)");
        pointer_cond_g.transition()
            .duration(1000)
            .attr("transform", "translate(0,0)");
        pointer_ph_g.transition()
            .duration(1000)
            .attr("transform", "translate(0,0)");

    }else{  
        pointer_temp_g.transition()
            .duration(1000)
            .attr("transform", "translate("+temp_temp_scale(parseFloat(d.temp.replace(',', '.')))+",0)");
        pointer_do_g.transition()
            .duration(1000)
            .attr("transform", "translate("+temp_do_scale(parseFloat(d.o2.replace(',', '.')))+",0)");
       pointer_cond_g.transition()
            .duration(1000)
            .attr("transform", "translate("+temp_cond_scale(parseFloat(d.cond.replace(',', '.')))+",0)");           
        pointer_ph_g.transition()
            .duration(1000)
            .attr("transform", "translate("+temp_ph_scale(parseFloat(d.ph.replace(',', '.')))+",0)");
    }

    //get lake imgs from google api
    //var url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+d.name+"&inputtype=textquery&fields=place_id&key=AIzaSyC9WNb8WzI-qcbOO_dP7soqYsXgEXeFcpY"
    //fetch(url)
      //  .then((response) => {
        //    console.log(response.json());
        //});
    var request = {
        query: d.name,
        fields: ["place_id"],
    };
    var img_request = {};

    service = new google.maps.places.PlacesService(map_invisible);
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            img_request = {placeId: results[0].place_id, fields: ["photos"]};
            //console.log(img_request);
            service.getDetails(img_request, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    createPhoto(result);
                }
            });
        }
    });
    

    function createPhoto(place) {
        var img_div = document.getElementById("lake_imgs");
        img_div.innerHTML = "";
        var photos = place.photos;
        //console.log(place);
        if (!photos) {
            console.log("no photo");
        }
        var img = document.createElement("img");
        img.classList.add('lake_img');
        for (var i=0;i<photos.length;i++){
            //console.log(photos[i]);
            img.src = photos[i].getUrl({'maxWidth': 1000, 'maxHeight': map_height*0.3});
            img_div.appendChild(img.cloneNode(true)); 
        }
    }

}

drawMap();