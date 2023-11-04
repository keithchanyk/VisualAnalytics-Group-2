d3.csv("datasets/airline-passenger-satisfaction_cleansed.csv").then(function (data) {
    // Create age bins
    var ageBins = d3.range(0, 101, 10);
    var ageLabels = ageBins.slice(0, -1).map(function (d, i) {
        return d + "-" + (d + 9);
    });


    // Create an 'AgeBin' property based on the 'Age' values
    data.forEach(function (d) {
        // console.log(d.Class)
        d.AgeBin = ageLabels.find(label => {
            var ageRange = label.split('-').map(Number);
            return d.Age >= ageRange[0] && d.Age <= ageRange[1];
        });
    });

    // Group the data by AgeBin and Class
    var groupedData = d3.rollups(data, v => v.length, d => d.AgeBin, d => d.Class);

    var classOrder = ['Business', 'Economy', 'Economy Plus'];


    // Sort the data based on the class order
    groupedData.forEach(function (group) {
        group[1].sort((a, b) => classOrder.indexOf(a[0]) - classOrder.indexOf(b[0]));
    });

    // const container = d3.select('#piechartone');
    // const containerWidth = container.node().getBoundingClientRect().width;
    // const containerHeight = containerWidth * 0.75; // Maintain a 4:3 aspect ratio

    // Set up the SVG dimensions and scales
    
    var svgWidth = 800;
    var svgHeight = 400;
    var margin = { top: 20, right: 30, bottom: 60, left: 90 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(ageLabels)
        .range([0, width])
        .padding(0.1)
        .paddingInner(0.2)  // Increase inner padding to create gaps between grouped bars
        .paddingOuter(0.1);  // Adjust outer padding as needed

    var y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d3.max(d[1], d => d[1]))])
        .nice()
        .range([height, 0]);

    var svg = d3.select("#bar-chart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create bars for each class
    var classes = groupedData[0][1].map(d => d[0]);
    color = d3.scaleOrdinal()
        .domain(classes)
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    console.log(groupedData)
    svg.selectAll("g")
        .data(groupedData)
        .enter().append("g")
        .attr("transform", d => "translate(" + x(d[0]) + ",0)")
        .selectAll("rect")
        .data(d => d[1])
        .enter().append("rect")
        .attr("x", (d, i) => x.bandwidth() / classes.length * i) // Adjust x position
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth() / classes.length)  // Adjust bar width
        .attr("height", d => height - y(d[1]))
        .attr("fill", d => color(d[0]))
        .append("title") // Add a title element
        .text(d => `Class: ${d[0]}\nPassengers: ${d[1]}`);;

    // X-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .style("text-anchor", "middle")
        .text("Age Bins");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Passengers");


    // Draw the gender legend
    var legend = d3.select("#bar-chart").selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", svgWidth - 18)
        .attr("y", 9)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", svgWidth - 28)
        .attr("y", 18)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d.charAt(0).toUpperCase() + d.slice(1);
        });

});
