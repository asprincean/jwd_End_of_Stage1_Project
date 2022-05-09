import { useEffect, useState } from 'react';
import WaterfallChart from './waterfallChart';

const DataChart = ({ qlikApp, objectId }) => {
  const [data, setData] = useState();

  // Gets the object, and adds a listener to get the data
  useEffect(() => {
    let qlikObject;
    const getData = async () => {
      // Getting data from qlik
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
      const chartData = hyperCubeData[0].qMatrix;

      setData(chartData);
    };
    const getQlikObject = async () => {
      qlikObject = await qlikApp.getObject(objectId);
      getData();
      qlikObject.on('changed', getData);
    };
    if (qlikApp && objectId) {
      getQlikObject();
    }
    return () => {
      if (qlikObject) {
        qlikObject.removeListener('changed', getData);
      }
    };
  }, [qlikApp, objectId]);

  return <>{data && <WaterfallChart data={data} />}</>;
};
export default DataChart;
