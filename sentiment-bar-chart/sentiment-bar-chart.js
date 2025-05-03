d3.json("sentiment-bar-chart.json").then(data => {
    data.forEach(d => {
        d.index_by_10 = +d.index_by_10;
        d.group_sentiment = +d.group_sentiment;
        d.positive = d.group_sentiment > 0;
    });

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#sentimentBarChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 140)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const chartPadding = { left: 5, right: 5 };

    const x = d3.scaleBand()
        .domain([...new Set(data.map(d => d.index_by_10))])
        .range([chartPadding.left, width - chartPadding.right])
        .padding(0.2);

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

    // Identify most positive and most negative sentiment values
    const mostPositive = d3.max(data, d => d.group_sentiment);
    const mostNegative = d3.min(data, d => d.group_sentiment);

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
            
        // Identify most positive and negative values
        const mostPositive = d3.max(data, d => d.group_sentiment);
        const mostNegative = d3.min(data, d => d.group_sentiment);

        svg.selectAll(".sentiment-circle")
            .data(data.filter(d =>
                d.group_sentiment === mostPositive || d.group_sentiment === mostNegative
            ))
            .enter()
            .append("circle")
            .attr("class", "sentiment-circle")
            .attr("cx", d => x(d.index_by_10) + x.bandwidth() / 2)
            .attr("cy", d => d.group_sentiment >= 0
                ? y(d.group_sentiment) // top of positive bar  
                : y(d.group_sentiment)) // bottom of negative bar
            .attr("r", 6)
            .attr("fill", "none")
            .attr("stroke", "#888")
            .attr("stroke-width", 2);


        // Bottom-aligned city labels with staggered offsets
        svg.selectAll(".city-label")
            .data(cityData)
            .enter()
            .append("text")
            .attr("class", "city-label")
            .attr("x", d => x(d.index_by_10) + x.bandwidth() / 2)
            .attr("y", d => {
                if (d.city === "Lagos de Moreno") return height + 15;
                if (d.city === "Tepatitlán") return height + 30;
                if (d.city === "Guadalajara") return height + 45;
                if (d.city === "Acaponeta") return height + 15;
                if (d.city === "El Rosario") return height + 30;
                if (d.city === "Mazatlan") return height + 45;
                return height + 15;
            })
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text(d => d.city);

            const subheading = svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 115)
            .attr("text-anchor", "middle")
            .style("font-size", "14px");
        
        // Line 1
        subheading.append("tspan")
            .attr("x", width / 2)
            .attr("dy", 0)
            .style("fill", "#555")
            .text("Each bar represents a group of 10 lines in the journal, categorized by sentiment type (");
        
        subheading.append("tspan")
            .style("fill", "#0E79B2")
            .style("font-weight", "bold")
            .text("positive");
        
        subheading.append("tspan")
            .style("fill", "#555")
            .text(" or ");
        
        subheading.append("tspan")
            .style("fill", "#F26419")
            .style("font-weight", "bold")
            .text("negative");
        
        subheading.append("tspan")
            .style("fill", "#555")
            .text(")");
        
        // Line 2
        subheading.append("tspan")
            .attr("x", width / 2)
            .attr("dy", "1.4em")
            .style("fill", "#555")
            .text("and sentiment score (");
        
        subheading.append("tspan")
            .style("fill", "#0E79B2")
            .style("font-weight", "bold")
            .text("more positive");
        
        subheading.append("tspan")
            .style("fill", "#555")
            .text(" or ");
        
        subheading.append("tspan")
            .style("fill", "#F26419")
            .style("font-weight", "bold")
            .text("more negative");
        
        subheading.append("tspan")
            .style("fill", "#555")
            .text("). Hovering shows a selected line from the group.");        
    });
});
