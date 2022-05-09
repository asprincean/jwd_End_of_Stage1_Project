import styled from 'styled-components';
import {
  profitChart,
  quarterChart,
} from '../components/profitChart/toggleButton';

export const Toggle = styled.div`
  width: 74px;
  height: 20px;
  border-radius: 30px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  background-color: ${(props) =>
    props.chart === profitChart ? '#d4e0ff' : '#f4e680'};
  transition: background-color 500ms linear;
  &:before {
    content: '${(props) => (props.chart === quarterChart ? ' Q ' : ' P ')}';
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    margin: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: ${(props) => (props.chart === profitChart ? '51px' : '0')};
    transition: left 500ms linear;
  }
`;

export const ToggleWrapper = styled.div`
  margin: 10px 0 0 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  transition: 0.5s ease-in-out;
`;

export const ToggleContainer = styled.span`
  position: relative;
  display: inline-flex;
  float: right;
  margin: 10px 10px 0 10px;
`;
