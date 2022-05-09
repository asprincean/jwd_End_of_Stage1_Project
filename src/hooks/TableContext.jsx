import { useState, useEffect, createContext, useContext } from 'react';
import numeral from 'numeral';

export const TableContext = createContext();

export function useTable() {
  return useContext(TableContext);
}

export function useKeys() {}

export function TableProvider({ children, qlikApp, objectId }) {
  // Get the relevant tableData from the layout of the tableObject and set to state
  const [tableData, setTableData] = useState(undefined);
  useEffect(() => {
    let tableObject;
    const getTableData = async () => {
      const layout1 = await tableObject.getLayout();
      const qPath = '/qHyperCubeDef';
      const qPages = [
        {
          qLeft: 0,
          qTop: 0,
          qWidth: layout1.qHyperCube.qSize.qcx, // layoutObject['qHyperCube']['qSize']['qcx']
          qHeight: layout1.qHyperCube.qSize.qcy, // layoutObject['qHyperCube']['qSize']['qcy']
        },
      ];
      const layout = await tableObject.getHyperCubeData(qPath, qPages);
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
          setTableData(table);
        }
      });
    };
    // Get the tableObject, which is an instance of a qlik object & set to state
    const getSetObjectDetails = async () => {
      // Get the specified object from the instance of the specific app
      tableObject = await qlikApp.getObject(objectId);
      getTableData();
      tableObject.on('changed', getTableData);
    };
    // Only call the getSetObject when: qlikApp does exist and objectId does exist
    if (qlikApp && objectId) {
      getSetObjectDetails();
    }
    return () => {
      if (tableObject) {
        tableObject.removeListener('changed', getTableData);
      }
    };
  }, [qlikApp, objectId]);

  return (
    <TableContext.Provider value={tableData}>{children}</TableContext.Provider>
  );
}
