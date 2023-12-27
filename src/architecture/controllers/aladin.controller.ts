require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import aladinRepository from "../repositories/aladin.repository";

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

//도서 리스트를 담는 데이터
const list: any = [];

const getBookList = async (req: Request, res: Response, next: NextFunction) => {
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

        return res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
};

//db에서 불러온 도서 리스트를 담는 데이터
let bList: any = [];

const popularBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { data } = await axios.get(
            "http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbned46701325001&QueryType=Bestseller&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101",
        );

        //불러온 책 10개를 순회하여 각 책의 페이지 수를 조회함
        for (const sublist of data.item) {
            let { data } = await axios.get(
                "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=" +
                    ttbkey +
                    "&ItemId=" +
                    sublist.isbn +
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
                    title: sublist.title,
                    author: sublist.author,
                    pubDate: sublist.pubDate,
                    description: sublist.description,
                    isbn: sublist.isbn,
                    coverImage: sublist.cover,
                    publisher: sublist.publisher,
                    totalPage: totalPage.join(", "),
                };
                list.push(obj);
            }
        }
        //db에 존재하지 않을 경우 db에 책 정보를 저장
        bList = await aladinRepository.popularBook(list);

        res.status(200).json({
            bList,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getBookList,
    popularBook,
};
