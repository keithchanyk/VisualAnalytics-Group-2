// TABLEAU DASHBOARD FOR PASSENGER DEMOGRAPHICS
var divElement = document.getElementById('viz1699280142963'); 
var vizElement = divElement.getElementsByTagName('object')[0]; 
if (divElement.offsetWidth > 800) { 
    vizElement.style.width = '100%'; 
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px'; 
} else if (divElement.offsetWidth > 500) { 
    vizElement.style.width = '100%'; 
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
 } else { 
    vizElement.style.width = '100%'; 
    vizElement.style.height = '727px'; 
} 
var scriptElement = document.createElement('script'); 
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'; 
vizElement.parentNode.insertBefore(scriptElement, vizElement);

// TABLEAU DASHBOARD FOR PASSENGER SATISFACTION
var divElement = document.getElementById('viz1698669550215');
var vizElement = divElement.getElementsByTagName('object')[0];
if (divElement.offsetWidth > 800) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else if (divElement.offsetWidth > 500) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else {
    vizElement.style.width = '100%';
    vizElement.style.height = '1377px';
}
var scriptElement = document.createElement('script');
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
vizElement.parentNode.insertBefore(scriptElement, vizElement);


// TABLEAU DASHBOARD FOR FLIGHT DELAY
var divElement = document.getElementById('viz1699255013357');
var vizElement = divElement.getElementsByTagName('object')[0];
if (divElement.offsetWidth > 800) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else if (divElement.offsetWidth > 500) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else {
    vizElement.style.width = '100%';
    vizElement.style.height = '1527px';
}
var scriptElement = document.createElement('script');
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
vizElement.parentNode.insertBefore(scriptElement, vizElement);


// TABLEAU DASHBOARD FOR FLIGHT REVIEW
var divElement = document.getElementById('viz1698842502636');
var vizElement = divElement.getElementsByTagName('object')[0];
if (divElement.offsetWidth > 800) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else if (divElement.offsetWidth > 500) {
    vizElement.style.width = '1366px';
    vizElement.style.height = '795px';
} else {
    vizElement.style.width = '100%';
    vizElement.style.height = '1577px';
}
var scriptElement = document.createElement('script');
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
vizElement.parentNode.insertBefore(scriptElement, vizElement);


// D3 CHART FOR SCATTER PLOT

// Update CSV file path here
var CSV_FILE_PATH = "./datasets/airline_delay_cause.csv";

// Set the dimensions of the chart
var canvasWidth = 1000;
var canvasHeight = 500;

// scales
var x, y, size;

// axes
var xAxis;
var yAxis;

// Read CSV data to a list of dictionaries, dataList
var dataList = []

/*** 
* dataList should look like this:
    [
        {date: "Jan 2023", weather_delay_count: 1, weather_delay_min: 3},
        {date: "Feb 2023", weather_delay_count: 1, weather_delay_min: 3},
        ...
    ]
***/

d3.csv(CSV_FILE_PATH).then(function (data) {
    data.forEach(function (d) {
        var newData = {}
        newData.date = d3.timeFormat("%b %Y")(new Date(d.year, d.month - 1));
        newData.weather_delay_count = +d.weather_delay_count;
        newData.weather_delay_min = +d.weather_delay_min;
        newData.carrier_name = d.carrier_name;
        newData.airport_name = d.airport_name;
        dataList.push(newData);
    });
    console.log(dataList);
    makeWeatherBubbleChart(dataList);
});

function makeWeatherBubbleChart(data) {
    // y position
    y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.weather_delay_min; })])
        .range([canvasHeight * 0.85, canvasHeight * 0.1]);

    // x position
    var parseTime = d3.timeParse("%b %Y");
    data.forEach(function (d) {
        d.date = parseTime(d.date);
    });

    x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([canvasWidth * 0.1, canvasWidth * 0.85]);

    // bubble size
    size = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.weather_delay_count; })])
        .range([1, 10]);

    // color scale
    color = d3.scaleSequential()
        .domain([0, d3.max(data, function (d) { return d.weather_delay_count; })])
        .interpolator(d3.interpolateBlues);

    var canvas = d3.select(".chart")
        .style("width", canvasWidth)
        .style("height", canvasHeight);

    var circle = d3.select(".chart").selectAll("circle")
        .data(data);

    // ENTER
    var enter = circle.enter().append("circle")
        .attr("fill-opacity", 0.85)
        .attr("r", function (d) { return size(d.weather_delay_count); })
        .attr("stroke-width", "0px");

    // Add a title to the point (on mouseover)
    enter.append("svg:title")
        .text(function (d) {
            var parseTime = d3.timeFormat("%b %Y");
            var hover_text = "Carrier: " + d.carrier_name +
                "\nAirport: " + d.airport_name +
                "\nMonth/Year: " + parseTime(d.date) +
                "\nTotal Delay (mins): " + d.weather_delay_min +
                "\nNum of Delays: " + d.weather_delay_count;
            return hover_text;
        });

    // UPDATE
    enter.merge(circle)
        .attr("cx", function (d) { return x(d.date); })
        .attr("cy", function (d) { return y(d.weather_delay_min); })
        .attr("fill", function (d) { return color(d.weather_delay_count); });

    xAxis = d3.axisBottom()
        .scale(x);

    yAxis = d3.axisLeft()
        .scale(y);

    var yAxisGroup = canvas.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (canvasWidth * 0.075) + ", 0)")
        .call(yAxis);

    yAxisGroup.selectAll("text")
        .attr("transform", "translate(-10,0)");

    canvas.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (canvasHeight - 60) + ")")
        .call(xAxis);

    // Add y-axis title
    canvas.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", 0 - (canvasHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Weather Delay (min)");

    // Add x-axis title
    canvas.append("text")
        .attr("y", canvasHeight - 35)
        .attr("x", canvasWidth / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Month/Year");

    // Add legend
    var legend_title = "Number of delays"

    var legend = canvas.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (canvasWidth - 125) + "," + (canvasHeight * 0.1) + ")")
        .selectAll("g")
        .data(color.ticks(6).slice(1).reverse())
        .enter().append("g");

    legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .style("text-anchor", "start")
        .text(legend_title);

    var legendItems = legend.selectAll("g")
        .data(color.ticks(6).slice(1).reverse())
        .enter().append("g");

    legendItems.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", function (d, i) { return i * 25; })
        .attr("fill", color);

    legendItems.append("text")
        .attr("x", 46)
        .attr("y", function (d, i) { return i * 25 + 12; })
        .attr("dy", "0.35em")
        .text(function (d) { return "≥ " + Math.round(d); });
}

// END OF D3 CHART FOR SCATTER PLOT

const app = Vue.createApp({
    data() {
        return {
            currentDiv: 'divA'
        }
    },
    methods: {
        showDiv(divId) {
            this.currentDiv = divId;
        }
    }
});

app.mount('#app');