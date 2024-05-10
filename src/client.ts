import config from 'config';
import { credentials } from '@grpc/grpc-js';

import { GreeterClient, HelloRequest, HelloResponse } from './models/helloworld';

async function main() {
  const client: GreeterClient = new GreeterClient(`127.0.0.1:${config.get('port')}`, credentials.createInsecure());

  client.sayHello({ name: 'vjudge!' }, (err, response) => {
    if (err) {
      console.error('error: ', { err });
    }
    console.log('response: ', response.message);
  })
  
}

main();