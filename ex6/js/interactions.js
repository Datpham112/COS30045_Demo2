const populateFilters = (data) => {
  const updateCharts = (filterId) => {
    const updatedData = filterId === "all"
      ? data
      : data.filter(tv => tv.screenTech === filterId);

    const updatedBins = binGenerator(updatedData);

    innerChart.selectAll(".bar")
      .data(updatedBins)
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("y", d => yScale(d.length))
      .attr("height", d => innerHeight - yScale(d.length));

    innerChartS.selectAll("circle")
      .transition()
      .duration(500)
      .attr("opacity", d => filterId === "all" || d.screenTech === filterId ? 0.5 : 0)
      .attr("pointer-events", d => filterId === "all" || d.screenTech === filterId ? "all" : "none");
  };

  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
    .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
    .text(d => d.label)
    .on("click", (e, d) => {
      console.log("Clicked filter data:", d);
      if (!d.isActive) {
        filters_screen.forEach(filter => {
          filter.isActive = d.id === filter.id;
        });
        d3.selectAll("#filters_screen .filter")
          .classed("active", filter => filter.id === d.id);
        updateCharts(d.id);
      }
    });
};

const createTooltip = () => {
  const tooltip = innerChartS.append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);

  tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.85);

  ["brand", "model", "size"].forEach((name, i) => {
    tooltip.append("text")
      .attr("class", `tip-${name}`)
      .attr("x", tooltipWidth / 2)
      .attr("y", 14 + i * 16)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text("NA");
  });
};

const handleMouseEvents = () => {
  innerChartS.selectAll("circle")
    .on("mouseenter", (e, d) => {
      d3.select(".tip-brand").text(d.brand);
      d3.select(".tip-model").text(d.model);
      d3.select(".tip-size").text(`${d.screenSize}" · ${d.screenTech}`);

      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");
      const tx = Math.min(Math.max(cx - 0.5 * tooltipWidth, 0), innerWidth - tooltipWidth);
      const ty = cy - tooltipHeight - 10 < 0 ? cy + 12 : cy - tooltipHeight - 10;

      d3.select(".tooltip")
        .attr("transform", `translate(${tx}, ${ty})`)
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseleave", () => {
      d3.select(".tooltip")
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};

const createHistogramTooltip = () => {
  const tooltip = innerChart.append("g")
    .attr("class", "tooltip-h")
    .style("opacity", 0);

  tooltip.append("rect")
    .attr("width", tooltipWidthH)
    .attr("height", tooltipHeightH)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", tooltipColorH)
    .attr("fill-opacity", 0.9);

  ["range", "count"].forEach((name, i) => {
    tooltip.append("text")
      .attr("class", `tip-h-${name}`)
      .attr("x", tooltipWidthH / 2)
      .attr("y", 14 + i * 18)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text("NA");
  });
};

const handleHistogramMouseEvents = () => {
  innerChart.selectAll(".bar")
    .on("mouseenter", (e, d) => {
      d3.select(e.currentTarget).attr("fill", barHoverColor);
      d3.select(".tip-h-range").text(`${d.x0} to ${d.x1} kWh/year`);
      d3.select(".tip-h-count").text(`${d3.format(",")(d.length)} TVs`);

      const barCentre = xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2;
      const tx = Math.min(Math.max(barCentre - tooltipWidthH / 2, 0), innerWidth - tooltipWidthH);
      const ty = Math.max(yScale(d.length) - tooltipHeightH - 8, 0);

      d3.select(".tooltip-h")
        .attr("transform", `translate(${tx}, ${ty})`)
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseleave", (e) => {
      d3.select(e.currentTarget).attr("fill", barColor);
      d3.select(".tooltip-h")
        .interrupt()
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};