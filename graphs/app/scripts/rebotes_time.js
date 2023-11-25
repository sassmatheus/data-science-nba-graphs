// Carregar dados do arquivo CSV
d3.csv("/data/nba_dados.csv").then(function(data) {

    // Agrupar os dados por time e calcular o total de rebotes para cada time
    var teamRebounds = d3.nest()
        .key(function(d) { return d.Team; })
        .rollup(function(v) { return d3.sum(v, function(d) { return +d.TRB; }); })
        .entries(data);

    // Ordenar os dados pelo total de rebotes em ordem decrescente
    teamRebounds.sort(function(a, b) {
        return b.value - a.value;
    });

    // Limitar a exibição aos 20 primeiros times
    var top20Teams = teamRebounds.slice(0, 20);

    // Tamanho do gráfico
    var margin = { top: 50, right: 20, bottom: 30, left: 120 };
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // Escala para o eixo X (total de rebotes)
    var xScale = d3.scaleLinear()
        .domain([0, 70]) // ajuste a escala para ir até 70
        .range([0, width]);

    // Escala para o eixo Y (times)
    var yScale = d3.scaleBand()
        .domain(top20Teams.map(function(d) { return d.key; }))
        .range([0, height])
        .padding(0.1);

    // Criação da área do SVG
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Adiciona as barras horizontais
    svg.selectAll("rect")
        .data(top20Teams)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", function(d) { return yScale(d.key); })
        .attr("width", function(d) { return xScale(d.value); })
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .on("mouseover", function(d) {
            // Exibe o nome do time ao passar o mouse sobre a barra
            d3.select("#tooltip")
                .style("opacity", 1)
                .html("<strong>" + d.key + "</strong>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            // Esconde o tooltip ao tirar o mouse da barra
            d3.select("#tooltip").style("opacity", 0);
        });

    // Adiciona rótulos às barras
    svg.selectAll("text")
        .data(top20Teams)
        .enter().append("text")
        .text(function(d) { return d.value.toFixed(1); }) // Exibe apenas o primeiro dígito após a vírgula
        .attr("x", function(d) { return xScale(d.value) + 5; })
        .attr("y", function(d) { return yScale(d.key) + yScale.bandwidth() / 2; })
        .attr("dy", ".35em")
        .attr("fill", "black");

    // Adiciona eixo X
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Adiciona tooltip
    d3.select("#chart")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
});
