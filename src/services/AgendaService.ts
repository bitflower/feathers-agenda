import { Agenda, AgendaConfig } from 'agenda';
import { AdapterService } from '@feathersjs/adapter-commons';
// import util from "util";

import type { Application, Params } from '@feathersjs/feathers';
// import { filterQuery } from "@feathersjs/adapter-commons"
import { MethodNotAllowed } from '@feathersjs/errors';
import type {
  AgendaJobSchedule,
  FeathersAgendaOptions,
  MaybeArray,
} from '../types';
import { getJobDefinitions } from '../job-definitions';
import { AgendaJobDefinition } from '..';
// import { errorHandler } from '../utils';

// const alwaysMulti: { [key: string]: boolean } = {
//   find: true,
//   get: false,
//   update: false,
// };

export class AgendaService<T> extends AdapterService {
  _app: Application;
  _agenda: Agenda;
  _jobDefinitions: AgendaJobDefinition[];
  _agendaConfig: AgendaConfig;

  constructor({ agendaConfig, jobDefinitions }: FeathersAgendaOptions) {
    super({});
    this._agendaConfig = agendaConfig;
    this._jobDefinitions = jobDefinitions;
  }

  protected get agenda() {
    return this._agenda;
  }

  // getOptions (params: Params): MessageBirdSmsOptions {
  //   return {
  //     ...this.options,
  //     ...params.adapter
  //   }
  // }

  // async _find(params: MessageBirdSmsFindParams) {
  //   const { filters, query, paginate } = this.filterQuery(params);
  //   let { $limit, $skip } = filters;

  //   const result = await this.list({
  //     status: params.query.status,
  //     limit: $limit,
  //     offset: $skip
  //   }).catch(errorHandler);

  //   // @ts-ignore
  //   if (paginate && paginate.default) {
  //     return {
  //       //@ts-ignore
  //       data: result.items,
  //       //@ts-ignore
  //       $skip: result.offset,
  //       //@ts-ignore
  //       $limit: result.limit,
  //       //@ts-ignore
  //       total: result.totalCount
  //     }
  //   } else {
  //     //@ts-ignore
  //     return result.items;
  //   }

  // }

  // async _get(id: string, params: Params) {
  //   return await this.read(id).catch<Message>(errorHandler);
  // }

  protected async createOne(jobSchedule: AgendaJobSchedule<T>, params: Params) {
    console.log('Creating Job !', jobSchedule);

    const { name, data, interval } = jobSchedule;

    const job = await this.agenda.create(name, data);

    const scheduledJob = await job.repeatEvery(interval, {
      skipImmediate: true,
      // timezone: "Europe/Berlin",
      // startDate: new Date(),
    });
    const savedJob = await scheduledJob.save();
    return savedJob;
  }

  async _create(data: AgendaJobSchedule<T>, params: Params) {
    // if (Array.isArray(data)) {
    //   return await Promise.all(
    //     data.map(async d => this.createOne(d, params))
    //   ).catch<Message[]>(errorHandler)
    // } else {
    return await this.createOne(data, params); // .catch<Message>(errorHandler);

    // }
  }

  // async _remove(id, params) {
  //   return await this.delete(id).catch<unknown>(errorHandler);
  // }

  // async find (params: MessageBirdSmsFindParams): Promise<Message[] | Paginated<Message>> {
  //   return await this._find(params);
  // }

  // async get (id: string, params?: Params): Promise<Message> {
  //   return await this._get(id, params);
  // }

  async create(data: AgendaJobSchedule<T>, params?: Params): Promise<any> {
    // Promise<MaybeArray<Message>>; // ): //   params?: Params //   data: MaybeArray<AgendaJob>, // async create( // async create(data: AgendaJob[], params?: Params): Promise<Message[]>;
    // if (Array.isArray(data) && !this.allowsMulti("create", params)) {
    //   return Promise.reject(
    //     new MethodNotAllowed("Can not create multiple entries")
    //   );
    // }

    return await this._create(data, params);
  }

  // async remove (id: string, params?: Params): Promise<unknown> {
  //   return await this._remove(id, params);
  // }

  // filterQuery (params: Params = {}, opts: any = {}) {
  //   const paginate = typeof params.paginate !== 'undefined'
  //     ? params.paginate
  //     : this.getOptions(params).paginate;
  //   const { query = {} } = params;
  //   const options = Object.assign({
  //     operators: [],
  //     filters: [],
  //     paginate
  //   }, opts);
  //   const result = filterQuery(query, options);

  //   return Object.assign(result, { paginate });
  // }

  // allowsMulti (method: string, params: Params = {}) {
  //   const always = alwaysMulti[method];

  //   if (typeof always !== 'undefined') {
  //     return always;
  //   }

  //   const { multi: option } = this.getOptions(params);

  //   if (option === true || option === false) {
  //     return option;
  //   }

  //   return option.includes(method);
  // }

  setup(app: Application) {
    this._app = app;

    this._agenda = new Agenda(this._agendaConfig);

    const mergedJobDefinitions = [
      ...getJobDefinitions(this._app),
      ...this._jobDefinitions,
    ];

    mergedJobDefinitions.forEach((jobDefinition) => {
      this.agenda.define(jobDefinition.name, jobDefinition.callback);
    });

    this.agenda.start(); // TODO: Is async and needs await?
  }
}
