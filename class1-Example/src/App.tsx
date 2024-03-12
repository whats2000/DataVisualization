import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const App: React.FC = () => {
  const d3Container = useRef<HTMLDivElement | null>(null);
  const [color, setColor] = React.useState([255, 0, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      setColor([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    }, 1000)
    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    d3.csv(
      'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv',
    )
      .then((data) => {
        // Clear the container
        d3.select(d3Container.current).selectAll('*').remove();

        const margin = { top: 30, right: 30, bottom: 70, left: 60 },
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

        const svg = d3
          .select(d3Container.current)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const x = d3
          .scaleBand()
          .range([0, width])
          .domain(data.map((d) => d.Country))
          .padding(0.2);

        svg
          .append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x))
          .selectAll('text')
          .attr('transform', 'translate(-10,0) rotate(-45)')
          .style('text-anchor', 'end');

        const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);

        svg.append('g').call(d3.axisLeft(y));

        svg
          .selectAll('bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', (d) => x(d.Country)!)
          .attr('y', (d) => y(Number(d.Value)))
          .attr('width', x.bandwidth())
          .attr('height', (d) => height - y(Number(d.Value)))
          .attr('fill', `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      })
      .catch((error) => {
        console.error('Error loading the data', error);
      });
  }, [color]);

  return (
    <div>
      <h1>D3 Chart</h1>
      <div ref={d3Container}></div>
    </div>
  );
};

export default App;
