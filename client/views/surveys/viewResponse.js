Template.chart.onRendered(function () {
  var data = [], r = 130, color, canvas, group, arc, pie, arcs;
  Template.currentData().options.forEach(function (option) {
    data.push(option.responses ? option.responses : 0);
  });

  color = d3.scale.ordinal()
    .range(["red", "blue", "orange", "yellow"]);

  canvas = d3.select(this.$(".pie-chart")[0]).append("svg")
    .attr("width", 300)
    .attr("height", 300);

  group = canvas.append("g")
    .attr("transform", "translate(150, 150)");

  arc = d3.svg.arc()
    .innerRadius(50)
    .outerRadius(r);

  pie = d3.layout.pie()
    .value(function (d) { return d; });

  arcs = group.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", function (d, i) { return color(i); });

  arcs.append("text")
    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("text-anchor", "middle")
    .attr("font-size", "1.5em")
    .text(function (d) { if (d.data) { return d.data } });
});

Template.viewResponse.helpers({
  percentage: function () {
    return (Math.floor((this.responses / Template.parentData().responses) * 10000) / 100);
  }
});
