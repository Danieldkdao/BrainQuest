import cron from "cron";
import https from "https";
import { startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { resetDailyChallenges } from "../controllers/challenge.controller.js";
import userModel, { defaultData3 } from "../models/user.model.js";

const getCurrentHourInTimezone = (tz: string) => {
  const now = new Date();
  const hourString = now.toLocaleString("en-US", {
    hour: "2-digit",
    hour12: false,
    timeZone: tz,
  });

  const hour = parseInt(hourString);
  return hour === 24 ? 0 : hour;
};

export const keepOpen = new cron.CronJob("*/14 * * * *", () => {
  https
    .get(process.env.API_URL!, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully!");
      else console.log("GET request failed: ", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request: ", e));
});

export const runDaily = new cron.CronJob("0 * * * *", async () => {
  try {
    const timezones = await userModel.distinct("checkNewDay.timezone");
    for (const tz of timezones) {
      const currentHour = getCurrentHourInTimezone(tz);
      if (currentHour === 0) {
        await resetDailyChallenges(tz);
        const startOfToday = fromZonedTime(startOfDay(new Date()), tz);
        await userModel.updateMany(
          {
            "checkNewDay.timezone": tz,
            "checkNewDay.lastChecked": { $lt: startOfToday },
          },
          {
            $set: {
              todayStats: defaultData3,
              "checkNewDay.lastChecked": Date.now(),
            },
          }
        );
      }
    }
  } catch (error) {
    console.error("Error in hourly cron job: ", error);
  }
});
