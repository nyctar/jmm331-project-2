d3.json("word-cloud.json").then(function (originalWords) {
  const width = 500;
  const height = 400;
  const tooltip = d3.select("#tooltip");
  const maxWords = 50;

  const filtered = originalWords
    .filter(d => d.size >= 10)
    .sort((a, b) => b.size - a.size)
    .slice(0, maxWords)
    .map(d => Object.assign({}, d, { originalSize: d.size }));

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(filtered)
    .padding(4)
    .rotate(() => (~~(Math.random() * 2)) * 90)
    .fontSize(d => d.size * 0.8)
    .on("end", draw);

  layout.start();

  function draw(words) {
    const svg = d3.select("#wordCloud").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    svg.selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", d => d.size + "px")
      .style("fill", "#d13e37")
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text)
      .on("mouseover", function (event, d) {
        const sentiment = d.sentiment ?? "neutral";
        const count = d.originalSize;
        const word = d.text;
      
        const sentimentColor =
          sentiment === "positive" ? "#0E79B2" :
          sentiment === "negative" ? "#F26419" :
          "#000";
      
        const html = `
          <div style="font-size: 16px;"><strong>Count:</strong> ${count}</div>
          <div style="color: ${sentimentColor};"><strong>Sentiment:</strong> ${sentiment}</div>
          <div style="font-size: 12px; color: #999;">${word}</div>
        `;
      
        tooltip
          .style("opacity", 1)
          .html(html);
      })        
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
  }
});