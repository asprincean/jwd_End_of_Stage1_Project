import { Table } from '../styles/TableComponent';
import { useTable } from '../hooks/TableContext';

export default function TableSales() {
  const tableData = useTable();
  // Define keys
  const keys = ['repName', 'revenue', 'sales', 'profit'];
  return (
    <Table>
      <thead>
        <tr>
          <th>Sales Rep Name</th>
          <th>Total Revenue (£)</th>
          <th>Total Number of Sales</th>
          <th>Margin (£)</th>
        </tr>
      </thead>
      <tbody>
        {tableData?.map((row) => (
          <tr key={Math.random().toString(36)}>
            {keys?.map((key) => (
              <td key={Math.random().toString(36)}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
