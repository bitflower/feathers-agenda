# feathers-agenda

A [feathers.js](https://feathersjs.com/) service adapter for [agendajs](http://agendajs.com/) written in Typescript.

[![npm](https://img.shields.io/npm/v/feathers-agenda)](https://www.npmjs.com/package/feathers-agenda)
[![libraries.io](https://img.shields.io/librariesio/release/npm/feathers-agenda)](https://libraries.io/npm/feathers-agenda)
[![npm](https://img.shields.io/npm/dm/feathers-agenda)](https://www.npmjs.com/package/feathers-agenda)
[![GitHub license](https://img.shields.io/github/license/bitflower/feathers-agenda)](https://github.com/bitflower/feathers-agenda/blob/master/LICENSE)

## Installation

```bash
npm i feathers-agenda
```

Also see:

- https://feathersjs.com/
- https://github.com/agenda/agenda

## Supported features

- [x] `Agenda` instaniation, interaction & configuration
  - [x] [instaniation](https://github.com/agenda/agenda#example-usage) -> `constructor` initializes an instance and stores it on the service instance
  - [x] configuration -> `new AgendaService()` or `app.configure()`
  - [x] interaction -> `getAgenda` method
  - [x] [custom job processors](https://github.com/agenda/agenda#defining-job-processors) -> `AgendaJobDefinition` can be provided during setup
- [x] Support different scheduling types:
  - [x] `every()` / `repeatEvery()`

## In progress

- [ ] Implement out-of-the-box job processor `ServiceCall` for easily scheduling Feathers service calls

## Todo (contributions welcome)

- [ ] Tests
- [ ] List jobs
- [ ] Delete jobs
- [ ] Canceling, disabling and enabling jobs
- [ ] [schedule job type](https://github.com/agenda/agenda#schedulewhen-name-data) -> support different scheduling types
- [ ] [now job type](https://github.com/agenda/agenda#nowname-data) -> support different scheduling types
- [ ] handle `SIGTERM` properly to avoid dead agenda record (e.g. `lockedAt` is set instead of `undefined`)
- [ ] [Interact with events](https://github.com/agenda/agenda#agenda-events)
- [ ] Update to latest `@feathers/feathers`
- [ ] Mixin API to comfortably scheduling service calls from within the code base

## Usage

For a quick start no further configuration is required. The library will pick the MongoDB url from the Feathers `config.mongodb` property.

### With `app.use()`

```typescript
import { AgendaService } from 'feathers-agenda';

app.use("/agendas", new AgendaService({
  // options
}))

app.service("agendas").create({
  name : 'ServiceCall',
  interval : '*/20 * * * * *', // Every 20 seconds
  data: {
    service: '',
    method: 'get',
    data: {
      // The data you want to pass into the job
      // An `_id` for a `get` call or an object for `create` or other methods
    },
    params: {
      // Any Feathers `params` you want to pass in
    }
  }
})

```

### With `app.configure()`

```typescript
import { setup } from 'feathers-agenda';

app.configure(setup);

app.service("agendas").create({
  name : 'ServiceCall',
  interval : '*/20 * * * * *', // Every 20 seconds
  data: {
    service: '',
    method: 'get',
    data: {
      // The data you want to pass into the job
      // An `_id` for a `get` call or an object for `create` or other methods
    },
    params: {
      // Any Feathers `params` you want to pass in
    }
  }
})

```

### Custom job definition example

```typescript
import { FeathersAgendaOptions, setup } from 'feathers-agenda';

// Define the name and the code of a job you want to run periodically / in a scheduled way
app.configure((app) => {
  const customConfigAndJobs: FeathersAgendaOptions = {
    jobDefinitions: [
      {
        name: 'MyJob',
        callback: async (job: any) => {

          // Do anything you want here (like service calls, business logic, etc)
          const { attrs: { _id } } = job;
          const record = await app
            .service('email-sending-service')
            .post(_id);
        }
      }
    ]
  };
  setup(app, customConfigAndJobs);
});

// Actually schedule the job
app.service("agendas").create({
  name : 'MyJob',
  interval : '*/20 * * * * *', // Every 20 seconds
  data: {
    _id: '61e5a5bb06c4d94ddc9cb531'
  }
})

```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run. It has full support for *Visual Studio Code*. You can use the debugger to set breakpoints.

## License

Licensed under the [MIT license](LICENSE).

## Inspiration

Original feathers service template was [feathers-messagebird](https://github.com/fratzinger/feathers-messagebird) by Frederik Schmatz.
