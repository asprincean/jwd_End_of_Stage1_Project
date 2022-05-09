import styled from 'styled-components';

export const Table = styled.table`
  margin-top: 10px;
  border: none;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  tbody {
    overflow-y: scroll;
    position: absolute;
    height: 430px;
    width: 100%;
    tr {
      display: table;
      table-layout: fixed;
      width: 100%;
      transition: 0.5s ease-in-out;
      text-align: center;
      :nth-of-type(2n + 1) {
        background-color: #fffce4;
      }
      :hover {
        background-color: #d4e0ff;
        cursor: pointer;
      }
    }
  }
  td,
  th {
    border: none;
    padding: 5px 10px;
  }
  td {
    padding: 5px 10px;
  }
  thead {
    font-size: 0.9em;
    tr {
      background-color: #eef4ff;
    }
  }
`;
