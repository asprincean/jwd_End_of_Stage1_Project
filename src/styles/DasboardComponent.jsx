import styled from 'styled-components';

export const Section = styled.div`
  margin-left: 1vw;
  padding: 1rem;
  height: 100%;
  .grid {
    float: left;
    display: flex;
    column-gap: 1rem;
  }
  @media (min-width: 768px) {
    .grid {
      width: 70%;
      margin-bottom: 15px;
    }
  }
  .grid2 {
    display: inline-block;
    position: relative;
    width: 100%;
    min-height: 450px;
  }
  @media (min-width: 768px) {
    .grid2 {
      float: left;
      left: 0;
      top: 0;
      height: 100%;
      width: 50%;
    }
  }
  .grid3 {
    display: inline-block;
    position: relative;
    width: 100%;
    min-height: 450px;
  }
  @media (min-width: 768px) {
    .grid3 {
      float: right;
      right: 0;
      top: 0;
      height: 100%;
      width: 50%;
    }
  }
`;
