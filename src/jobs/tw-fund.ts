import axios from "axios";
import cheerio from "cheerio";
import Dayjs from "dayjs";
import { VM } from "vm2";
import db from "../db";
import fs from 'fs';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc)
const main = async () => {
  const response = await axios.get(
    "https://announce.fundclear.com.tw/MOPSonshoreFundWeb/A01_11.jsp?fundId=18480065&navMonth=1" 
  , { responseType: 'arraybuffer'});
  // const htmlContent = response.data;
  const htmlContent = iconv.decode(response.data, 'Big5');

  const $ = cheerio.load(htmlContent, { decodeEntities: false });
  const scriptTags = $("script");
  const target = scriptTags[13];
  const configString = $(target).html();

  
  const text = $('td.componentTitle font').contents().first().text();
  const pureText = text.replace(/[\n\s"]/g, '')

  return;
  if (configString) {
    const vm = new VM();
    const script = `
          (function() {
            ${configString}
            return config;
          })();
        `;
    const config = vm.run(script);
    const dates = config.data.labels;
    const prices = config.data.datasets[0].data;
    const result: {
      date: string;
      price: number;
    }[] = [];
    if (dates.length !== prices.length) {
      throw "API Data have some issue";
    }
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const price = prices[i];
      result.push({
        date: Dayjs(date).toISOString(),
        price,
      });
    }
    console.log(result);

    for (let i = 0; i < result.length; i++) {
      const d = result[i];
      //   await db.record.upsert({
      //     where: {
      //       sourceDate: {
      //         date: d.date,
      //         sourceId: "9f329ad2-6184-4a8b-9b36-02a8d1f40005",
      //       },
      //     },
      //     create: {
      //       price: d.price,
      //       date: d.date,
      //       sourceId: "9f329ad2-6184-4a8b-9b36-02a8d1f40005",
      //     },
      //     update: {
      //       price: d.price,
      //       sourceId: "9f329ad2-6184-4a8b-9b36-02a8d1f40005",
      //     },
      //   });
    }

    // const records = await db.record.createMany({
    //   data: result.map((d) => ({
    //     date: d.date,
    //     price: d.price,
    //     sourceId: "9f329ad2-6184-4a8b-9b36-02a8d1f40005",
    //   })),
    // });
  } else {
    console.log("未找到config对象");
  }
};

const syncFund = async (fundId: string) => {
  const response = await axios.get(
    `https://announce.fundclear.com.tw/MOPSonshoreFundWeb/A01_11.jsp?fundId=${fundId}&navMonth=120`
  , { responseType: 'arraybuffer'})

  const htmlContent = iconv.decode(response.data, 'Big5');
  const $ = cheerio.load(htmlContent, { decodeEntities: false });
  const scriptTags = $("script");
  const target = scriptTags[13];
  const configString = $(target).html();

  const fundNameSource = $('td.componentTitle font').contents().first().text();
  const fundName = fundNameSource.replace(/[\n\s"]/g, '')

  let fundInfo = await db.twFundInfo.findFirst({ where: { fundId }});

  if (!fundInfo) {
    fundInfo =await db.twFundInfo.create({ data: {
      fundId,
      fundName
    }})
  }

  // Parse Record
  if (configString) {
    const vm = new VM();
    const script = `
          (function() {
            ${configString}
            return config;
          })();
        `;
    const config = vm.run(script);
    const dates = config.data.labels;
    const prices = config.data.datasets[0].data;
    const result: {
      date: string;
      price: number;
    }[] = [];
    if (dates.length !== prices.length) {
      throw "API Data have some issue";
    }
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const price = prices[i];
      result.push({
        date: dayjs.utc(date).toISOString(),
        price,
      });
    }

    for (let i = 0; i < result.length; i++) {
      const record = result[i];
      await db.twFundRecord.upsert({
        where: {
          fundId_time: {
            fundId: fundInfo.fundId,
            time: record.date,
          }
        },
        create: {
          time: record.date,
          price: record.price,
          fundId: fundInfo.fundId,
        },
        update: {
          price: record.price
        }
      })
    }

    console.log('Success');
  } else {
    console.log("未找到config对象");
  }
  
}
const testDate = () => {
//   console.log(dayjs.utc('2024/05/17').toISOString())
// console.log(dayjs('2024/06/04').utc().toISOString())
}
// testDate()
syncFund('18480065')
// main();
