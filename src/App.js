import React, { useEffect,Fragment } from "react";
import numberMessages from './numberMessages'
import * as d3 from "d3";
import { tip as d3tip } from "d3-v6-tip";


const App = () => {

  useEffect(() => {
    const height = 300;
    const width = 500;
    const margin = { top: 45, right: 10, bottom: 80, left: 50 };

    const mapped_data = Object.entries(numberMessages)
      .map((d) => {
        return {
          date: new Date(d[0]),
          number: d[1].length
        };
      });

    const data = mapped_data
      .sort((a, b) => a.date - b.date);

    console.log(data);

    const svg = d3
      .select("#area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //title chart
    svg.append("text")
      .attr("y", 0 - (margin.top / 2))
      .style("font-size", "16px")
      .style( "font-weight", "500")
      .style("color", "#23373e")
      .style("font-family", "Roboto")
      .text("Messages Timeline Distribution");

    const domain = d3.extent(data.map(e => {
      return e.date;
    }));
    //aixo aniria dins el domaim per veure extreme right demo
    //[d3.timeYear.floor(domain[0]), d3.timeYear.ceil(domain[1])]
    const xScale = d3.scaleTime()
      .domain(domain)
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => {
        return +d.number;
      })])
      .range([height, 0]);

    const make_x_gridlines = () => {
      return d3.axisBottom(xScale)
        .ticks(5);
    };

    const make_y_gridlines = () => {
      return d3.axisLeft(yScale)
        .ticks(5);
    };

    const yaxis = d3.axisLeft()
      .scale(yScale);
    svg.append("g")
      .attr("class", "yaxis")
      .call(yaxis);

    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeMonth.every(3));
    svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "12px")
      .attr("y", "5")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-60)");

    // add the X gridlines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
      );

    // add the Y gridlines
    svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      );


    //tooltip
    const tip = d3tip()
      .attr('class', 'd3-tip')
      .html(function(event ,d){
        console.log(event)
        console.log(d[0].number)

       return d[0].number

        //let result = Object.keys(d).map((key) => [Number(key), d[key]]);
        //console.log(result.map(r => r[1].number))

      });

    svg.call(tip);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#168cb6")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((value,index) => {
          return xScale(value.date);
        })
        .y((value,index) => {
          return yScale(value.number);
        })
        .curve(d3.curveBasis))
      .on('mouseenter', tip.show)
      .on('mouseleave', tip.hide)
      .on('click', function(d, i){
        console.log('Hello from click event')
        console.log("You clicked", d, i);
      })
  });

  return (
    <Fragment>
      <svg className="svg" id="area" height={400} width={600}></svg>
    </Fragment>

  );

};

export default App;

