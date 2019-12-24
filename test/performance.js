/* eslint-env node, mocha */
const debug = require('debug')('rlayPerformance');
const delay = require('delay');
const argv = require('yargs').argv;
const pLimit = require('p-limit');
const GenerateREOs = require('./generateRlayEntityObjects');
const { Client } = require('@rlay/rlay-client-lib');
const Docker = require('dockerode');
const getPort = require('get-port');
const check = require('check-types');
const {
  startContainer,
  stopAndRemoveContainer,
} = require('./docker.js');

const createClient = (storeLimit = 50, readLimit = 50) => {
  const RpcUrl = argv.rpc || 'http://localhost:8546';
  //debug('new Client (%s) storeLimit (%s) readLimit (%s)', RpcUrl, storeLimit, readLimit);
  return new Client({ RpcUrl, storeLimit, readLimit });
}

const purgeDatabase = async rlayClient => {
  return rlayClient.findEntityByCypher('MATCH (n) DETACH DELETE n');
}

const findDuplicates = async rlayClient => {
  return rlayClient.findEntityByCypher(`
    MATCH (a:RlayEntity)
    MATCH (b:RlayEntity)
    WHERE b.cid = a.cid AND NOT b = a
    RETURN a.cid`);
}


const rlayImage = process.env.RLAY_IMAGE;
check.assert.string(rlayImage, 'no rlay image specified through RLAY_IMAGE env var');
// RLAY_HOST_PORT does not need to be defined; will try 8546, 8547, or get a free one
const rlayHostPort = process.env.RLAY_HOST_PORT;

describe('RlayPerformance', () => {
  let container;
  const debugDocker = debug.extend('docker');
  before(async () => {
    container = await startContainer(rlayImage, debugDocker, rlayHostPort);
  });
  after(async () => {
    stopAndRemoveContainer(container, debugDocker);
  });

  describe('write', async () => {
    const debugWrite = debug.extend('write');

    const limit = pLimit(1);
    const entityLimit = pLimit(1);
    const storeLimitIncrements = [1, 10, 50, 100, 500];
    const entityIncrements = [1, 5, 10, 50, 100]//, 500]//, 1000]//, 5000, 10000, 50000];

    storeLimitIncrements.forEach(storeLimitIncrement => {
      it(`write:storeLimit:${storeLimitIncrement}`, async () => {
        // setup debugger for this param increment
        const thisDebug = debugWrite.extend(`storeLimit:${storeLimitIncrement}`);
        // create the right rlay client for the param increment
        const rlayClient = createClient(storeLimitIncrement, storeLimitIncrement);
        // reset the database (neo) to empty state
        //await purgeDatabase(rlayClient)
        await Promise.all(entityIncrements.map(async entityIncrement => {
          return entityLimit(async () => {
            // setup debugger for this increment
            const thisThisDebug = thisDebug.extend(`entities:${entityIncrement}`);
            // generate unique, random rlay entity objects
            const generatedREOs = GenerateREOs(entityIncrement);
            // create the rlay entity objects
            const start = Date.now();
            await Promise.all(generatedREOs.map(e => rlayClient.createEntity(e)));
            thisThisDebug('%sms', Date.now() - start);
          });
        }));
        const duplicates = await findDuplicates(rlayClient);
        thisDebug.extend(`duplicates`)(duplicates.length);
      });
    });
  });
});
