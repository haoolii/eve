import { NextFunction, Request, Response, Router } from "express";
import db from "../db";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";

const adapter = (
  records: {
    coinId: string;
    time: Date;
    price: Decimal;
    createdAt: Date;
    updatedAt: Date;
  }[]
) => {
  const output = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    output.push([dayjs(record.time).unix(), record.price, record.time]);
  }
  return output;
};

const router: Router = Router();

router.get('/info', async ( req, res) => {
// req.params
res.send({
    params: JSON.stringify(req.query),

})
})

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      throw new Error("Error");
    }

    const coinInfo = await db.coinInfo.findFirst({
      where: { name: symbol.toString() },
    });

    if (!coinInfo) {
      throw new Error("Error");
    }

    const coinRecords = await db.coinRecord.findMany({
      where: {
        coinId: coinInfo.id,
      },
    });

    res.json({
      code: 0,
      message: "",
      data: {
        info: coinInfo,
        records: adapter(coinRecords),
      },
    });
  } catch (err) {
    res.json({
      code: 404,
      message: JSON.stringify(err),
      data: null,
    });
  }
});

export { router };
