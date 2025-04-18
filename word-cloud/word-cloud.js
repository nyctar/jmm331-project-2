d3.json("word-cloud.json").then(function(words) {
  const width = 500;
  const height = 400;

  const colorScale = d3.scaleLinear()
    .domain([0, words.length - 1])
    .range(["#0E79B2", "#F26419"])
    .interpolate(d3.interpolateRgb);

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(d => Object.create(d)))
    .padding(2)
    .rotate(() => (~~(Math.random() * 2)) * 90)
    .fontSize(d => d.size * 0.6)
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("#wordCloud").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => d.size + "px")
      .style("fill", (d, i) => colorScale(i))
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
});