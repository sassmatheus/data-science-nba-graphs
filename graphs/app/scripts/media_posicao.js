// Carregar dados do arquivo CSV
d3.csv("/data/nba_dados.csv").then(function(data) {

    // Tamanho do gráfico
    const width = 800;
    const height = 500;

    // Margens
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Largura e altura efetiva
    const effectiveWidth = width - margin.left - margin.right;
    const effectiveHeight = height - margin.top - margin.bottom;

    // Criação da área do SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escala para eixo X (posição)
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Position))
        .range([0, effectiveWidth])
        .padding(0.1);

    // Escala para eixo Y (média de pontos)
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.PTS)]) // Converte para número
        .range([effectiveHeight, 0]);

    // Adiciona eixo X
    svg.append("g")
        .attr("transform", `translate(0,${effectiveHeight})`)
        .call(d3.axisBottom(xScale));

    // Adiciona eixo Y
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Adiciona as barras
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Position))
        .attr("y", d => yScale(+d.PTS)) // Converte para número
        .attr("width", xScale.bandwidth())
        .attr("height", d => effectiveHeight - yScale(+d.PTS)); // Converte para número
});
