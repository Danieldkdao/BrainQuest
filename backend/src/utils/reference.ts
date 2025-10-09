import challengeModel from "../models/challenge.model.js";
import trainingSessionModel from "../models/training-session.model.js";
import userModel, { type TodayStats } from "../models/user.model.js";

const addPoints = async (userId: string | null, points: number) => {
  const dateNum = Date.now();
  const date = new Date(dateNum);
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  await userModel.updateOne(
    { userId },
    {
      $inc: {
        points,
        "weekPoints.$[week].data.$[day].value": points,
        "todayStats.points": points,
      },
    },
    {
      arrayFilters: [
        { "week.from": { $lte: dateNum }, "week.to": { $gte: dateNum } },
        { "day.label": day },
      ],
    }
  );
};

const checkUserPrevComplete = async (
  condition: string,
  userId: string | null
) => {
  const challengeUser = await challengeModel.findOne(
    {
      condition,
    },
    { usersComplete: 1, _id: 0 }
  );
  if (!challengeUser) return false;
  const usersComplete = challengeUser.usersComplete;
  const userProgress = usersComplete.filter((item) => item.user === userId);
  if (!userProgress || userProgress.length === 0) return false;
  return userProgress[0].isCompleted;
};

type CategoriesToday = {
  todayStats: Pick<TodayStats, "categories">;
};

export const PointsReference = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const BadgeReference = {
  brain_spark: async (userId: string | null, badgeId: string) => {
    await userModel.updateOne(
      { userId, "puzzles.correct": { $gte: 1 } },
      { $addToSet: { badgesEarned: badgeId } }
    );
  },
  logic_master: async (userId: string | null, badgeId: string) => {
    await userModel.updateOne(
      {
        userId,
        "puzzleCategoryData.label": "Logic",
        "puzzleCategoryData.value": { $gte: 20 },
      },
      { $addToSet: { badgesEarned: badgeId } }
    );
  },
  early_bird: async (userId: string | null, badgeId: string) => {
    const now = new Date();
    const ninePm = new Date();
    ninePm.setHours(9, 0, 0, 0);
    if (now < ninePm) {
      await userModel.updateOne(
        { userId },
        { $addToSet: { badgesEarned: badgeId } }
      );
    }
  },
  night_owl: async (userId: string | null, badgeId: string) => {
    const now = new Date();
    const elevenPm = new Date();
    elevenPm.setHours(23, 0, 0, 0);
    if (now >= elevenPm) {
      await userModel.updateOne(
        { userId },
        { $addToSet: { badgesEarned: badgeId } }
      );
    }
  },
  hot_streak: async (userId: string | null, badgeId: string) => {
    await userModel.updateOne(
      {
        userId,
        streak: { $gte: 7 },
      },
      { $addToSet: { badgesEarned: badgeId } }
    );
  },
  braniac: async (userId: string | null, badgeId: string) => {
    await userModel.updateOne(
      {
        userId,
        "todayStats.points": { $gte: 5000 },
      },
      { $addToSet: { badgesEarned: badgeId } }
    );
  },
  master: async (userId: string | null, badgeId: string) => {
    await userModel.updateOne(
      {
        userId,
        points: { $gte: 100000 },
      },
      { $addToSet: { badgesEarned: badgeId } }
    );
  },
};

export const ChallengeReference = {
  think_outside_the_box: async (userId: string | null) => {
    const prevComplete = await checkUserPrevComplete(
      "think_outside_the_box",
      userId
    );
    if (prevComplete) return;
    const categoriesToday: CategoriesToday | null = await userModel.findOne(
      { userId },
      { "todayStats.categories": 1, _id: 0 }
    );
    const lateralThinkingPuzzles =
      categoriesToday?.todayStats.categories.lateral.correct;
    if (lateralThinkingPuzzles) {
      const isCompleted = lateralThinkingPuzzles >= 3;
      if (isCompleted) {
        await addPoints(userId, 200);
      }
      const progress = isCompleted ? 3 : lateralThinkingPuzzles;
      const result = await challengeModel.updateOne(
        { condition: "think_outside_the_box", "usersComplete.user": userId },
        {
          "usersComplete.$.progress": progress,
          "usersComplete.$.isCompleted": isCompleted,
        }
      );
      if (result.modifiedCount === 0) {
        const newUser = {
          user: userId,
          progress,
          isCompleted,
        };
        await challengeModel.updateOne(
          {
            condition: "think_outside_the_box",
            "usersComplete.user": { $ne: userId },
          },
          { $addToSet: { usersComplete: newUser } }
        );
      }
    }
  },
  power_session: async (userId: string | null) => {
    const prevComplete = await checkUserPrevComplete("power_session", userId);
    if (prevComplete) return;
    const sessions = await trainingSessionModel
      .find({ user: userId }, { pointsEarned: 1, _id: 0 })
      .sort({ pointsEarned: -1 });
    if (sessions && sessions.length > 0) {
      const isCompleted = sessions[0].pointsEarned >= 1000;
      const progress = isCompleted ? 1000 : sessions[0].pointsEarned;
      if (isCompleted) {
        await addPoints(userId, 200);
      }
      const result = await challengeModel.updateOne(
        { condition: "power_session", "usersComplete.user": userId },
        {
          "usersComplete.$.progress": progress,
          "usersComplete.$.isCompleted": isCompleted,
        }
      );
      if (result.modifiedCount === 0) {
        const newUser = {
          user: userId,
          progress,
          isCompleted,
        };
        await challengeModel.updateOne(
          {
            condition: "power_session",
            "usersComplete.user": { $ne: userId },
          },
          { $addToSet: { usersComplete: newUser } }
        );
      }
    }
  },
};
