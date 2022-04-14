/* eslint-disable prefer-promise-reject-errors */
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');

const getQlikTicket = () => window.location.search || '';
let qlikTicket = '';

export function openSession(session, appId) {
  return new Promise((resolve, reject) => {
    session
      .open()
      .then((global) => {
        if (global.loginUri && !qlikTicket) {
          window.location.href = global.loginUri;
        }
        global
          .openDoc(appId)
          .then((doc) => {
            resolve(doc);
          })
          .catch(() => {
            reject('Qlik-Enigma Error: unable to openDoc');
          });
      })
      .catch(() => {
        reject('Qlik-Enigma Error: unable to open session');
      });
  });
}

/**
 *
 * @param {string} appId - id of qlik App that you want to connect to.
 * @returns a doc object which is an instance of a qlik app.
 */
const QlikConnector = async (appId) => {
  // Variables relating to authentication
  const reloadURI = 'http://localhost:3000';
  qlikTicket = getQlikTicket();
  const qlikTicketString = qlikTicket ? `&QlikTicket=${qlikTicket}` : '';
  // Configuration variables
  const qsHost = 'wss://cc-edapps.calibrateconsulting.com';

  // sessions creates an instance of the engine api, and opens a websocket connection to the specified server
  const session = enigma.create({
    schema,
    url: `${qsHost}/app/${appId}?reloadURI=${reloadURI}${qlikTicketString}`,
    createSocket: (url) => new WebSocket(url),
  });

  // doc is an instance of a qlik app
  const doc = await openSession(session, appId);
  return doc;
};

export default QlikConnector;
