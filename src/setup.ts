import { Application } from '@feathersjs/feathers';
import merge from 'deepmerge';

import { AgendaService } from '.';
import { FeathersAgendaOptions } from './types';

export async function setup(app: Application, options?: FeathersAgendaOptions) {
  const defaults: FeathersAgendaOptions = {
    agendaConfig: {
      db: {
        address: app.get('mongodb'), // TODO: Check if exists / has value
      },
    },
    jobDefinitions: [],
    path: '/agendas',
  };

  const opts: FeathersAgendaOptions = merge(defaults, options);

  const agendaService = new AgendaService(opts);

  app.use(opts.path, agendaService);
}
