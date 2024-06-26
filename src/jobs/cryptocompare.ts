// Get All CoinList
// https://min-api.cryptocompare.com/data/all/coinlist?api_key={}

import axios from "axios";
import db from "../db";
import dayjs from "dayjs";

// Get BTC History Price
// https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000

// Access API KEY
// process.env.CRYPTO_COMPARE_API_KEY

const getQueryCoinList = () => {
  return axios.get(
    `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${process.env.CRYPTO_COMPARE_API_KEY}`
  );
};

const getQueryCoinHistory = (symbol: string) => {
  return axios.get(
    `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=2000&api_key=${process.env.CRYPTO_COMPARE_API_KEY}`
  );
};

const syncCoinList = async () => {
  try {
    const getQueryCoinListResponse = await getQueryCoinList();
    const data = getQueryCoinListResponse.data;
    const stacks = [];
    for (let [key, detail] of Object.entries(data["Data"])) {
      const coinInfo = detail as any;
      stacks.push({
        name: coinInfo["Name"],
        symbol: coinInfo["Symbol"],
        coinName: coinInfo["CoinName"],
        fullName: coinInfo["FullName"],
        contentCreatedOn: dayjs
          .unix(coinInfo["ContentCreatedOn"])
          .toISOString(),
      });
    }
    await db.coinInfo.createMany({
      data: stacks,
    });
    console.log("Done");
  } catch (err) {
    console.log(err);
  }
};

const syncCoinRecord = async (name: string) => {
  try {
    const coinInfo = await db.coinInfo.findFirst({ where: { name } });
    if (!coinInfo) return;
    const response = await getQueryCoinHistory(name);
    const data = response.data["Data"]["Data"] || [];

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      await db.coinRecord.upsert({
        where: {
          coinId_time: {
            coinId: coinInfo.id,
            time: dayjs.unix(record.time).toISOString(),
          },
        },
        create: {
          coinId: coinInfo.id,
          time: dayjs.unix(record.time).toISOString(),
          price: record.close,
        },
        update: {
          price: record.close,
        },
      });
    }
    console.log("Done");
  } catch (err) {
    console.log(err);
  }
};

// export const execute = async () => {};
syncCoinRecord("ETH");
