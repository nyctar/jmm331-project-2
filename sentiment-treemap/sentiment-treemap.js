const width = 500;
const height = 100;

const sentimentColors = {
  positive: "#0E79B2",
  negative: "#F26419"
};

const container = d3.select("#sentiment-treemap")
  .style("position", "relative")
  .style("width", `${width}px`)
  .style("height", `${height}px`)
  .style("margin", "auto");

d3.json("sentiment-treemap.json").then(data => {
  const root = d3.hierarchy(data).sum(d => d.value);

  d3.treemap()
    .size([width, height])
    .padding(3)(root);

  container.selectAll(".treemap-node")
    .data(root.leaves())
    .enter().append("div")
    .attr("class", "treemap-node")
    .style("position", "absolute")
    .style("left", d => d.x0 + "px")
    .style("top", d => d.y0 + "px")
    .style("width", d => d.x1 - d.x0 + "px")
    .style("height", d => d.y1 - d.y0 + "px")
    .style("background", d => sentimentColors[d.data.name] || "#ccc")
    .style("display", "flex")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("color", "#fff")
    .style("text-align", "center")
    .style("line-height", "1.3")
    .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.3)")
    .html(d => `
      <div style="text-align: center;">
        <div style="font-size: 12px;"><strong>${d.data.name}</strong></div>
        <div style="font-size: 8px;">${d.data.value}</div>
      </div>
    `);
});
