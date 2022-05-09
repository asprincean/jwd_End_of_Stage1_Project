import * as d3 from 'd3';
import styled from 'styled-components';
import numeral from 'numeral';
import { useEffect, useRef } from 'react';

export default function WaterfallChart({ data }) {
  const svgRef = useRef(null);
  const margin = { top: 0, right: 30, bottom: 40, left: 40 };
  const width = 650 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  useEffect(() => {
    // Removing bars, labels and line on load, so that you don't have multiple svg components stuck to the page
    d3.select(svgRef.current).selectAll('rect').remove();
    d3.select(svgRef.current).selectAll('.label').remove();
    d3.select(svgRef.current).selectAll('.line').remove();

    // Transform data for easier charting (finding cumulative values and total)
    const cumulative = [0];

    data.forEach((item) =>
      cumulative.push(item[1].qNum + cumulative[cumulative.length - 1])
    );
    const total = cumulative[cumulative.length - 1];
    // Add a new raw to Data
    data.push([{ qText: 'Total' }, { qNum: total }]);

    // Define xScale and yScale
    // Extract data for xScale and yScale
    const xDomain = data.map((d) => d[1].qNum);
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(xDomain)])
      .range([0, width]);
    const yDomain = data.map((d) => d[0].qText);
    const yScale = d3
      .scaleBand()
      .domain(yDomain)
      .range([0, height])
      .padding(0.1);

    const xAxis = d3.axisBottom(xScale).tickValues([]).tickSize(0);
    const yAxis = d3.axisLeft(yScale).tickSize(0);
    // Call xAxis and yAxis
    d3.select(svgRef.current)
      .select('.xAxis')
      .attr('transform', `translate(${margin.left},${height} )`)
      .call(xAxis);
    d3.select(svgRef.current)
      .select('.yAxis')
      .style('font', '14px times')
      .attr('transform', `translate(${margin.left}, 0 )`)
      .call(yAxis);

    // Define bars
    const bars = d3.select(svgRef.current).selectAll('rect').data(data);

    // Defining colorScale for bars
    const colorScale = d3
      .scaleOrdinal()
      .domain(xDomain)
      .range(['#eef4ff', '#fdf4f5', '#fffce4', '#cbe3cba8']);

    // Add bars
    bars
      .enter()
      .append('rect')
      .attr('transform', `translate(${margin.left}, ${margin.top} )`)
      .style('fill', (data) => colorScale(data[1].qNum))
      .attr('height', yScale.bandwidth())
      .attr('y', (d) => yScale(d[0].qText))
      .attr('x', (d, i) => {
        if (d[0].qText !== 'Total') {
          return xScale(cumulative[i]);
        }
      })
      .attr('width', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('width', (d) => xScale(d[1].qNum));

    // Add text displaying the values inside each bar
    bars
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr(
        'transform',
        `translate(${margin.left - 20}, ${margin.bottom - 10} )`
      )
      // Format data
      .text((d) => numeral(d[1].qNum / 1000000).format('0,0') + 'm')
      .attr('x', (d, i) => {
        if (d[0].qText !== 'Total') {
          return xScale(cumulative[i] + d[1].qNum / 2);
        } else {
          return xScale(cumulative[4] / 2);
        }
      })
      .attr('y', (d) => yScale(d[0].qText))
      .style('fill', 'black')
      .style('font', '17px times');

    // Add lines to connect the bars
    bars
      .enter()
      .append('line')
      .attr('class', 'line')
      .attr('transform', `translate(${margin.left}, 0 )`)
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .attr('opacity', '0.6')
      .attr('stroke-dasharray', '4 2')
      .attr('x1', (d, i) => xScale(cumulative[i + 1]))
      .attr('y1', (d, i) => yScale(d[0].qText) + yScale.bandwidth())
      .attr('x2', (d, i) => xScale(cumulative[i + 1]))
      .attr('y2', (d) => yScale(d[0].qText) + yScale.bandwidth())
      .transition()
      .duration(500)
      .delay(800)
      .attr('y2', (d, i) => yScale(d[0].qText) + yScale.step());

    // Add title for the chart
    d3.select(svgRef.current)
      .append('text')
      .text('Breakdown Total Sales By Quarter')
      .attr('x', width / 3)
      .attr('y', height + margin.bottom - 10)
      .attr('font-size', '1.5rem')
      .style('font', '25px times');
  }, [
    data,
    height,
    margin.bottom,
    margin.left,
    margin.right,
    margin.top,
    width,
  ]);

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
