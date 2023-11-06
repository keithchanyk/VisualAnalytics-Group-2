 // Define age bins
 const ageBins = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80+"];

 // Define genders
 const genders = ["Male", "Female"];


 // Load data from the CSV file
 d3.csv("datasets/airline-passenger-satisfaction_cleansed.csv").then(function (data) {

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
     };

     // Create an empty array to store passenger counts
     const passengerCounts = [];

     // Calculate passenger counts for each combination of age bin and gender
     ageBins.forEach(age => {
         genders.forEach(gender => {
             const count = data.filter(d => d.AgeBin === age && d.Gender === gender).length;
             console.log(count)
             passengerCounts.push(count);
         });
     });

     console.log(passengerCounts)

     const num_row = passengerCounts.length;
     var chartContainer = document.querySelector('.heatmap-container');
     var containerWidth = chartContainer.clientWidth; // Get the width of the container
     var containerHeight = containerWidth * 0.5; // Maintain a 4:3 aspect ratio

     // Set up dimensions and colors

     var margin = { top: 20, right: 30, bottom: 60, left: 90 };

     cellSize = containerHeight / num_row
     cellWidth = cellSize * 3
     gap = cellWidth / 20
     const fontSize = containerWidth / 100; 

     const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
         .domain([d3.min(passengerCounts), d3.max(passengerCounts)]);

     // Create the SVG element for the heatmap
     const svg = d3.select("#heatmap")
         .append("svg")
         .attr("width", containerWidth)
         .attr("height", containerHeight)
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;


     // Create the heatmap
     const heatmap = svg.selectAll(".cell")
         .data(passengerCounts)
         .enter()
         .append("rect")
         .attr("x", (d, i) => i % genders.length * (cellWidth + gap) + margin.left)
         .attr("y", (d, i) => Math.floor(i / genders.length) * (cellSize + gap) + margin.top)
         .attr("width", cellWidth)
         .attr("height", cellSize)
         .style("fill", d => colorScale(d))
         .append("title") // Add a title element
         .text(d => 'Count: ' + d);


     // Add X-axis labels (Age Bins) to the left of the heatmap
     svg.selectAll(".xLabel")
         .data(ageBins)
         .enter()
         .append("text")
         .text(d => ('Age ' +  d) )
         .attr("x", margin.left - gap * 3)  // Adjust the x-coordinate to move it to the left
         .attr("y", (d, i) => i * (cellSize + gap) + margin.top + cellSize / 2)  // Center the label vertically
         .style("text-anchor", "end")  // Align text to the right
         .style("font-size", fontSize + "px")
         .attr("class", "xLabel");

     // Add Y-axis labels (Gender) above the heatmap
     svg.selectAll(".yLabel")
         .data(genders)
         .enter()
         .append("text")
         .text(d => d )
         .attr("x", (d, i) => i * (cellWidth + gap) + margin.left + cellWidth / 2)  // Center the label horizontally
         .attr("y", margin.top - gap)  // Adjust the y-coordinate to move it above the heatmap
         .style("text-anchor", "middle")  // Align text to the center
         .style("font-size", fontSize + "px")
         .attr("class", "yLabel");

 });