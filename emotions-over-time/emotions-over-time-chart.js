d3.json("emotions_over_time.json").then(data => {
    const width = 600;
    const height = 150;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
    // Emotion color palette (fallback to blue if missing)
    const emotionColors = {
      joy: "#0E79B2",
      sadness: "#1B98E0",
      anger: "#F26419",
      fear: "#F6AE2D",
      trust: "#2A9D8F",
      anticipation: "#7D6B91",
      surprise: "#FFB703",
      disgust: "#A53860"
    };
  
    data.forEach(emotionData => {
      const barColor = emotionColors[emotionData.sentiment] || "#A0C4E8";  // fallback color
  
      const container = d3.select("#emotionsOverTimeChart")
        .append("div")
        .attr("class", "chart");
  
      container.append("h3").text(`${emotionData.sentiment}`);
  
      const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      const x = d3.scaleLinear()
        .domain(d3.extent(emotionData.data, d => d.index_by_10))
        .range([0, width]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(emotionData.data, d => d.count)])
        .range([height, 0]);
  
      // Bars with emotion-specific color
      svg.selectAll("rect")
        .data(emotionData.data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.index_by_10))
        .attr("y", d => y(d.count))
        .attr("width", 5)
        .attr("height", d => height - y(d.count))
        .attr("fill", barColor);
  
      // Peak dot
      svg.append("circle")
        .attr("cx", x(emotionData.peak_index) + 2.5)  // center over 5px bar
        .attr("cy", y(emotionData.peak_count))
        .attr("r", 6)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 2);
    });
  });
  