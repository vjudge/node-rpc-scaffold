import path from 'path';
import config from 'config';
import { Server, ServerCredentials } from '@grpc/grpc-js';

import helloWorldService from './services/helloworld.service';

import { GreeterService } from './models/helloworld'
import { MonitorService } from './services/montior.service';

function main() {
  const server = new Server({
  'grpc.max_receive_message_length': -1,
  'grpc.max_send_message_length': -1,
});

  server.addService(GreeterService, helloWorldService.handler);

  const health = new MonitorService(server);

  server.bindAsync(`0.0.0.0:${config.get('port')}`, ServerCredentials.createInsecure(), (err: Error|null, port: number) => {
    if (err != null) {
      return console.error(err);
    }

    health.setStatus('helloworld.Greeter', 'SERVING');
    console.log(`~ gRPC listening on ${port} ~`);
  });

}

main();