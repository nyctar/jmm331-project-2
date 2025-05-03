function loadScript(path) {
    d3.select("#wordCloud").selectAll("*").remove();
    d3.selectAll("script.dynamic-script").remove();
  
    const script = document.createElement("script");
    script.src = path;
    script.className = "dynamic-script";
    document.body.appendChild(script);
  }
  
  document.getElementById("sentimentToggle").addEventListener("change", function () {
    const path = this.checked ? "word-cloud-sentiment.js" : "word-cloud-all.js";
    loadScript(path);
  });
  
  loadScript("word-cloud-all.js");  