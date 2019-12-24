const check = require('check-types');
const getPort = require('get-port');
const Docker = require('dockerode');
const delay = require('delay');
const uuid = require('uuid');

const getFreePort = async (desiredPort) => {
  const defaultPorts = [8546, 8547];
  const desiredPorts = [desiredPort, ...defaultPorts];
  return getPort({port: desiredPorts.filter(check.assigned)});
}

const startContainer = async (image, imagePort, debug) => {
  // validate image param
  check.assert.string(image, 'expected image to be a string');
  if (image.includes('prod') || image.includes('production')) {
    throw new Error('aborting because specified image might be a production image');
  }

  const docker = new Docker();
  debug.extend('start')(`creating container for ${image} and export to port ${imagePort} …`);
  const container = await docker.createContainer({
    name: `rlay-performance-tests-${uuid()}`,
    Image: image,
    ExposedPorts: { '8546/tcp:': {} },
    HostConfig: {
      PortBindings: { '8546/tcp': [{ HostPort: `${imagePort}` }] },
    }
  });
  const shortContainerId = container.id.slice(-6);
  debug.extend('start')(`starting container ${shortContainerId} …`);
  await container.start();
  await delay(5000);
  return container;
}

const stopAndRemoveContainer = async (container, debug) => {
  const shortContainerId = container.id.slice(-6);
  debug.extend('stop')(`stopping container ${shortContainerId} …`);
  await container.stop();
  debug.extend('remove')(`removing container ${shortContainerId} …`);
  await container.remove();
}

module.exports = { getFreePort, startContainer, stopAndRemoveContainer };
