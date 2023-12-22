require("dotenv").config();
import { Request, Response } from "express";
import axios from "axios";
import cron from "node-cron";
import { INTEGER, IntegerDataType } from "sequelize";
import aladinRepository from "../repositories/aladin.repository";
// import aladinRepository from "../repositories/aladin.repository";

//알라딘 api 호출을 위한 개인키
const ttbkey: String | undefined = process.env.ttbkey;

// async function monthlyFunction() {
//     const { data } = await axios.get(
//         "http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=" +
//             ttbkey +
//             "&QueryType=ItemNewAll&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101",
//     );
// }

// cron.schedule("0 0 1 * *", () => {
//     monthlyFunction();
// });

// const bookList: any = async () => {
//     const { data } = await axios.get(
//         "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=" +
//             ttbkey +
//             "&Query=aladdin&QueryType=Title&MaxResults=30&start=1&SearchTarget=Book&output=js&Version=20131101",
//     );
//     console.log("\nbookList::: " + JSON.stringify(data.item));
//     return data.item;
// };

const list: any = [];
const bList: any = [];
let i = 0;
const getBookList = async (req: Request, res: Response) => {
    try {
        for (let start = 1; start <= 1; start++) {
            //도서 리스트, 불러온 데이터: 호출 한번에 출력 개수 30개

            let {
                data: { item },
                //data
            } = await axios.get(
                "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=" +
                    ttbkey +
                    "&Query=all&QueryType=Title&MaxResults=50&start=" +
                    start +
                    "&SearchTarget=Book&output=js&Version=20131101",
            );
            list.push(item);
        }

        for (const sublist of list) {
            for (const book of sublist) {
                let { data } = await axios.get(
                    "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=" +
                        ttbkey +
                        "&ItemId=" +
                        book.isbn +
                        "&output=JS",
                );

                //data가 String값으로 반환
                let pageStr = data.slice(
                    data.indexOf("itemPage") + 10,
                    data.indexOf("itemPage") + 14,
                );

                let totalPage = pageStr.split(",").filter(Boolean);
                if (<number>totalPage > 1) {
                    const obj = {
                        title: book.title,
                        author: book.author,
                        pubDate: book.pubDate,
                        description: book.description,
                        isbn: book.isbn,
                        coverImage: book.cover,
                        publisher: book.publisher,
                        totalPage: totalPage.join(", "),
                    };
                    bList.push(obj);
                }
            }
        }
        let result = aladinRepository.bookUpload(bList);
        console.log("\nresult :: " + result);
        return res.status(200).json({ result });
    } catch (err) {
        console.error("aladinAPI error::: " + err);
        return res.status(500).json({ error: "내부 서버 오류" });
    }
};
export default getBookList;
