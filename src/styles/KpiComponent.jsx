import styled from 'styled-components';

export const Section = styled.div`
  justify-content: center;
  padding: 1rem 1rem 0rem 1rem;
  border-radius: 1rem;
  color: black;
  justify-content: space-evenly;
  font-size: 20px;
  height: 6rem;
  width: max-content;
  align-items: center;
  background-color: ${(props) => props.color};
  transition: 0.5s ease-in-out;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: #d4e0ff;
    color: black;
    cursor: pointer;
  }
  h5 {
    margin-bottom: 0;
    margin-top: 0;
  }
`;
export const Percent = styled.div`
  .percent {
    color: ${(props) => props.arrowcolor || 'grey'};
    display: flex;
    gap: 1rem;
  }
  display: flex;
  align-items: center;
  gap: 1rem;
`;

