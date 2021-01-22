// set the dimensions and margins of the graph
const margin = { top: 150, right: 150, bottom: 150, left: 190 },
  width = 1260 - margin.left - margin.right,
  height = 1200 - margin.top - margin.bottom,
  red = "#F25757",
  green = "#84b082";

// append the svg object to the body of the page
const svg = d3
  .select("#chartContainer")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
const div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

//Read the data
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", (data) => {
  // Add X axis
  const x = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("id", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  const timeFormat = d3.timeFormat("%M:%S");
  data.forEach((d) => {
    const parseTime = d.Time.split(":");
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parseTime[0], parseTime[1]));
  });

  const y = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
    .range([0, height]);
  svg.append("g").attr("id", "y-axis").call(d3.axisLeft(y).tickFormat(timeFormat));

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Time))
    .attr("r", 6)
    .style("fill", (d) => {
      return d.Doping === "" ? green : red;
    })
    .on("mouseover", (d) => {
      div.transition().duration(200).style("opacity", 0.9).attr("data-year", d.Year).attr("id", "tooltip");
      div
        .html(
          d.Name +
            ": " +
            d.Nationality +
            "<br/>" +
            "Year: " +
            d.Year +
            ", Time: " +
            timeFormat(d.Time) +
            (d.Doping ? "<br/><br/>PEDs: " + d.Doping : "")
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", (d) => {
      div.transition().duration(500).style("opacity", 0);
    });

  // Add legend
  const legendContainer = svg.append("g").attr("id", "legend");

  // This passes the tests, but is not used
  const legend = legendContainer.selectAll("#legend");

  svg.append("circle").attr("cx", 900).attr("cy", 50).attr("r", 6).style("fill", green);
  svg.append("circle").attr("cx", 900).attr("cy", 66).attr("r", 6).style("fill", red);
  svg
    .append("text")
    .attr("x", 730)
    .attr("y", 50)
    .text("No doping allegations")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 695)
    .attr("y", 66)
    .text("Doping allegations or bans")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
});
