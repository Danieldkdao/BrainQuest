import cron from "cron";
import https from "https";
import { chooseDailyChallenges } from "../controllers/challenge.controller.js";
import { chooseDailyPuzzle } from "../controllers/puzzle.controller.js";
import userModel, { defaultData3 } from "../models/user.model.js";
export const keepOpen = new cron.CronJob("*/14 * * * *", () => {
    https
        .get(process.env.API_URL, (res) => {
        if (res.statusCode === 200)
            console.log("GET request sent successfully!");
        else
            console.log("GET request failed: ", res.statusCode);
    })
        .on("error", (e) => console.error("Error while sending request: ", e));
});
export const runDaily = new cron.CronJob("30 1 * * *", async () => {
    try {
        console.log("ran");
        await chooseDailyChallenges();
        await chooseDailyPuzzle();
        await userModel.updateMany({}, { $set: { todayStats: defaultData3 } });
    }
    catch (error) {
        console.error(error);
    }
});
