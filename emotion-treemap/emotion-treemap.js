const width = 1000;
const height = 500;

const colors = {
  joy: "#2A9D8F",
  sadness: "#577590",
  anger: "#FF6F61",
  fear: "#9D4EDD",
  trust: "#A3B18A",
  anticipation: "#F7B801",
  surprise: "#E96BA8",
  disgust: "#7F5539"
};

const container = d3.select("#emotion-treemap")
  .style("position", "relative")
  .style("width", `${width}px`)
  .style("height", `${height}px`)
  .style("margin", "auto");

d3.json("emotion-treemap.json").then(data => {
  const root = d3.hierarchy(data).sum(d => d.value);

  d3.treemap()
    .size([width, height])
    .padding(2)(root);

  container.selectAll(".treemap-node")
    .data(root.leaves())
    .enter().append("div")
    .attr("class", "treemap-node")
    .style("position", "absolute")
    .style("left", d => d.x0 + "px")
    .style("top", d => d.y0 + "px")
    .style("width", d => d.x1 - d.x0 + "px")
    .style("height", d => d.y1 - d.y0 + "px")
    .style("background", d => colors[d.data.name] || "#ccc")
    .style("display", "flex")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("color", "#fff")
    .style("text-align", "center")
    .style("line-height", "1.3")
    .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.3)")
    .html(d => `
      <div style="text-align: center;">
        <div style="font-size: 16px;"><strong>${d.data.name}</strong></div>
        <div style="font-size: 12px;">${d.data.value}</div>
      </div>
    `);
});