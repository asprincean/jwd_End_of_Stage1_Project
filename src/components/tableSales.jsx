import { useEffect, useState } from 'react';
import { Table } from '../styles/TableComponent';
import numeral from 'numeral';

export default function TableSales({ qlikApp, objectId }) {
  // Define states
  const [kpiObject, setKpiObject] = useState();

  // Get the kpiObject, using the props provided and set to state
  useEffect(() => {
    // Get the kpiObject, which is an instance of a qlik object & set to state
    const getSetObjectDetails = async () => {
      // Get the specified object from the instance of the specific app
      const qObject = await qlikApp.getObject(objectId);
      setKpiObject(qObject);
      // console.log('qObject', qObject);
    };
    // Only call the getSetObject when: kpiObject doesn't exist, qlikApp does exist and objectId does exist
    if (!kpiObject && qlikApp && objectId) {
      getSetObjectDetails();
    }
  }, [kpiObject, qlikApp, objectId]);

  // Get the relevant kpiData from the layout of the kpiObject and set to state
  const [kpiData, setKpiData] = useState(undefined);
  useEffect(() => {
    const getKpiData = async () => {
      const layout1 = await kpiObject.getLayout();
      const qPath = '/qHyperCubeDef';
      const qPages = [
        {
          qLeft: 0,
          qTop: 0,
          qWidth: layout1.qHyperCube.qSize.qcx, // layoutObject['qHyperCube']['qSize']['qcx']
          qHeight: layout1.qHyperCube.qSize.qcy, // layoutObject['qHyperCube']['qSize']['qcy']
        },
      ];
      const layout = await kpiObject.getHyperCubeData(qPath, qPages);

      // Extract table data
      const { qMatrix } = layout[0];
      // Make e new array that will store totals
      const table = [];
      qMatrix.forEach((element) => {
        // Extract all data for rows that has the same name for each person
        if (!table.some((item) => item.repName === element[0].qText)) {
          const rep = qMatrix.filter(
            (row) => row[0].qText === element[0].qText
          );
          // Extract persons name
          const repName = rep[0][0].qText;
          // Determine totals(all 4Quarters for each person)
          const totals = rep.reduce(
            (prev, next) => {
              prev.revenue += next[3].qNum;
              prev.sales += next[2].qNum;
              prev.profit += next[4].qNum;
              return prev;
            },
            { repName, revenue: 0, sales: 0, profit: 0 }
          );
          // Comma delimited
          totals.revenue = numeral(totals.revenue).format('0,0');
          totals.sales = numeral(totals.sales).format('0,0');
          totals.profit = numeral(totals.profit).format('0,0');

          // Add data to the table
          table.push(totals);
          setKpiData(table);
        }
      });
    };
    if (kpiObject && !kpiData) {
      getKpiData();
    }
  }, [kpiData, kpiObject]);
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
        {kpiData?.map((row) => (
          <tr key={Math.random().toString(36)}>
            {keys.map((key) => (
              <td key={Math.random().toString(36)}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
