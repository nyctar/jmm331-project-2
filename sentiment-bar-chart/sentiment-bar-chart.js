d3.json("sentiment-bar-chart.json").then(data => {
    data.forEach(d => {
        d.index_by_10 = +d.index_by_10;
        d.group_sentiment = +d.group_sentiment;
        d.positive = d.group_sentiment > 0;
    });

    const margin = { top: 10, right: 10, bottom: 60, left: 10 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#sentimentBarChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 140)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x = d3.scaleBand()
        .domain(data.map(d => d.index_by_10))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.group_sentiment)).nice()
        .range([height, 0]);

    const color = d => d.positive ? "#0E79B2" : "#F26419";

    const tooltip = d3.select("#tooltip");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.index_by_10))
        .attr("y", d => d.group_sentiment >= 0 ? y(d.group_sentiment) : y(0))
        .attr("height", d => Math.abs(y(d.group_sentiment) - y(0)))
        .attr("width", x.bandwidth())
        .attr("fill", color)
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                   .html(`${d.full_text}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    // Load and render city markers
    d3.json("city_markers.json").then(cityData => {
        // Vertical dashed lines
        svg.selectAll(".city-line")
            .data(cityData)
            .enter()
            .append("line")
            .attr("class", "city-line")
            .attr("x1", d => x(d.index_by_10) + x.bandwidth() / 2)
            .attr("x2", d => x(d.index_by_10) + x.bandwidth() / 2)
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "#999")
            .attr("stroke-dasharray", "4 2")
            .attr("stroke-width", 1);

        // Bottom-aligned city labels with staggered offsets
        svg.selectAll(".city-label")
            .data(cityData)
            .enter()
            .append("text")
            .attr("class", "city-label")
            .attr("x", d => x(d.index_by_10) + x.bandwidth() / 2)
            .attr("y", d => {
                if (d.city === "San Maria del Lagos") return height + 15;
                if (d.city === "Tepatillan") return height + 30;
                if (d.city === "Gaudalaxhara") return height + 45;
                if (d.city === "Cauponetta") return height + 15;
                if (d.city === "Rosario") return height + 30;
                if (d.city === "Mazatlan") return height + 45;
                return height + 15;
            })
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text(d => d.city);

        // Subheading below chart
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 115)
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            .selectAll("tspan")
            .data([
                "Each of the bar represents a group of 10 lines in the journal categorized by the sentiment type (positive or negative)",
                "and score (more positive or more negative). Once hovered, a selected line from the group is shown."
            ])
            .enter()
            .append("tspan")
            .attr("x", width / 2)
            .attr("dy", (d, i) => i === 0 ? 0 : "12px")
            .text(d => d);
    });
});
