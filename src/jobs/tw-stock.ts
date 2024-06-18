// https://fubon-ebrokerdj.fbs.com.tw/Z/ZC/ZCW/CZKC1.djbcd?a=2330&b=D&c=1

import axios from "axios";
import * as CSV from "csv-string";

const syncFund = async () => {
  const response = await axios.get(
    `https://fubon-ebrokerdj.fbs.com.tw/Z/ZC/ZCW/CZKC1.djbcd?a=2330&b=D&c=1200`
    // { responseType: "arraybuffer" }
  );

  //   const arr = CSV.parse(response.data);
  let arr = response.data.split(" ");
  let dates = arr[0].split(",");
  let prices = arr[4].split(",");
  console.log(dates[0])
  console.log('dates.length', dates.length)
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

syncFund();
