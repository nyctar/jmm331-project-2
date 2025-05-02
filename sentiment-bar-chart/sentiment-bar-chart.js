d3.json("sentiment-bar-chart.json").then(data => {
    data.forEach(d => {
        d.index_by_10 = +d.index_by_10;
        d.group_sentiment = +d.group_sentiment;
        d.positive = d.group_sentiment > 0;
    });

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#sentimentBarChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
                   .html(`<strong>Group ${d.index_by_10}</strong><br/>${d.full_text}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Sentiment by Group of 10 Lines");
});
