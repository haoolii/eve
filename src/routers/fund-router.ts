import { Router } from "express";
import db from "../db";
import dayjs from "dayjs";

const router: Router = Router();

// records
router.get("/records", async (req, res, next) => {
  try {
    let fundId;

    if (typeof req.query.fundId !== "undefined") {
      fundId = req.query.fundId.toString();
    }

    if (!fundId) {
      return res.sendStatus(404);
    }

    const fundInfo = await db.twFundInfo.findFirst({
      where: { fundId },
    });

    if (!fundInfo) {
      throw new Error("not found coin info");
    }

    const records = await db.twFundRecord.findMany({
      where: {
        fundId: fundInfo.fundId,
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
