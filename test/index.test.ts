import feathers from '@feathersjs/feathers';
import type { Application } from '@feathersjs/feathers';
import service from 'feathers-memory';
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { AgendaService, FeathersAgendaOptions, setup } from '../src';

import { getMongoUri, stopMongoServer } from './utils';

// This test still finishes somehow unclean in terms of reporting `utils.ts` as a test file

describe('index', function () {
  let app: Application;
  before(function () {
    app = feathers();
    app.use('/todos', service());
  });
  after(async function () {
    await stopMongoServer();
  });

  it('exports all members', function () {
    assert.ok(AgendaService);
  });

  it('setup works', async function () {
    // Arrange
    const newTodo = {
      name: 'Clean Kitchen'
    };

    // Act
    await getMongoUri(app);
    await setup(app, {
      agendaConfig: {
        db: {
          collection: '_agendas'
        }
      }
    } as FeathersAgendaOptions);

    const service = app.service('/agendas');
    await service.setup(app);
    const serviceTodos = app.service('/todos');
    await service.create({
      name: 'ServiceCall',
      interval: '*/5 * * * * *', // Every 5 seconds
      data: {
        service: 'todos',
        method: 'create',
        data: newTodo
      }
    });

    // Use a promise to wait 7 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await service.stop();

    const todos = await serviceTodos.find({});

    // Assert
    assert.ok(service);
    assert.equal(todos.length, 1);
    assert.deepEqual(todos[0], { ...newTodo, id: 0 });
  });
});
