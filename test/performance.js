const debug = require('debug')('rlayPerformance');
const delay = require('delay');
const argv = require('yargs').argv;
const pLimit = require('p-limit');
const GenerateREOs = require('./generateRlayEntityObjects');
const { Client } = require('@rlay/rlay-client-lib');

const createClient = (storeLimit = 50, readLimit = 50) => {
  const RpcUrl = argv.rpc || 'http://localhost:8546';
  //debug('new Client (%s) storeLimit (%s) readLimit (%s)', RpcUrl, storeLimit, readLimit);
  return new Client({ RpcUrl, storeLimit, readLimit });
}

const main = async () => {
  const debugWrite = debug.extend('write');

  const limit = pLimit(1);
  const storeLimitIncrements = [1, 10, 50, 100, 500];
  const entityIncrements = [1, 5, 10, 50, 100, 500, 1000]//, 5000, 10000, 50000];

  storeLimitIncrements.map(async storeLimitIncrement => {
    return limit(async () => {
      // setup debugger for this param increment
      const thisDebug = debugWrite.extend(`storeLimit:${storeLimitIncrement}`);
      // create the right rlay client for the param increment
      const rlayClient = createClient(storeLimitIncrement);
      entityIncrements.map(async entityIncrement => {
        return limit(async () => {
          // setup debugger for this increment
          const thisThisDebug = thisDebug.extend(`entities:${entityIncrement}`);
          // generate unique, random rlay entity objects
          const generatedREOs = GenerateREOs(entityIncrement);
          // create the rlay entity objects
          const start = Date.now();
          await Promise.all(generatedREOs.map(e => rlayClient.createEntity(e)));
          thisThisDebug('%sms', Date.now() - start);
        });
      });
    });
  });
}

main();
