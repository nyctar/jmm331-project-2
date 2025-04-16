d3.json("sentiment-bar-chart.json").then(data => {
    data.forEach(d => {
        d.index_by_10 = +d.index_by_10;
        d.sentiment = +d.sentiment;
        d.positive = d.sentiment > 0;
    });

    const margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
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
        .domain(d3.extent(data, d => d.sentiment)).nice()
        .range([height, 0]);

    const color = d => d.positive ? "#0E79B2" : "#F26419";

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.index_by_10))
        .attr("y", d => d.sentiment >= 0 ? y(d.sentiment) : y(0))
        .attr("height", d => Math.abs(y(d.sentiment) - y(0)))
        .attr("width", x.bandwidth())
        .attr("fill", color);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
});