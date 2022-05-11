import * as d3 from 'd3';
import styled from 'styled-components';
import numeral from 'numeral';
import { useEffect, useRef } from 'react';

export default function ProfitChart({ data }) {
  const svgRef = useRef(null);
  const margin = { top: 0, bottom: 40, left: 70, right: 90 };
  const width = 650 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  useEffect(() => {
    // Removing bars, labels and line on load, so that you don't have multiple svg components stuck to the page
    d3.select(svgRef.current).selectAll('rect').remove();
    d3.select(svgRef.current).selectAll('.label').remove();
    d3.select(svgRef.current).selectAll('.line').remove();

    if (data) {
      // Finding miscCosts value
      let miscCosts = data[0].qNum;
      data.forEach((item, index) => {
        if (index > 0) {
          miscCosts = miscCosts - item.qNum;
        }
      });
      // Adding new value to qlik Data
      const newRow = [
        ...data.slice(0, 4),
        { qText: 'Misc Costs', qNum: miscCosts },
        ...data.slice(4, 5),
      ];

      // Transform data for easier charting (finding cumulative value)
      const cumulative = [0];

      newRow.reverse().forEach((item, index) => {
        if (index < 4) {
          cumulative.push(item.qNum + cumulative[cumulative.length - 1]);
        }
      });
      newRow.reverse();
      cumulative.push(0);

      // Define xScale and yScale
      // Extract data for xScale and yScale
      const xDomain = data.map((d) => d.qNum);
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(xDomain)])
        .range([0, width]);

      const yDomain = newRow.map((d) => d.qText);
      const yScale = d3
        .scaleBand()
        .domain(yDomain)
        .range([0, height])
        .padding(0.2);

      const xAxis = d3.axisBottom(xScale).tickValues([]).tickSize(0);
      const yAxis = d3.axisLeft(yScale).tickSize(0);

      // Calling xAxis and yAxis
      d3.select(svgRef.current)
        .select('.xAxis')
        .attr('transform', `translate(${margin.left},${height} )`)
        .call(xAxis);
      d3.select(svgRef.current)
        .select('.yAxis')
        .style('font', '14px times')
        .attr('transform', `translate(${margin.left}, 0 )`)
        .call(yAxis)
        .selectAll('.tick text')
        .call(wrap, yScale.bandwidth());

      // Define bars
      const bars = d3.select(svgRef.current).selectAll('rect').data(newRow);

      // Defining colorScale for bars
      const colorScale = d3
        .scaleOrdinal()
        .domain(xDomain)
        .range([
          '#eef4ff',
          '#c68447',
          '#c0b033',
          '#5433c0',
          '#55b055a8',
          '#d14d4d',
        ]);

      // Add bars
      bars
        .enter()
        .append('rect')
        .attr('transform', `translate(${margin.left}, ${margin.top} )`)
        .attr('fill', (d) => colorScale(d.qNum))
        .attr('height', yScale.bandwidth())
        .attr('y', (d, i) => yScale(yDomain[i]))
        .attr('x', (d, i) => {
          if (i > 0) {
            return xScale(cumulative[5 - i]);
          }
        })
        .attr('width', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('width', (d) => xScale(d.qNum));

      // Add text displaying the values inside each bar
      bars
        .enter()
        .append('text')
        .attr(
          'transform',
          `translate(${margin.left}, ${yScale.bandwidth() / 2 + 6} )`
        )
        // Format data
        .text((d) => numeral(d.qNum / 1000000).format('0,0') + 'm')
        .attr('x', (d, i) => {
          if (i < 1 || i > 3) {
            return xScale(cumulative[5 - i] + d.qNum / 2);
          } else {
            return xScale(cumulative[5 - i]) - 25;
          }
        })
        .attr('y', (d, i) => yScale(yDomain[i]))
        .style('fill', 'black')
        .style('font', '17px times');

      // Add lines connecting the bars for the waterfall chart
      bars
        .enter()
        .append('line')
        .attr('transform', `translate(${margin.left}, 0 )`)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('opacity', '0.6')
        .attr('stroke-dasharray', '4 2')
        .attr('x1', (d, i) => xScale(cumulative[5 - i]))
        .attr('y1', (d, i) => yScale(yDomain[i]) + yScale.bandwidth())
        .attr('x2', (d, i) => xScale(cumulative[5 - i]))
        .attr('y2', (d, i) => yScale(yDomain[i]) + yScale.bandwidth())
        .transition()
        .duration(500)
        .delay(800)
        .attr('y2', (d, i) => yScale(yDomain[i]) + yScale.step());

      // Add title for the chart
      d3.select(svgRef.current)
        .append('text')
        .text('Expenses and Revenue')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .attr('font-size', '1.5rem')
        .style('font', '25px times');
      // Function to wrap yAxis ticks labels
      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.3, // ems
            x = text.attr('x'),
            dy = parseFloat(text.attr('dy')),
            tspan = text
              .text(null)
              .append('tspan')
              .attr('x', x)
              .attr('y', 0)
              .attr('dy', dy + 'em');
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(' '));
              line = [word];
              tspan = text
                .append('tspan')
                .attr('x', x)
                .attr('y', 0)
                .attr('dy', `${++lineNumber * lineHeight + dy}em`)
                .text(word);
            }
          }
        });
      }
    }
  }, [data, height, margin.bottom, margin.left, margin.top, width]);

  return (
    <Section>
      <svg
        ref={svgRef}
        width={width + margin.right}
        height={height + margin.bottom}
      >
        <g className="yAxis" />
        <g className="xAxis" />
      </svg>
    </Section>
  );
}

const Section = styled.div`
  svg {
    padding: 20px;
  }
`;
