const uuid = require('uuid/v4');
const { RlayTransform } = require('@rlay/transform');
const { Client } = require('@rlay/rlay-client-lib');

const generateJsonObject = (desiredAmount) => {
  const obj = {};
  // let's create a JSON object with [desiredAmount]/3 key-values
  // which will result in ([desiredAmount] + 4) entity objects
  // Each JSON key-value becomes: 1 Annotation, 1 Property, 1 Property Assertion
  // Each JSON objects becomes: 1 Annotation, 1 Class, 1 Class Assertion, 1 Individual
  Array(Math.ceil(desiredAmount / 3)).fill(0).forEach(() => {
    obj[uuid()] = uuid();
  });
  return obj;
}

module.exports = (desiredAmount) => {
  const rlayClient = new Client();
  const jsonObj = generateJsonObject(desiredAmount);
  const REOs = RlayTransform.toRlayEntityObjects(rlayClient, 'PerformanceTest', jsonObj);
  // cut off ancillary rlay entity objects and return the exacted desired amount
  return REOs.slice(0, desiredAmount);
}
