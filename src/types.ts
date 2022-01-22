import { AgendaConfig, Job } from 'agenda';

export interface AgendaJobDefinition<T = any> {
  name: string;
  callback: (
    job: Job<T>
  ) => Promise<Job<T> | void> | ((job: Job<T>) => Job<T> | void);
}

export interface FeathersAgendaOptions {
  agendaConfig: AgendaConfig;
  jobDefinitions?: AgendaJobDefinition[];
  path?: string;
}

export interface AgendaJobSchedule<T> {
  name: string;
  interval: string;
  data?: T;
}

export type MaybeArray<T> = T | T[];

export { Job };
