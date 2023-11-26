var margin = { top: 20, right: 0, bottom: 70, left: 100 };
    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
    var barWidth = 40;

    var locale = d3.formatLocale({
        decimal: ".",
        thousands: ",",
        grouping: [3]
    });

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("/data/nba_dados.csv").then(function(dataset) {
        dataset.sort((a, b) => b.Salary - a.Salary);

        var totalSalary = 0;
        var playersCount = 0;
        var targetSalary = 1000000000; 
        var dataPoints = [];

        dataset.forEach((player, index) => {
            totalSalary += +player.Salary;
            playersCount++;

            if (totalSalary >= targetSalary) {
                dataPoints.push({ playersCount: playersCount, totalSalary: totalSalary });
                totalSalary = 0;
                playersCount = 0;
            }
        });

        if (totalSalary > 0) {
            dataPoints.push({ playersCount: playersCount, totalSalary: totalSalary });
        }

        // Escalas
        var xScale = d3.scaleBand()
            .domain(dataPoints.map(d => d.totalSalary))
            .range([0, width])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataPoints, d => d.playersCount)])
            .range([height, 0]);

        svg.selectAll("rect")
            .data(dataPoints)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.totalSalary))
            .attr("y", d => yScale(d.playersCount))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.playersCount))
            .attr("fill", "steelblue");

        // rótulos das barras
        svg.selectAll("text.bar-label")
            .data(dataPoints)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .text(d => d.playersCount)
            .attr("x", d => xScale(d.totalSalary) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.playersCount) - 5)
            .attr("text-anchor", "middle")
            .attr("fill", "white");

        // rótulos no topo das barras
        svg.selectAll("text.top-label")
            .data(dataPoints)
            .enter()
            .append("text")
            .attr("class", "top-label")
            .text(d => d.playersCount)
            .attr("x", d => xScale(d.totalSalary) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.playersCount) - 7)
            .attr("text-anchor", "middle")
            .attr("fill", "black");

        // Eixo X
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale)
                .tickFormat(locale.format("$,"))
                .tickValues(xScale.domain().filter((d, i) => i % 1 === 0)))
            .style("font-size", "18px");

        // Eixo Y
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .style("font-size", "18px");;

        // rótulo de eixo y
        svg.append("text")
            .text("Número de Jogadores")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 40)
            .attr("text-anchor", "middle")
            .style("font-size", "20px");;

        // rótulo de eixo x
        svg.append("text")
            .text("Concentração de Salários")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "20px");;
    });
