d3.csv("data/ARE_Spot_Prices.csv", d => ({
  year: +d["Year"],
  averagePrice: +d["Average Price (notTas-Snowy)"]
})).then(data => {
  console.log(data);
  drawLineChart(data);
});

const drawLineChart = data => {
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .range([innerHeight, 0])
    .nice();

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  innerChart.append("g").call(d3.axisLeft(yScale));

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  innerChart.append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "#d2691e")
    .attr("stroke-width", 2);

  innerChart.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.averagePrice))
    .attr("r", 3)
    .attr("fill", "#d2691e");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left)
    .attr("y", 22)
    .text("Average price ($ per MWh)");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 12)
    .attr("text-anchor", "middle")
    .text("Year");
};
