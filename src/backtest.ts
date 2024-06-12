// import winston from "winston";
import db from "./db";
import dayjs from "dayjs";
import { logger } from "./logger";

const getDurationDateByIntervalDays = ({
  intervalDays,
  start,
  end,
}: {
  intervalDays: number;
  start: string;
  end: string;
}) => {
  let current = dayjs(start);
    let result = [];
//   console.log(start);
//   console.log(end);
    while (current.isBefore(dayjs(end)) || current.isSame(dayjs(end))) {
      result.push(current.toISOString());
      current = current.add(intervalDays, "day");
    }

    return result;
};

export const backtest = async () => {
  try {
    // const btcInfo = await db.coinInfo.findFirst({ where: { name: "BTC" } });
    // logger.info(btcInfo);
    const start = dayjs("2021-01-01T00:00:00.000Z").toISOString();
    const end = dayjs("2024-06-12T00:00:00.000Z").toISOString();
    const intervalDays = 30;
    const result = getDurationDateByIntervalDays({ start, end, intervalDays });
    logger.info(result);

    // const records = await db.coinRecord.findFirst({
    //   where: {
    //     time: {
    //       gte: startDate,
    //     },
    //   },
    //   orderBy: {
    //     time: "asc",
    //   },
    // });

    // logger.info(records);
  } catch (err) {
    logger.error(err);
  }
};
