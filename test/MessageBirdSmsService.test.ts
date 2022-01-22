import { FeathersError } from "@feathersjs/errors";
import feathers, { Application } from "@feathersjs/feathers";
import assert from "assert";
import { MessageBirdSmsService } from "../src"

describe("MessageBirdSmsService.test.ts", function() {
  let app: Application
    let service: MessageBirdSmsService
    beforeEach(function() {
      app = feathers();

      app.use("/sms-service", new MessageBirdSmsService({
        accessKey: process.env.MESSAGEBIRD_TEST_KEY
      }))

      service = app.service("/sms-service")
    })

  describe('general', function () {
    it("has hookless methods", function() {
      const hooklessMethods = ["_find", "_get", "_create", "_remove"];
      hooklessMethods.forEach(method => {
        assert.ok(typeof service[method] === "function", `${method} is function`)
      })
    })

    it("has methods", function() {
      const hooklessMethods = ["find", "get", "create", "remove"];
      hooklessMethods.forEach(method => {
        assert.ok(typeof service[method] === "function", `${method} is function`)
      })
    })

    it('has .messagebird', () => {
      assert.ok(app.service('sms-service').messagebird);
    });
  });

  describe("create", function() {
    it('creates message', async function() {
      try {
        const result = await service.create({
          originator: "test",
          recipients: [process.env.TEST_PHONE_NUMBER],
          body: "Hello world"
        })

        assert.ok(result);
      } catch (err) {
        assert.fail();
      }
    });

    it('fails message', async function() {
      await assert.rejects(
        service.create({
          originator: "test",
          recipients: ["test"],
          body: "Hello world"
        }),
        (err: FeathersError) => err.name === "Unprocessable" && err.code === 422
      )
    });

    it('fails message', async function() {
      await assert.rejects(
        service.create({
          originator: "test",
          recipients: ["test"],
          body: "Hello world"
        }),
        (err: FeathersError) => err.name === "Unprocessable" && err.code === 422
      )
    });
  });

  describe("find", function() {
    it("can list", async function() {
      try {
        const result = await service.find({ query: { status: "sent" }});

        assert.ok(Array.isArray(result));
      } catch (err) {
        assert.fail();
      }
    })
  })
})
