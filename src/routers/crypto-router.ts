import { Router } from "express";
import db from "../db";
import dayjs from "dayjs";

const router: Router = Router();

// records
router.get("/records", async (req, res, next) => {
  try {
    let symbol;

    if (typeof req.query.symbol !== "undefined") {
      symbol = req.query.symbol.toString();
    }

    if (!symbol) {
      return res.sendStatus(404);
    }

    const coinInfo = await db.coinInfo.findFirst({
      where: { name: symbol },
    });

    if (!coinInfo) {
      throw new Error("not found coin info");
    }

    const records = await db.coinRecord.findMany({
      where: {
        coinId: coinInfo.id,
      },
    });

    res.json({
      status: 0,
      msg: "success",
      data: {
        records: records.map((record) => [
          dayjs(record.time).unix(),
          record.price,
        ]),
      },
    });
  } catch (err) {
    res.sendStatus(400);
  }
});

export { router };
