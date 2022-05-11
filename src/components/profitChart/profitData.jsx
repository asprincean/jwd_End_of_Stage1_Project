import { useEffect, useState } from 'react';
import ProfitChart from './profitChart';

export default function ProfitData({ qlikApp, objectId }) {
  // Get the relevant chartData from the layout of the relevant qlikObject and set to state
  const [chartData, setChartData] = useState(undefined);
  console.log('chartData', chartData);
  useEffect(() => {
    let qlikObject;
    const getChartData = async () => {
      const layout = await qlikObject.getLayout();
      const hyperCubeData = await qlikObject.getHyperCubeData({
        qPath: '/qHyperCubeDef',
        qPages: [
          {
            qLeft: 0,
            qTop: 0,
            qWidth: layout.qHyperCube.qSize.qcx,
            qHeight: layout.qHyperCube.qSize.qcy,
          },
        ],
      });
      // Extracting qlik data for easier charting
      const newChartData = [
        ...layout.qHyperCube.qMeasureInfo,
        ...hyperCubeData[0].qMatrix[0],
      ];
      // Extract data for yAxis
      const arr1 = newChartData.slice(0, 5).map((item) => {
        return { qText: item.qFallbackTitle };
      });
      // Extract data for xAxis
      const arr2 = newChartData.slice(5, 10).map((item) => {
        return { qNum: item.qNum };
      });
      // Combine data from arr1&arr2 into a new array(formattedTable)
      const formattedTable = arr1.map((item, i) =>
        Object.assign({}, item, arr2[i])
      );

      setChartData(formattedTable);
    };
    const getQlikObject = async () => {
      qlikObject = await qlikApp.getObject(objectId);
      getChartData();
      qlikObject.on('changed', getChartData);
    };
    if (qlikApp && objectId) {
      getQlikObject();
    }
    return () => {
      if (qlikObject) {
        qlikObject.removeListener('changed', getChartData);
      }
    };
  }, [qlikApp, objectId]);

  return <>{chartData && <ProfitChart data={chartData} />}</>;
}
