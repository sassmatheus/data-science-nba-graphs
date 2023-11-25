// Importe os dados do seu arquivo CSV
d3.csv("/data/nba_dados.csv").then(function(data) {
    var numPlayersPerPage = 10; // Jogadores por pagina
    var maxColumnValue = 0; // Valor max inicial
    var selectedColumn = "Salary"; // Coluna inicial

    // SVG para o grafico
    var margin = { top: 20, right: 180, bottom: 60, left: 120 };
    var width = 1200 - margin.left - margin.right + 200;
    var height = 600 - margin.top - margin.bottom;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Definicao de escalas e criacao de barras
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleBand().range([0, height]).padding(0.1);
    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Criando o gráfico com base na página e coluna selecionadas
    function createBarChart(page) {
        // Classifique os dados com base na coluna selecionada em ordem decrescente
        data.sort(function(a, b) {
            return d3.descending(+a[selectedColumn], +b[selectedColumn]);
        });

        // Calculando o índice inicial e final para os jogadores na página
        var startIndex = (page - 1) * numPlayersPerPage;
        var endIndex = startIndex + numPlayersPerPage;
        var playersOnPage = data.slice(startIndex, endIndex);

        // Atualizando barras e labels
        var bars = svg.selectAll(".player-bar").data(playersOnPage, function(d) { return d["Player Name"]; });

        // Removendo as barras antigas
        bars.exit().remove();

        // Atualização das escalas de banda para o domínio específico da página
        yScale.domain(playersOnPage.map(function(d) { return d["Player Name"]; }));

        // Pegando o valor máximo da coluna selecionada na página 1, para manter em todas as páginas
        if (page === 1) {
            maxColumnValue = d3.max(data, function(d) { return +d[selectedColumn]; });
        }

        // Barras atualizadas com base no valor máximo da página 1
        xScale.domain([0, maxColumnValue]);

        svg.select(".x-axis").call(xAxis);

        // Criação as barras e as labels
        var barGroups = bars.enter()
            .append("g")
            .attr("class", "player-bar")
            .merge(bars)
            .attr("transform", function(d) {
                return "translate(0," + yScale(d["Player Name"]) + ")";
            });

        barGroups.append("rect")
            .attr("x", 0)
            .attr("width", function(d) { return xScale(+d[selectedColumn]); })
            .attr("height", yScale.bandwidth())
            .attr("fill", "steelblue");

        barGroups.append("text")
            .attr("class", "player-name")
            .attr("x", function(d) { return xScale(+d[selectedColumn]) + 8; })
            .attr("y", yScale.bandwidth() / 2)
            .text(function(d) { return d["Player Name"]; });

        barGroups.append("text")
            .attr("class", "player-rank")
            .attr("x", -5)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "end")
            .text(function(d, i) { return "#" + (i + startIndex + 1); });
    }

    // Chamada da função sempre na página 1;
    createBarChart(1);

    // Adicione ouvintes de eventos para os campos input e select
    d3.select("#numPages").on("input", function() {
        var page = +this.value;
        createBarChart(page);
    });

    function resetChart() {
        d3.select("#numPages").property("value", 1);
        var page = 1;
        selectedColumn = d3.select("#dataColumn").node().value;
        createBarChart(page);
        svg.selectAll(".player-bar").remove();
        svg.selectAll(".player-name").remove();
        svg.selectAll(".player-rank").remove();
    }

    d3.select("#dataColumn").on("change", function() {
        resetChart();
        d3.select("#numPages").property("value", 1);
        var page = 1;
        selectedColumn = this.value;
        createBarChart(page);
    });

});