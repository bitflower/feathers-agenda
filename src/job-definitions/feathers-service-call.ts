import { Application, Params } from '@feathersjs/feathers';
import { Job } from 'agenda';

import { AgendaJobDefinition } from '../types';
import { clone } from '../utils';

export interface FeathersServiceMethod {
  service: string;
  method: string; // TODO: use 'get' | 'find' | 'create' | 'update' | 'delete';
}

export interface FeathersServiceCall extends FeathersServiceMethod {
  data: any;
  params: Params; // TODO: Make somehow be inhertiable
}

export const getJobDefinition = (app: Application) => {
  const feathersServiceCall: AgendaJobDefinition = {
    name: 'ServiceCall',
    callback: async (job: Job<any>) => {
      const {
        attrs: {
          _id,
          data: { service, method, data, params },
        },
      } = job;

      // TODO Add logger
      console.log(`Running "ServiceCall" job ${_id} at ${new Date()}`, {
        service,
        method,
        data,
        params,
      });

      try {
        // Important: Pass `params` as new object otherwise this changes the actual job which is tried to be saved to DB and could contain chars that are not allowed by MongoDB (e.g. $-sign)
        const result = await app.service(service)[method](data, clone(params));
        // TODO Add logger
        console.log(
          `Finished Running "ServiceCall" job ${
            job.attrs._id
          } at ${new Date()} =>`,
          result
        );
      } catch (error) {
        console.log(`BF MÖÖÖP`, { error });
      }
    },
  };

  return feathersServiceCall;
};
