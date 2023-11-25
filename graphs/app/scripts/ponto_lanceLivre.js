// Carregar dados do arquivo CSV
d3.csv("/data/nba_dados.csv").then(function(data) {

    // Calcular percentual de pontos a partir de lances livres
    data.forEach(function(d) {
        d.FTPercentage = (+d.FT / +d.PTS) * 100;
    });

    // Ordenar os dados pelos salários em ordem decrescente
    data.sort(function(a, b) {
        return b.Salary - a.Salary;
    });

    // Limitar a exibição a apenas os 10 primeiros jogadores
    var slicedData = data.slice(0, 10);

    // Tamanho do gráfico
    var width = 950;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    // Criação da área do SVG
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Definição da função de pizza
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.FTPercentage; });

    // Definição da função de arco
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    // Mapeamento de cores para cada jogador
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Adiciona os setores
    var paths = svg.selectAll("path")
        .data(pie(slicedData))
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return colorScale(d.data["Player Name"]); });


    // Adiciona legenda
    var legend = svg.selectAll(".legend")
        .data(slicedData.map(function(d) { return d["Player Name"]; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width / 2 - 250) + "," + (i * 20 - height / 4) + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return colorScale(d); });

    legend.append("text")
        .attr("x", 25)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    // Adiciona dica de ferramenta para mostrar o percentual
    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    paths.on("mouseover", function(d) {
        var percent = d3.format(".1f")(d.data.FTPercentage);
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d.data["Player Name"] + "<br>" + percent + "%")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

});
