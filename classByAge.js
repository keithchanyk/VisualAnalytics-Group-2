d3.csv("datasets/airline-passenger-satisfaction_cleansed.csv").then(function (data) {
    // Create age bins
    // Create age bins
    var ageBins = [0, 10, 20, 30, 40, 50, 60, 70, 80]; // Define specific age bins
    var ageLabels = ageBins.map(function (d, i) {
        if (i === ageBins.length - 1) {
            return d + "+"; // Change the label for the last bin to "80+"
        }
        return d + "-" + (d + 9);
    });
    console.log(ageLabels)

    // Create an 'AgeBin' property based on the new 'ageBins'
    data.forEach(function (d) {
        var ageBinLabel = ageLabels.find(label => {
            var ageRange = label.split('-').map(Number);
            return d.Age >= ageRange[0] && d.Age <= ageRange[1];
        });

        // Check if the label is "80+" and assign the appropriate age bin
        if (d.Age >= 80) {
            d.AgeBin = "80+";
        } else {
            d.AgeBin = ageBinLabel;
        }
    });

    // Group the data by AgeBin and Class
    var groupedData = d3.rollups(data, v => v.length, d => d.AgeBin, d => d.Class);
    console.log(groupedData)
    var classOrder = ['Business', 'Economy', 'Economy Plus'];


    // Sort the data based on the class order
    groupedData.forEach(function (group) {
        group[1].sort((a, b) => classOrder.indexOf(a[0]) - classOrder.indexOf(b[0]));
    });
    
    var chartContainer = document.querySelector('.chart-container');
    var containerWidth = chartContainer.clientWidth; // Get the width of the container
    var containerHeight = containerWidth * 0.65; // Maintain a 4:3 aspect ratio

    var margin = { top: 20, right: 30, bottom: 60, left: 90 };
    var width = containerWidth - margin.left - margin.right;
    var height = containerHeight - margin.top - margin.bottom;
    const fontSize = containerWidth / 70;

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
        .attr('width', containerWidth) // Set the width dynamically
        .attr('height', containerHeight) // Set the height dynamically
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create bars for each class
    var classes = groupedData[0][1].map(d => d[0]);
    color = d3.scaleOrdinal()
        .domain(classes)
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

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
        .text(d => `Class: ${d[0]}\nPassengers: ${d[1]}`);

    // X-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .style("font-size", fontSize + "px");

    // Y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", fontSize + "px");

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .style("text-anchor", "middle")
        .style("font-size", fontSize + "px")
        .text("Age Bins");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", fontSize + "px")
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
        .attr("x", containerWidth - 30)
        .attr("y", 9)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", containerWidth - 45)
        .attr("y", 18)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", fontSize + "px")
        .text(function (d) {
            return d.charAt(0).toUpperCase() + d.slice(1);
        });

});
