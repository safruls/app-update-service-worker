import { APP_VERSION } from '../version';

console.log(`ServiceWorker app version ${APP_VERSION}`);

const handleInstall = async _event => {
  console.log(`Installing ServiceWorker version ${APP_VERSION}`);
};

const handleActivation = async _event => {
  console.log(`Activating ServiceWorker version ${APP_VERSION}`);
};

/**
 * Set up service worker lifecycle
 */
const start = async () => {
  /**
   * set up install handling
   */
  self.oninstall = async event => {
    await handleInstall(event);
  };

  /**
   * set up active handling
   */
  self.onactivate = async event => {
    await handleActivation(event);
  };

  /**
   * set up message hadling
   */
  self.onmessage = async event => {
    const eventType = event.data.type;
    switch (eventType) {
      case 'SKIP_WAITING_COMMAND':
        await self.skipWaiting();
        break;
      default:
        console.log('No message handler');
    }
  };
};

/**
 * Check if this is a ServiceWorker
 */
const isServiceWorkerAvailable = 'ServiceWorkerGlobalScope' in self;
console.log(self, 'selfObj');
console.log('isServiceWorkerAvailable === ', isServiceWorkerAvailable)

/**
 * Set up the ServiceWorker
 */
if (isServiceWorkerAvailable) {
  await start();
}

// await start();

onerror = function (event) {
  console.error(event);
};
