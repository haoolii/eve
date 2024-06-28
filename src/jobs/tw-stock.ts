// https://fubon-ebrokerdj.fbs.com.tw/Z/ZC/ZCW/CZKC1.djbcd?a=2330&b=D&c=1

import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import db from "../db";
dayjs.extend(utc);

const delay = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
const syncFund = async () => {
  const response = await axios.get(
    `https://fubon-ebrokerdj.fbs.com.tw/Z/ZC/ZCW/CZKC1.djbcd?a=2330&b=D&c=1200`
    // { responseType: "arraybuffer" }
  );

  //   const arr = CSV.parse(response.data);
  let arr = response.data.split(" ");
  let dates = arr[0].split(",");
  let prices = arr[4].split(",");
  console.log(dates[0]);
  console.log("dates.length", dates.length);
  if (dates.length !== prices.length) {
    throw "Something wrong";
  }
  const data = [];

  for (let i = 0; i < dates.length; i++) {
    data.push({
      date: dates[i],
      price: prices[i],
    });
  }

  console.log({
    data,
  });
};

function convertROCToGregorian(rocDate: string) {
  // 解析民國日期
  const [rocYear, month, day] = rocDate.trim().split("/").map(Number);

  // 將民國年份轉換為西元年份
  const gregorianYear = rocYear + 1911;

  // 格式化月份和日期
  const monthString = month < 10 ? "0" + month : month.toString();
  const dayString = day < 10 ? "0" + day : day.toString();

  // 拼接成西元日期格式
  const date = dayjs.utc(`${gregorianYear}-${month}-${day}`);

  return date.toISOString();
}

const generateMonthlyDates = (
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
) => {
  const dates = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const monthString = month < 10 ? `0${month}` : month;
    const dateString = `${year}${monthString}01`;
    dates.push(dateString);

    if (month === 12) {
      month = 1;
      year++;
    } else {
      month++;
    }
  }
  return dates;
};

const syncFund2 = async () => {
  const startYear = 1999;
  const startMonth = 1;
  const endYear = 2024;
  const endMonth = 6;
  // https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG?date=19990101&stockNo=2603&response=json
  const monthlyDates = generateMonthlyDates(
    startYear,
    startMonth,
    endYear,
    endMonth
  );

  const response = await axios.get(
    `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG?date=19990101&stockNo=2330&response=json`
  );

  // console.log(response?.data?.data)
  // console.log(convertROCToGregorian('88/01/01'))

  // console.log("monthlyDates", monthlyDates);
};

const fetchTWSE = async (stock: string, dateString: string) => {
  const response = await axios.get(
    `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG?date=${dateString}&stockNo=${stock}&response=json`
  );
  const data = response?.data?.data || [];
  let safeData = [];
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    try {
      const time = convertROCToGregorian(datum[0]);
      safeData.push({
        time: time,
        price: datum[1],
      });
    } catch (err) {
      console.log("err: ", err);
    }
  }
  return safeData;
};

const fetchRangeTWSE = async (symbol: string, dates: string[]) => {
  let delayms = 2000;
  let result = [];
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    console.log(`START Fetch: ${date}`);
    const list = await fetchTWSE(symbol, date);
    for (let item of list) {
      result.push(item);
    }
    console.log(`Finish Fetch: ${date}`);
    console.log(`Delay: ${delayms}`);
    await delay(delayms);
  }
  return result;
};

const test = async () => {
  const startYear = 2020;
  const startMonth = 1;
  const endYear = 2024;
  const endMonth = 6;
  const dateStrings = generateMonthlyDates(
    startYear,
    startMonth,
    endYear,
    endMonth
  );
  const stockId = "00631L";
  const records = await fetchRangeTWSE(stockId, dateStrings);

  records.forEach(async (record) => {
    await db.twStockRecord.upsert({
      where: {
        stockId_time: {
          stockId: stockId,
          time: record.time,
        },
      },
      create: {
        time: record.time,
        price: record.price,
        stockId: stockId,
      },
      update: {
        price: record.price,
      },
    });
  });
  // console.log(res)

  // const response = await axios.get(
  //   `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG?date=19990101&stockNo=2&response=json`
  // );
  // const res = await fetchTWSE("2330", "19990101");
  // console.log("res", res);
  // console.log(response.data);
};
test();
// syncFund2();

// syncFund();
