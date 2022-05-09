import { useState } from 'react';
import DataChart from './../quarterChart/dataChart';
import ProfitData from './profitData';
import {
  Toggle,
  ToggleContainer,
  ToggleWrapper,
} from '../../styles/ToggleComponent';

export const quarterChart = 'Quarter';
export const profitChart = 'Profit';

export default function ToggleButton({ qlikApp }) {
  const [chart, setChart] = useState(quarterChart);
  // Set up function to switch between two charts
  const chartToggle = () => {
    chart === quarterChart ? setChart(profitChart) : setChart(quarterChart);
  };

  return (
    <div>
      <ToggleWrapper>
        <ToggleContainer>
          Quarters
          <Toggle chart={chart} onClick={chartToggle} />
          Profit Analysis
        </ToggleContainer>
        {chart === quarterChart && (
          <DataChart qlikApp={qlikApp} objectId="GwVmqW" />
        )}
        {chart === profitChart && (
          <ProfitData qlikApp={qlikApp} objectId="hXvWVKP" />
        )}
      </ToggleWrapper>
    </div>
  );
}
