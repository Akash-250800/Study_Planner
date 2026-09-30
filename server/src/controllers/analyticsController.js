import Task from "../models/Task.js";

export const getAnalyticsSummary = async (req, res) => {
  const userId = req.user._id;

  const now = new Date();

  const upcomingEnd = new Date();

  upcomingEnd.setDate(upcomingEnd.getDate() + 7);

  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [total, completed, pending, overdue, upcoming, completedThisWeek] =
    await Promise.all([
      Task.countDocuments({
        user: userId,
      }),

      Task.countDocuments({
        user: userId,
        status: "completed",
      }),

      Task.countDocuments({
        user: userId,
        status: "pending",
      }),

      Task.countDocuments({
        user: userId,
        status: "pending",
        deadline: {
          $lt: now,
        },
      }),

      Task.countDocuments({
        user: userId,
        status: "pending",
        deadline: {
          $gte: now,
          $lte: upcomingEnd,
        },
      }),

      Task.countDocuments({
        user: userId,
        status: "completed",
        completedAt: {
          $gte: sevenDaysAgo,
        },
      }),
    ]);

  const bySubject = await Task.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$subject",
        total: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },
        pending: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "pending"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "_id",
        as: "subject",
      },
    },
    {
      $unwind: {
        path: "$subject",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        subjectId: "$_id",
        subjectName: {
          $ifNull: ["$subject.name", "Unknown"],
        },
        total: 1,
        completed: 1,
        pending: 1,
        completionRate: {
          $cond: [
            {
              $gt: ["$total", 0],
            },
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$completed", "$total"],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $sort: {
        subjectName: 1,
      },
    },
  ]);

  const byPriority = await Task.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$priority",
        total: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },
        pending: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "pending"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        priority: "$_id",
        total: 1,
        completed: 1,
        pending: 1,
      },
    },
  ]);

  const completionTrendRaw = await Task.aggregate([
    {
      $match: {
        user: userId,
        status: "completed",
        completedAt: {
          $gte: sevenDaysAgo,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$completedAt",
          },
        },
        completed: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const trendMap = new Map(
    completionTrendRaw.map((item) => [item._id, item.completed]),
  );

  const completionTrend = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(sevenDaysAgo);

    date.setDate(sevenDaysAgo.getDate() + index);

    const key = date.toISOString().slice(0, 10);

    completionTrend.push({
      date: key,
      completed: trendMap.get(key) || 0,
    });
  }

  const upcomingTasks = await Task.find({
    user: userId,
    status: "pending",
    deadline: {
      $gte: now,
    },
  })
    .populate("subject", "name")
    .sort({
      deadline: 1,
    })
    .limit(5);

  const completionRate =
    total === 0 ? 0 : Number(((completed / total) * 100).toFixed(1));

  res.status(200).json({
    success: true,

    summary: {
      total,
      completed,
      pending,
      overdue,
      upcoming,
      completedThisWeek,
      completionRate,
    },

    bySubject,

    byPriority,

    completionTrend,

    upcomingTasks,
  });
};
