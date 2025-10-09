import updateBTCPriceHandler from './handlers/update-btc-price.handler';

export default function () {
  console.log('History BTC Worker started...\n');

  setInterval(updateBTCPriceHandler, 10 * 60 * 1000);
}
