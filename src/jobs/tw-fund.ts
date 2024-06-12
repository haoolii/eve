import axios from "axios";
import cheerio from "cheerio";
import Dayjs from "dayjs";
import { VM } from "vm2";
import db from "../db";

const main = async () => {
  const response = await axios.get(
    "https://announce.fundclear.com.tw/MOPSonshoreFundWeb/A01_11.jsp?fundId=18480065&navMonth=120"
  );
  const htmlContent = response.data;
  const $ = cheerio.load(htmlContent);
  const scriptTags = $("script");
  const target = scriptTags[13];
  const configString = $(target).html();

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

main();
