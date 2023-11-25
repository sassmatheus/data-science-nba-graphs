d3.csv("/data/nba_dados.csv").then(function(data) {

    var margin = { top: 20, right: 30, bottom: 60, left: 60 };
    var width =  1300 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right + 80)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // definicao de escalas x e y
    var xScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return +d.Salary; })])
                   .range([0, width]);
   
    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return +d.FG; })])
                   .range([height, 0]);

    // circurlos e demais atributos
    svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", function(d) { return xScale(+d.Salary); })
   .attr("cy", function(d) { return yScale(+d.FG); })
   .attr("r", 6)
   .attr("fill", "steelblue")
   .on("mouseover", function(d) { // hover
       d3.select(this)
           .attr("r", 7) // aumenta o tamanho
           .attr("fill", "orange"); // muda a cor

       // nome do jogador
       svg.append("text")
          .attr("x", xScale(+d.Salary) + 8)
          .attr("y", yScale(+d.FG) - 5) // ajuste na posição do nome
          .attr("class", "hover-label")
          .text(d["Player Name"]);

       // linhas pontilhadas para ligar o ponto ao eixo x e y
       var xValue = xScale(+d.Salary);
       var yValue = yScale(+d.FG);

       svg.append("line") //pontilhado eixo x
          .attr("x1", xValue)
          .attr("y1", yValue)
          .attr("x2", xValue)
          .attr("y2", height)
          .attr("stroke", "gray") // cor do pontilhado
          .attr("stroke-dasharray", "3,3") // estilo da linha: 3px on, 3px off
          .attr("class", "hover-line");

       svg.append("line") ///pontilhado eixo y
          .attr("x1", xValue)
          .attr("y1", yValue)
          .attr("x2", 0)
          .attr("y2", yValue)
          .attr("stroke", "gray") // cor do pontilhado
          .attr("stroke-dasharray", "3,3") // estilo da linha: 3px on, 3px off
          .attr("class", "hover-line");
       
   })
   .on("mouseout", function() { //mouse out
       // redefinição para o tamanho e cor originais
       d3.select(this)
           .attr("r", 6)
           .attr("fill", "steelblue");

       // remove o nome, pontilhado e os valores ao tirar o mouse
       svg.select(".hover-label").remove();
       svg.selectAll(".hover-line").remove();
       svg.selectAll(".hover-line-value").remove();
   });
   
   //////////////////////////////////////////////////////////

    // eixos x e y
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(xScale))
       .style("font-size", "20px");

    svg.append("g")
       .call(d3.axisLeft(yScale))
       .style("font-size", "20px");

    // Adicione rótulos
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", height + margin.top + 30)
       .attr("text-anchor", "middle")
       .text("Salário")
       .style("font-size", "20px");

    svg.append("text")
       .attr("x", -height / 2)
       .attr("y", -margin.left + 20)
       .attr("transform", "rotate(-90)")
       .attr("text-anchor", "middle")
       .text("Pontuação")
       .style("font-size", "20px");
});