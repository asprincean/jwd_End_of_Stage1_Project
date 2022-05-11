import { useEffect, useState } from 'react';
import { Section, Percent } from '../../styles/KpiComponent';
import numeral from 'numeral';

export default function KpiProfit({ qlikApp, objectId, title, color }) {
  // Get the relevant kpiData from the layout of the kpiObject and set to state
  const [kpiData, setKpiData] = useState(undefined);
  useEffect(() => {
    let kpiObject;
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
      // Get the HyperCubeData
      const layout = await kpiObject.getHyperCubeData(qPath, qPages);
      // Determine the total Profit
      let totalRevenue = 0;
      let totalExpenses = 0;
      const { qMatrix } = layout[0];

      qMatrix.forEach((element) => {
        const revenueNumber = element[1].qNum;
        const expenseNumber = element[2].qNum;
        totalRevenue += revenueNumber;
        totalExpenses += expenseNumber;
      });
      const totalProfit = totalRevenue - totalExpenses;
      const round = Math.round(totalProfit / 100000);

      const newKpiData = {
        value: numeral(round).format('0,0'),
        percent: layout[0].qMatrix[0][3].qNum * 100,
      };
      setKpiData(newKpiData);
    };
    // Get the kpiObject, which is an instance of a qlik object & set to state
    const getSetObjectDetails = async () => {
      // Get the specified object from the instance of the specific app
      kpiObject = await qlikApp.getObject(objectId);
      getKpiData();
      kpiObject.on('changed', getKpiData);
    };
    // Only call the getSetObject when: qlikApp does exist and objectId does exist
    if (qlikApp && objectId) {
      getSetObjectDetails();
    }
    return () => {
      if (kpiObject) {
        kpiObject.removeListener('changed', getKpiData);
      }
    };
  }, [qlikApp, objectId]);
  let arrow;
  let arrowcolor;
  // Determine the direction of the arrow symbol, based on percentage value
  if (kpiData?.percent < 0) {
    arrow = 'down';
    arrowcolor = 'red';
  } else if (kpiData?.percent > 0) {
    arrow = 'up';
    arrowcolor = 'green';
  } else {
    arrow = '';
    arrowcolor = 'grey';
  }
  return (
    <Section color={color}>
      <h5>£ {kpiData?.value} m</h5>
      <Percent arrowcolor={arrowcolor}>
        <h6>{title}</h6>
        <span className="percent">
          <i className={`fa-solid fa-arrow-${arrow}`} />
          {kpiData?.percent.toFixed(2) + '%'}
        </span>
      </Percent>
    </Section>
  );
}
