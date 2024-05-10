import config from 'config';
import { credentials } from '@grpc/grpc-js';

import { getLogger, log4js } from '@camin/server-common';
import { GreeterClient, HelloRequest, HelloResponse } from './models/helloworld';

log4js.configure(config.get('log4js'));
const logger = getLogger(__dirname);

async function main() {
  const client: GreeterClient = new GreeterClient(`127.0.0.1:${config.get('port')}`, credentials.createInsecure());

  client.sayHello({ name: 'vjudge!' }, (err, response) => {
    if (err) {
      logger.error('error: ', { err });
    }
    logger.log('response: ', response.message);
  })
  
}

main();