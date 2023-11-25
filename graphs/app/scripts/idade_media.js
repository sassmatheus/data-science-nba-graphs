// Carregar dados do arquivo CSV
d3.csv("/data/nba_dados.csv").then(function(data) {

    var margin = { top: 20, right: 30, bottom: 60, left: 60 };
    var width = 1300 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right + 80)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Definição de escalas x e y
    var xScale = d3.scaleLinear()
    .domain([18, d3.max(data, function(d) { return +d.Age; })])
    .range([0, width]);
   
    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return +d.PTS; })])
                   .range([height, 0]);

    // Círculos e demais atributos
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d) { return xScale(+d.Age); })
       .attr("cy", function(d) { return yScale(+d.PTS); })
       .attr("r", 6)
       .attr("fill", "steelblue")
       .on("mouseover", function(d) {
           d3.select(this)
               .attr("r", 7)
               .attr("fill", "orange");

           svg.append("text")
              .attr("x", xScale(+d.Age) + 8)
              .attr("y", yScale(+d.PTS) - 5)
              .attr("class", "hover-label")
              .text(d["Player Name"]);

           var xValue = xScale(+d.Age);
           var yValue = yScale(+d.PTS);

           svg.append("line")
              .attr("x1", xValue)
              .attr("y1", yValue)
              .attr("x2", xValue)
              .attr("y2", height)
              .attr("stroke", "gray")
              .attr("stroke-dasharray", "3,3")
              .attr("class", "hover-line");

           svg.append("line")
              .attr("x1", xValue)
              .attr("y1", yValue)
              .attr("x2", 0)
              .attr("y2", yValue)
              .attr("stroke", "gray")
              .attr("stroke-dasharray", "3,3")
              .attr("class", "hover-line");
       })
       .on("mouseout", function() {
           d3.select(this)
               .attr("r", 6)
               .attr("fill", "steelblue");

           svg.select(".hover-label").remove();
           svg.selectAll(".hover-line").remove();
       });
   
   // Eixos x e y
   svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .style("font-size", "20px");

   svg.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size", "20px");

   // Adiciona rótulos
   svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 30)
      .attr("text-anchor", "middle")
      .text("Idade")
      .style("font-size", "20px");

   svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Média de Pontos")
      .style("font-size", "20px");
});
