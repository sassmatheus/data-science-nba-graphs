async function carregarDados() {
    
    const resposta = await d3.csv("/data/nba_dados.csv");

    
    const dados = resposta.map(d => ({
        "Player Name": d["Player Name"],
        "Salary": parseFloat(d["Salary"]),
        "Position": d["Position"],
        "PTS": parseFloat(d["PTS"]),
        "AST": parseFloat(d["AST"]),
        "TRB": parseFloat(d["TRB"]),
        "Team": d["Team"],
    }));

    gerarGraficos(dados);
    atualizarCardJogadores(dados);
    atualizarCardTotalSalaries(dados);
    atualizarCardAverageSalary(dados);
}

const traducaoPosicoes = {
    "PG": "Armador",
    "SG": "Ala-armador",
    "SF": "Ala",
    "PF": "Ala-pivô",
    "C": "Pivô",
};

// gráfico de pizza
function gerarGraficos(dados) {
    var larguraTotal = 1000;
    var altura = 500;
    var larguraPorGrafico = larguraTotal / 3;

    function gerarGrafico(svg, dadosPorPosicao, titulo) {
        var cores = d3.scaleOrdinal(d3.schemeCategory10);

        var pie = d3.pie()
            .value(d => d[1])
            .sort(null);

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(150);

        svg.selectAll("path")
            .data(pie([...dadosPorPosicao]))
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => cores(i));

        svg.selectAll("text")
            .data(pie([...dadosPorPosicao]))
            .enter().append("text")
            .attr("transform", d => "translate(" + arc.centroid(d) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => {
                const percentagem = (d.data[1] / d3.sum([...dadosPorPosicao.values()]) * 100);
                return percentagem > 0 ? percentagem.toFixed(1) + "%" : "";
            });

        return svg.append("text")
            .attr("x", 0)
            .attr("y", 180)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text(titulo);
    }

    var svgPontos = d3.select("#graficoPontos")
        .append("svg")
        .attr("width", larguraPorGrafico)
        .attr("height", altura)
        .append("g")
        .attr("transform", "translate(" + larguraPorGrafico / 2 + "," + altura / 2 + ")");
    var dadosPorPosicaoPontos = d3.rollup(dados, v => d3.sum(v, d => d.PTS), d => d.Position);
    gerarGrafico(svgPontos, dadosPorPosicaoPontos, "Pontos");

    var svgAssistencias = d3.select("#graficoAssistencias")
        .append("svg")
        .attr("width", larguraPorGrafico)
        .attr("height", altura)
        .append("g")
        .attr("transform", "translate(" + larguraPorGrafico / 2 + "," + altura / 2 + ")");
    var dadosPorPosicaoAssistencias = d3.rollup(dados, v => d3.sum(v, d => d.AST), d => d.Position);
    gerarGrafico(svgAssistencias, dadosPorPosicaoAssistencias, "Assistências");

    var svgRebotes = d3.select("#graficoRebotes")
        .append("svg")
        .attr("width", larguraPorGrafico)
        .attr("height", altura)
        .append("g")
        .attr("transform", "translate(" + larguraPorGrafico / 2 + "," + altura / 2 + ")");
    var dadosPorPosicaoRebotes = d3.rollup(dados, v => d3.sum(v, d => d.TRB), d => d.Position);
    gerarGrafico(svgRebotes, dadosPorPosicaoRebotes, "Rebotes");
}


function atualizarCardJogadores(dados) {
    var cardPlayers = d3.select("#cardPlayers");
    cardPlayers.html("<h3>Jogadores no Dataset</h3><p style='font-size: 18px'>Quantidade: " + (dados.length - 2) + "</p>");
}

function atualizarCardTotalSalaries(dados) {
    var totalSalaries = d3.sum(dados, d => d.Salary);

    var formattedTotalSalaries = totalSalaries.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    var cardTotalSalaries = d3.select("#cardTotalSalaries");
    cardTotalSalaries.html("<h3>Total de Salários</h3><p style='font-size: 18px'>" + formattedTotalSalaries + "</p>");
}

function atualizarCardAverageSalary(dados) {
    var averageSalary = d3.mean(dados, d => d.Salary);

    var formattedAverageSalary = averageSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    var cardAverageSalary = d3.select("#cardAverageSalary");
    cardAverageSalary.html("<h3>Média Salarial</h3><p style='font-size: 18px'>" + formattedAverageSalary + "</p>");
}

function atualizarCardMVP(dados) {
    var mvp = dados.reduce((current) => (current.PTS + current.TRB + current.AST + current.STL + current.BLK) / 5);
    var cardMVP = d3.select("#cardMVP");
    cardMVP.html("<h3>MVP</h3><p>Jogador: " + mvp["Player Name"] + "<br>Média: " + ((mvp.PTS + mvp.TRB + mvp.AST + mvp.STL + mvp.BLK) / 5).toFixed(2) + "</p>");
}

// Carregar os dados e iniciar o dashboard
carregarDados();
