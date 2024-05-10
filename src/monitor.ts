import 'source-map-support/register';
import config from 'config';
import { credentials, ServiceError } from '@grpc/grpc-js';

import { HealthClient, HealthCheckRequest, HealthCheckResponse, HealthCheckResponse_ServingStatus } from './models/health';

const health = new HealthClient(`0.0.0.0:${config.get('port')}`, credentials.createInsecure());
console.info('gRPC:HealthClient', new Date().toLocaleString());

let argv = 'helloworld.Greeter';
if (process.argv.length >= 3) {
  [, , argv] = process.argv;
}

const param: HealthCheckRequest = {
  service: argv,
};

health.check(param, (err: ServiceError | null, res: HealthCheckResponse) => {
  if (err) {
    console.error('healthCheck:', err);
    return;
  }

  const { status } = res;
  if (status !== HealthCheckResponse_ServingStatus.SERVING) {
    console.error('healthCheck:', status);
    return;
  }

  console.info('healthCheck:', status);
});