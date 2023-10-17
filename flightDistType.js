
// set the dimensions and margins of the graph
const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#flight_dist_type")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("datasets/airline-passenger-satisfaction_cleansed.csv").then(function (data) {

    const xMax = d3.max(data, d => parseFloat(d.YourColumnNameForXValue));
    const xMin = 0; // You may choose a different minimum value if needed

    const groupedData = d3.group(data, d => d['Flight Distance Category']);

    // Extract category names and their corresponding values
    const categories = Array.from(groupedData.keys());
    // const values = Array.from(groupedData.values()).map(arr => d3.sum(arr, d => parseFloat(d['ID'])));
    const counts = Array.from(groupedData.values()).map(arr => arr.length);


    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(counts)]) // sets the max value of the x-axis
        .range([0, width]); // set the length of the x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)) // places it at the bottom
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)") // rotates the text -45 degree to make it slanted
        .style("text-anchor", "end"); // align to the bottom

    // Y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d['Flight Distance Category'])) // categories of the y-axis
        .padding(.1); // padding between each bin
    svg.append("g")
        .call(d3.axisLeft(y))

    // Bars representing entry counts
    svg.selectAll("rect")
        .data(counts)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => y(categories[i]))
        .attr("width", d => x(d))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
        // TOOLTIPS
        .append("title") // Add a title element for tooltips
        .text((d, i) => `Category: ${categories[i]}\nNumber of Travellers: ${d}`);

})
