//Receives the data to be used.
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => {
      const dataSet = data.data 
      const width = 1500
      const height = 400
      let barWidth = width / 400
  
      let years = dataSet.map(function(item) {
       return new Date(item[0])
      })
      
      let displayYears = dataSet.map(function(item) {
        let quarter
        let numberMonth = item[0].substring(5,7)
        
        if (numberMonth === '01') {
          quarter = '1st Quarter'
        } else if (numberMonth === '04') {
          quarter = '2nd Quarter'
        } else if (numberMonth === '07') {
          quarter = '3rd Quarter'
        } else if (numberMonth === '10') {
          quarter = '4th Quarter'
        }
        
        return quarter + ' ' + item[0].substring(0, 4)
      })
      
      let minDate = dataSet[0][0].substr(0, 4)
      minDate = new Date(minDate)
  
      let maxDate = dataSet[data.data.length - 1][0]
      maxDate = new Date(maxDate)
  
      let gdp = data.data.map(function(item) {
          return item[1]
      })
      
      let gdpMax = d3.max(dataSet, function(d) {
          return d[1]
      })
      
      let linearScale = d3.scaleLinear()
                          .domain([0, gdpMax])
                          .range([0, height]);

      let scaledGDP = gdp.map(function(item) {
          return linearScale(item)
      })
      
      let tooltip = d3.select("#chart")
                      .append("div")
                      .attr("id", "tooltip")
      
      let overlay = d3.select('.chart').append('div')
                      .attr('class', 'overlay')
                      
      let svg =  d3.select('#chart')
                   .append('svg')
                   .attr('width', width + 200)
                   .attr('height', height + 60)
      //Y-axis text
      svg.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('x', -300)
         .attr('y', 200)
         .text('Gross Domestic Product (Billions)')

     //Sets axis
     let xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width- 300])
  
     let yScale = d3.scaleLinear()
                    .domain([0, gdpMax])
                    .range([height, 0])
                    
     let xAxis = d3.axisBottom()
                   .scale(xScale)
     let yAxis = d3.axisLeft()
                   .scale(yScale)
     
     d3.selectAll("text").style("fill","white")     
  
     svg.append("g")
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(290, 440)')
        .attr("class", "axisWhite")
  
     svg.append("g")
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(290, 40)')
        .attr("class", "axisWhite")
  
     //Creates bars
     svg.selectAll("rect")
        .data(scaledGDP)
        .enter()
        .append("rect")
        .style('fill', 'green')
        .attr('data-date', function(d, i) {
           return data.data[i][0]
        })
        .attr('data-gdp', function(d, i) {
           return data.data[i][1]
        })
        .attr('class', 'bar')
        .attr('x', function(d, i) {
           return xScale(years[i])
        })
        .attr('y', function(d, i) {
           return height - d
        })
        .attr('width', barWidth)
        .attr('height', function(d) {
            return d
        })
        .attr('transform', 'translate(290, 40)')
  
        //Highlighted information
        .on('mouseover', function(d, i) {
          d3.select(this)
            .style("fill", "white")
          overlay.transition()
                 .duration(0)
          tooltip.transition()
                 .duration(200)
                 .style('opacity', .9)
          tooltip.html(displayYears[i] + '<br>' + '$' + gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                 .attr('data-date', data.data[i][0])
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY) + "px");
        })
        .on('mouseout', function(d) {
            d3.select(this)
              .style("fill", "green")
            tooltip.transition()
                   .duration(200)
                   .style('opacity', 0);
            overlay.transition()
                   .duration(200)
                   .style('opacity', 0);
        })
  })
