import Agenda from "agenda";
import { AgendaJob, AgendaJobSchedule } from ".";

(async () => {
  const mongoConnectionString = "mongodb://localhost:27017/case-os";

  const agenda = new Agenda({
    // mongo: options.mongoClient,
    db: {
      address: mongoConnectionString,
      // collection: "_agenda",
    },
    processEvery: "5 seconds", // WORKS
    // processEvery: "10 seconds", // WORKS
    //   defaultLockLifetime: 60000,
    // collection: options.collection,
  });

  agenda.define("MyJob", async (job) =>
    console.log(
      `MY JOB ${job.attrs._id} IS RUNNING at: ${new Date()}!`,
      job.attrs.data
    )
  );

  await agenda.start();

  /**
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)
   */

  const data: AgendaJobSchedule = {
    name: "MyJob",
    interval: "00 0-30 11-13 * * 6", // WORKS: Only saturdays from 11-13 and only every minute between 0 und 30
    // interval: "*/5 * * * * *", // WORKS: 5 seconds
    // interval: "20 seconds", // WORKS
    // interval: "one minute", // WORKS
  };

  console.log("Creating Job !", data);

  const job = await agenda.create(data.name, data);

  // WORKS!
  //   const scheduledJob = await job.repeatEvery(data.interval);

  // WORKS!
  const scheduledJob = await job.repeatEvery(data.interval, {
    skipImmediate: true,
    // timezone: "Europe/Berlin",
    //   startDate: new Date(),
  });

  const savedJob = await scheduledJob.save();
})();
