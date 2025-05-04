const width = 900;
const height = 600;

const color = d3.scaleOrdinal()
  .domain(["Travel", "Weather", "Settlement"])
  .range(["#AD7300", "#D13E37", "#5D6B8F"]);
const tooltip = d3.select("#tooltip");

const svg = d3.select("#network")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  d3.json("network.json").then(graph => {
    graph.links = graph.links.filter(d => d.weight >= 8);
    const color = d3.scaleOrdinal()
      .domain(["Travel", "Weather", "Settlement"])
      .range(["#AD7300", "#D13E37", "#5D6B8F"]);
  
    function updateGraph(selectedLabel) {
      const isAll = selectedLabel === "all";
      const filteredNodes = isAll ? graph.nodes : graph.nodes.filter(d => d.label === selectedLabel);
      const nodeSet = new Set(filteredNodes.map(d => d.id));
      const filteredLinks = graph.links.filter(d => nodeSet.has(d.source) && nodeSet.has(d.target));
      const nodeMap = new Map(filteredNodes.map(d => [d.id, d]));
  
      // Rebuild adjacency for highlighting
      const adjacency = {};
      filteredLinks.forEach(link => {
        adjacency[link.source] = adjacency[link.source] || new Set();
        adjacency[link.target] = adjacency[link.target] || new Set();
        adjacency[link.source].add(link.target);
        adjacency[link.target].add(link.source);
      });
  
      // Clear previous
      svg.selectAll("g").remove();
  
      // Draw links
      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 1)
        .selectAll("line")
        .data(filteredLinks)
        .enter().append("line")
        .attr("x1", d => nodeMap.get(d.source).x)
        .attr("y1", d => nodeMap.get(d.source).y)
        .attr("x2", d => nodeMap.get(d.target).x)
        .attr("y2", d => nodeMap.get(d.target).y);
  
      // Draw nodes
      const node = svg.append("g")
        .selectAll("circle")
        .data(filteredNodes)
        .enter().append("circle")
        .attr("r", 8)
        .attr("fill", d => color(d.label))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .on("mouseover", (event, d) => {
          const neighbors = adjacency[d.id] || new Set();
          const connectionCount = neighbors.size;
  
          tooltip.transition().duration(200).style("opacity", 0.95);
          tooltip.html(`
            <strong>Topic:</strong> ${d.label}<br/>
            <strong>Connections:</strong> ${connectionCount}</div>
            <div style="font-size: 12px; color: #999;">${d.id}</div>
          `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
  
          node.attr("fill-opacity", o => o.id === d.id || neighbors.has(o.id) ? 1 : 0.1);
          link.attr("stroke-opacity", l =>
            l.source === d.id || l.target === d.id ||
            l.source.id === d.id || l.target.id === d.id ? 0.7 : 0.05
          );
        })
        .on("mouseout", () => {
          tooltip.transition().duration(300).style("opacity", 0);
          node.attr("fill-opacity", 1);
          link.attr("stroke-opacity", 0.5);
        });
  
      // Labels
      svg.append("g")
        .selectAll("text")
        .data(filteredNodes)
        .enter().append("text")
        .text(d => d.id)
        .attr("x", d => d.x + 10)
        .attr("y", d => d.y + 4)
        .attr("font-size", "12px")
        .attr("fill", "#574237");
    }

    // Initial render
    updateGraph("all");

    // Hook dropdown
    d3.select("#topicFilter").on("change", function () {
      updateGraph(this.value);
    });
  });
  