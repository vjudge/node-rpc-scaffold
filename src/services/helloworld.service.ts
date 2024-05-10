import grpc, { ServerUnaryCall, UntypedHandleCall, status } from '@grpc/grpc-js';

import { GreeterService, GreeterServer, HelloRequest, HelloResponse } from '../models/helloworld';
import { ServiceError } from '../utils';

class HelloWorldService implements GreeterServer {
  [method: string]: UntypedHandleCall;

  /**
   * Greet the user nicely
   * @param call
   * @param callback
   */
    sayHello = (call: grpc.ServerUnaryCall<HelloRequest, HelloResponse>, callback: grpc.sendUnaryData<HelloResponse>): void => {
      const res: Partial<HelloResponse> = {};

      if (call.request.name === 'error') {
        callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidValue'), null);
        return;
      }

      res.message = 'Hi, ' + call.request.name;

      callback(null, HelloResponse.fromJSON(res));
    };
}

export default {
  service: GreeterService,
  handler: new HelloWorldService(),
};