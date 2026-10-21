d3.csv("data/screensize_category.csv", d => ({
  Screensize_Category: d.Screensize_Category,
  Count: +d.Count
})).then(data => {
  console.log(data);
  drawDonutChart(data);
});

const drawDonutChart = data => {
  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;
  const total = d3.sum(data, d => d.Count);

  const sizeColors = { Small: "#ffc97f", Medium: "#d2691e", Large: "#a8541a" };
  const color = d3.scaleOrdinal()
    .domain(Object.keys(sizeColors))
    .range(Object.values(sizeColors));

  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius);

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${width / 2 - 120}, ${height / 2})`);

  innerChart.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", d => color(d.data.Screensize_Category))
    .attr("stroke", "#fffaf0")
    .attr("stroke-width", 2);

  innerChart.selectAll(".slice-label")
    .data(pie(data))
    .join("text")
    .attr("class", "slice-label")
    .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
    .attr("text-anchor", "middle")
    .style("fill", d => d3.hsl(color(d.data.Screensize_Category)).l > 0.7 ? "#5c3a21" : "#ffffff")
    .text(d => d3.format(".0%")(d.data.Count / total));

  innerChart.append("text")
    .attr("text-anchor", "middle")
    .attr("y", -4)
    .style("font-size", "28px")
    .text(d3.format(",")(total));

  innerChart.append("text")
    .attr("text-anchor", "middle")
    .attr("y", 22)
    .text("TVs in total");

  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 270}, ${height / 2 - 50})`);

  data.forEach((d, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 34})`);

    row.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("y", -9)
      .attr("fill", color(d.Screensize_Category));

    row.append("text")
      .attr("x", 28)
      .text(`${d.Screensize_Category}: ${d3.format(",")(d.Count)}`);
  });
};
