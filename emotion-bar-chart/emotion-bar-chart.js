d3.json("emotion-bar-chart.json").then(data => {
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#emotionBarChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 180)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.index_by_10))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.n)])
    .nice()
    .range([height, 0]);

  const emotionColors = {
    joy: "#2A9D8F",
    sadness: "#6C91BF",
    anger: "#C1121F",
    fear: "#9D4EDD",
    trust: "#1B98E0",
    anticipation: "#F7B801",
    surprise: "#FF6F61",
    disgust: "#7F5539"
  };

  const tooltip = d3.select("#tooltip");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.index_by_10))
    .attr("y", d => y(d.n))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.n))
    .attr("fill", d => emotionColors[d.sentiment] || "#ccc")
    .on("mouseover", function(event, d) {
      const emotion = d.sentiment;
      const color = emotionColors[emotion];
      const emotionCapitalized = emotion.charAt(0).toUpperCase() + emotion.slice(1);
    
      tooltip
        .style("opacity", 1)
        .html(`
          <div style="color: ${color}; font-size: 16px; font-weight: bold;">
            ${emotionCapitalized}
          </div>
          <em>${d.full_text}</em>
        `);
    })    
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  svg.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => {
      g.selectAll(".tick line").attr("y2", -1).attr("y1", -1);
      g.selectAll(".tick text")
        .style("font-family", "Elante")
        .style("font-size", "10px")
        .style("fill", "#574237");
    });

  // Load and render city markers
  d3.json("city_markers.json").then(cityData => {
    svg.selectAll(".city-line")
      .data(cityData)
      .enter()
      .append("line")
      .attr("x1", d => x(d.index_by_10) + x.bandwidth() / 2)
      .attr("x2", d => x(d.index_by_10) + x.bandwidth() / 2)
      .attr("y1", -10)
      .attr("y2", height + 20)
      .attr("stroke", "#574237")
      .attr("stroke-dasharray", "4 2")
      .attr("stroke-width", 1);

    svg.selectAll(".city-label")
      .data(cityData)
      .enter()
      .append("text")
      .attr("x", d => x(d.index_by_10) + x.bandwidth() / 2)
      .attr("y", d => {
        if (d.city === "Lagos de Moreno") return height + 35;
        if (d.city === "Tepatitlán") return height + 50;
        if (d.city === "Guadalajara") return height + 65;
        if (d.city === "Acaponeta") return height + 35;
        if (d.city === "El Rosario") return height + 50;
        if (d.city === "Mazatlan") return height + 65;
        return height + 35;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#574237")
      .text(d => d.city);

    // Emotion legend group
    const legendGroup = svg.append("g")
      .attr("transform", `translate(${width / 2},${height + 85})`);

    legendGroup.append("rect")
      .attr("x", -200)
      .attr("y", 0)
      .attr("width", 400)
      .attr("height", 24)
      .attr("rx", 4)
      .attr("fill", "none")
      .attr("stroke", "#574237");

    const emotionLegend = legendGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 16)
      .style("font-size", "12px")
      .style("font-family", "Elante")

      emotionLegend.append("tspan")
        .style("fill", "#F7B801")
        .style("font-weight", "bold")
        .text("Anticipation");

      emotionLegend.append("tspan")
        .style("fill", "#574237")
        .text(" | ");

      emotionLegend.append("tspan")
        .style("fill", "#C1121F")
        .style("font-weight", "bold")
        .text("Anger");

      emotionLegend.append("tspan")
        .style("fill", "#574237")
        .text(" | ");

      emotionLegend.append("tspan")
        .style("fill", "#2A9D8F")
        .style("font-weight", "bold")
        .text("Joy");

      emotionLegend.append("tspan")
      .style("fill", "#574237").text(" | ");

      emotionLegend.append("tspan")
        .style("fill", "#9D4EDD")
        .style("font-weight", "bold")
        .text("Fear");

      emotionLegend.append("tspan")
        .style("fill", "#574237")
        .text(" | ");

      emotionLegend.append("tspan")
        .style("fill", "#574237")
        .text("Trust | Sadness | Surprise | Disgust");

    // Caption
    const caption = svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 140)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#574237");

        // Line 1
    caption.append("tspan")
      .attr("x", width / 2)
      .attr("dy", 0)
      .text("Each bar represents a group of 10 lines in the journal categorized by the");

    // Line 2 part 1
    caption.append("tspan")
      .attr("x", width / 2)
      .attr("dy", "1.4em")
      .text("most frequent type of ");

    // Line 2 part 2 — animated "emotion"
    const animatedEmotion = caption.append("tspan")
      .style("font-weight", "bold")
      .style("fill", "#F7B801")
      .text("emotion");

    // Line 2 part 3
    caption.append("tspan")
      .style("fill", "#574237")
      .text(". Hovering shows a selected line from the group.");

    // Animate the emotion tspan color
    const emotionColors = ["#F7B801", "#C1121F", "#2A9D8F", "#9D4EDD"];
    let colorIndex = 0;

    function cycleEmotionColor() {
      colorIndex = (colorIndex + 1) % emotionColors.length;
      animatedEmotion
        .transition()
        .duration(1000)
        .style("fill", emotionColors[colorIndex])
        .on("end", cycleEmotionColor);
    }

    cycleEmotionColor();
  });
});