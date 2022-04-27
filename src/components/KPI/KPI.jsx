import { useEffect, useState } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';

export default function KPI({ qlikApp, objectId, title, color }) {
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
      const newKpiData = {
        value: Math.round(layout[0].qMatrix[0][0].qNum / 100000),
        percent: layout[0].qMatrix[0][1].qNum * 100,
      };
      setKpiData(newKpiData);
    };
    if (kpiObject && !kpiData) {
      getKpiData();
    }
  }, [kpiData, kpiObject]);
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
      <h5>£ {numeral(kpiData?.value).format('0,0')} m</h5>
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
const Section = styled.div`
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
const Percent = styled.div`
  .percent {
    color: ${(props) => props.arrowcolor || 'grey'};
    display: flex;
    gap: 1rem;
  }
  display: flex;
  align-items: center;
  gap: 1rem;
`;
