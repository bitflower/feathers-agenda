import { Application } from '@feathersjs/feathers';

import { getJobDefinition } from './feathers-service-call';

export const getJobDefinitions = (app: Application) => {
  return [getJobDefinition(app)];
};
