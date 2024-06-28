import { Router } from "express";
import db from "../db";
import dayjs from "dayjs";

const router: Router = Router();

// records
router.get("/records", async (req, res, next) => {
  try {
    let stockId;

    if (typeof req.query.stockId !== "undefined") {
      stockId = req.query.stockId.toString();
    }

    if (!stockId) {
      return res.sendStatus(404);
    }

    const stockInfo = await db.twStockInfo.findFirst({
      where: { stockId },
    });

    if (!stockInfo) {
      throw new Error("not stock info");
    }

    const records = await db.twStockRecord.findMany({
      where: {
        stockId: stockInfo.stockId,
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
