import registerDependencies from '@/dependecies';

import startHistoryBTCWorker from './history-btc.worker';
import startQueueWorker from './queue.worker';

/** O ideal aqui era estar em um container com worker seperado */
(() => {
  console.log('Starting workers...\n');

  try {
    registerDependencies();

    startQueueWorker();
    startHistoryBTCWorker();
  } catch (error) {
    console.error('Error starting workers:', error);
    process.exit(1);
  }
})();
