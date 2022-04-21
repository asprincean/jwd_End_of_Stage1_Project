import styled from 'styled-components';
import { useState, useEffect } from 'react';
import QlikConnector from '../util/qlikConnector';
import KPI from './KPI/KPI';
import KpiProfit from './KPI/kpiProfit';
import TableSales from './tableSales';

function Dashboard() {
  const [qlikApp, setQlikApp] = useState(undefined);
  // When called will get the qlikApp using the QlikConnector function then set to state
  const getSetQlikApp = async () => {
    let sourcedQlikApp;
    try {
      sourcedQlikApp = await QlikConnector(
        '187aea12-91a3-4395-9b16-fea2c2613636'
      );
    } catch (err) {
      console.log(err);
    }
    setQlikApp(sourcedQlikApp);
  };

  useEffect(() => {
    // Only call getSetQlikApp if qlikApp is undefined
    if (qlikApp === undefined) {
      getSetQlikApp();
    }
  }, [qlikApp]);

  return (
    <Section>
      <div className="grid">
        <KPI
          qlikApp={qlikApp}
          objectId="tWJJyZ"
          title="TOTAL REVENUE"
          color={'#eef4ff'}
        />
        <KPI
          qlikApp={qlikApp}
          objectId="eMsVVT"
          title="TOTAL EXPENSES"
          color={'#fdf4f5'}
        />
        <KpiProfit
          qlikApp={qlikApp}
          objectId="xWWjCN"
          title="TOTAL PROFIT"
          color={'#fffce4'}
        ></KpiProfit>
      </div>
      <TableSales qlikApp={qlikApp} objectId="QJCCUM" />
    </Section>
  );
}

export default Dashboard;
const Section = styled.div`
  margin-left: 1vw;
  padding: 1rem;
  height: 100%;
  .grid {
    display: grid;
    grid-template-columns: 22% 22% 22%;
  }
`;
