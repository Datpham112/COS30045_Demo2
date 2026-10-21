d3.csv("data/data_55in.csv", d => ({
  Screen_Tech: d.Screen_Tech,
  Energy_Consumption: +d.Energy_Consumption
})).then(data => {
  console.log(data);
  data.sort((a, b) => b.Energy_Consumption - a.Energy_Consumption);
  drawBarChart(data);
});

const drawBarChart = data => {
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Screen_Tech))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Energy_Consumption)])
    .range([innerHeight, 0])
    .nice();

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale));

  innerChart.append("g").call(d3.axisLeft(yScale));

  innerChart.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.Screen_Tech))
    .attr("y", d => yScale(d.Energy_Consumption))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
    .attr("fill", "#d2691e");

  innerChart.selectAll(".value-label")
    .data(data)
    .join("text")
    .attr("class", "value-label")
    .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.Energy_Consumption) - 6)
    .text(d => d3.format(".0f")(d.Energy_Consumption));

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left)
    .attr("y", 22)
    .text("Energy consumption (kWh per year)");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 12)
    .attr("text-anchor", "middle")
    .text("Screen technology");
};
