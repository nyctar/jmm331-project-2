d3.json("word-cloud.json").then(function (originalWords) {
    const width = 400;
    const height = 300;
    const tooltip = d3.select("#tooltip");
    const maxWords = 100;
  
    const filtered = originalWords
      .filter(d => d.sentiment && d.size >= 10)
      .sort((a, b) => b.size - a.size)
      .slice(0, maxWords)
      .map(d => Object.assign({}, d, { originalSize: d.size }));
  
    const layout = d3.layout.cloud()
      .size([width + 100, height + 100])
      .words(filtered)
      .padding(1)
      .rotate(() => (~~(Math.random() * 2)) * 90)
      .fontSize(d => d.size * 1.0)
      .on("end", draw);
  
    layout.start();
  
    function draw(words) {
      const svg = d3.select("#wordCloud").append("svg")
        .attr("width", width + 100)
        .attr("height", height + 100)      
        .append("g")
        .attr("transform", `translate(${(width + 100) / 2}, ${(height + 100) / 2})`)
  
      svg.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", d => d.sentiment === "positive" ? "#0E79B2" : "#F26419")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .on("mouseover", function (event, d) {
          tooltip
            .style("opacity", 1)
            .html(`<strong>Word: ${d.text}</strong><br/>Count: ${d.originalSize}`);
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