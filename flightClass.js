var ageBinDropdown_one = document.getElementById("ageBinDropdown_one");
var ageBinDropdown_two = document.getElementById("ageBinDropdown_two");


ageBinDropdown_one.addEventListener("change", function () {
    let selectedAgeBin = ageBinDropdown_one.value;
    // Call a function to update the pie chart based on the selected age bin
    updatePieChartOne(selectedAgeBin);
});

ageBinDropdown_two.addEventListener("change", function () {
    let selectedAgeBin = ageBinDropdown_two.value;
    // Call a function to update the pie chart based on the selected age bin
    updatePieChartTwo(selectedAgeBin);
});


function updatePieChartOne(ageBin) {


    // Load the data
    d3.csv('datasets/airline-passenger-satisfaction_cleansed.csv').then(data => {

        data.forEach(function (d) {
            d.AgeBin = assignAgeBin(d.Age);
        });

        function assignAgeBin(age) {
            if (age >= 0 && age <= 79) {
                // For ages 0-79, create bins of 10
                var binStart = Math.floor(age / 10) * 10;
                return binStart + "-" + (binStart + 9);
            } else {
                // For ages 80 and above, use a separate bin
                return "80+";
            }
        }

        data = data.filter(function (d) {
            return d.AgeBin === ageBin;
        });


        // Remove previous pie chart elements
        d3.select('#chart_one').selectAll('*').remove();


        // Prepare the data
        const typeCounts = d3.rollup(data, v => v.length, d => d['Class']);
        const typeData = Array.from(typeCounts, ([type, count]) => ({ type, count }));


        console.log(typeData)

        // Get the container (div) and its dimensions
        const container = d3.select('#piechartone');
        const containerWidth = container.node().getBoundingClientRect().width;
        const containerHeight = containerWidth * 0.75; // Maintain a 4:3 aspect ratio


        // Create the SVG element
        const svg = d3.select('#chart_one')
            .selectAll('svg') // Select all existing SVG elements
            .data([typeData]); // Bind data to the SVG elements

        // Append new SVG elements
        const svgEnter = svg.enter()
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .append('g')
            .attr('transform', `translate(${containerWidth / 2},${containerHeight / 2})`);

        // Define the pie layout
        const pie = d3.pie()
            .value(d => d.count);

        const arcs = pie(typeData);

        // Define color scale
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw arcs
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(containerHeight, containerWidth) / 2 - 40);

        svgEnter.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('fill', d => colorScale(d.data.type))
            .attr('d', arc)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });

        // Add numbers
        svgEnter.selectAll('text')
            .data(arcs)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .text(d => 0) // Start with 0 and transition to the actual count
            .transition()
            .duration(1000) // Duration of the text transition
            .tween("text", function (d) {
                var i = d3.interpolate(0, d.data.count);
                return function (t) {
                    this.textContent = Math.round(i(t));
                };
            });


        // Create a legend container group
        const legendContainer = svgEnter
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(-${containerWidth / 2}, ${containerHeight / 2 - 30})`); // Adjust the y-coordinate as needed

        // Define color scale for the legend
        const legendColorScale = d3.scaleOrdinal()
            .domain(typeData.map(d => d.type))
            .range(d3.schemeCategory10);

        // Create legend items
        const legendItems = legendContainer
            .selectAll('.legend-item')
            .data(typeData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 100}, 0)`); // Adjust the spacing as needed

        // Add colored squares to represent classes
        legendItems
            .append('rect')
            .attr('width', 10) // Adjust the width as needed
            .attr('height', 10) // Adjust the height as needed
            .attr('fill', d => legendColorScale(d.type));

        // Add text labels for classes
        legendItems
            .append('text')
            .attr('x', 15) // Adjust the x-coordinate for text
            .attr('y', 10) // Adjust the y-coordinate for text
            .text(d => d.type);

    });
}


function updatePieChartTwo(ageBin) {


    // Load the data
    d3.csv('datasets/airline-passenger-satisfaction_cleansed.csv').then(data => {

        data.forEach(function (d) {
            d.AgeBin = assignAgeBin(d.Age);
        });

        function assignAgeBin(age) {
            if (age >= 0 && age <= 79) {
                // For ages 0-79, create bins of 10
                var binStart = Math.floor(age / 10) * 10;
                return binStart + "-" + (binStart + 9);
            } else {
                // For ages 80 and above, use a separate bin
                return "80+";
            }
        }

        data = data.filter(function (d) {
            return d.AgeBin === ageBin;
        });


        // Remove previous pie chart elements
        d3.select('#chart_two').selectAll('*').remove();


        // Prepare the data
        const typeCounts = d3.rollup(data, v => v.length, d => d['Class']);
        const typeData = Array.from(typeCounts, ([type, count]) => ({ type, count }));


        console.log(typeData)

        // Get the container (div) and its dimensions
        const container = d3.select('#piecharttwo');
        const containerWidth = container.node().getBoundingClientRect().width;
        const containerHeight = containerWidth * 0.75; // Maintain a 4:3 aspect ratio


        // Create the SVG element
        const svg = d3.select('#chart_two')
            .selectAll('svg') // Select all existing SVG elements
            .data([typeData]); // Bind data to the SVG elements

        // Append new SVG elements
        const svgEnter = svg.enter()
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .append('g')
            .attr('transform', `translate(${containerWidth / 2},${containerHeight / 2})`);

        // Define the pie layout
        const pie = d3.pie()
            .value(d => d.count);

        const arcs = pie(typeData);

        // Define color scale
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw arcs
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(containerHeight, containerWidth) / 2 - 40);

        svgEnter.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('fill', d => colorScale(d.data.type))
            .attr('d', arc)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });

        // Add numbers
        svgEnter.selectAll('text')
            .data(arcs)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .text(d => 0) // Start with 0 and transition to the actual count
            .transition()
            .duration(1000) // Duration of the text transition
            .tween("text", function (d) {
                var i = d3.interpolate(0, d.data.count);
                return function (t) {
                    this.textContent = Math.round(i(t));
                };
            });


        // Create a legend container group
        const legendContainer = svgEnter
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(-${containerWidth / 2}, ${containerHeight / 2 - 30})`); // Adjust the y-coordinate as needed

        // Define color scale for the legend
        const legendColorScale = d3.scaleOrdinal()
            .domain(typeData.map(d => d.type))
            .range(d3.schemeCategory10);

        // Create legend items
        const legendItems = legendContainer
            .selectAll('.legend-item')
            .data(typeData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 100}, 0)`); // Adjust the spacing as needed

        // Add colored squares to represent classes
        legendItems
            .append('rect')
            .attr('width', 10) // Adjust the width as needed
            .attr('height', 10) // Adjust the height as needed
            .attr('fill', d => legendColorScale(d.type));

        // Add text labels for classes
        legendItems
            .append('text')
            .attr('x', 15) // Adjust the x-coordinate for text
            .attr('y', 10) // Adjust the y-coordinate for text
            .text(d => d.type);
    });



}

// default render 0-9
updatePieChartOne("0-9")
updatePieChartTwo("0-9")