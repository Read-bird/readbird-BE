import { NextFunction, Request, Response } from "express";
import axios from "axios";

//알라딘 api 호출을 위한 개인키
const env = process.env;
const ALADIN_URL: String | undefined = env.ALADIN_URL;
const TTBKEY = [env.TTBKEY1, env.TTBKEY2, env.TTBKEY3, env.TTBKEY4];

const popularBook = async (req: Request, res: Response, next: NextFunction) => {
    //  #swagger.description = '인기 도서 Top 10을 불러올 수 있습니다'
    //  #swagger.tags = ['Book']
    /*  #swagger.responses[200] = {
            description: '도서 검색 성공',
            schema: {
                "bList": [
                    {
                        "bookId": 1,
                        "title": "제3인류 1",
                        "author": "베르나르 베르베르 지음, 이세욱 옮김",
                        "pubDate": "2013-10-21",
                        "description": "베르나르 베르베르 특유의 상상력으로 축조한 장대한 스케일의 과학 소설. 남극. 저명한 고생물학자 샤를 웰즈의 탐사대가 17미터에 달하는 거인의 유골들을 발굴한다. 그러나 인류사를 다시 쓰게 만들 이 중대한 발견은 발굴 현장의 사고와 함께 곧바로 파묻히고 마는데…",
                        "isbn": "8932916373",
                        "publisher": "열린책들",
                        "totalPage": 900,
                        "coverImage": "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg",
                        "list": "url"
                    }
                ]
            } 
        }*/
    try {
        const keyNum = Math.floor(Math.random() * 4);

        let { data } = await axios.get(
            ALADIN_URL +
                "/ItemList.aspx?ttbkey=" +
                TTBKEY[keyNum] +
                "&QueryType=Bestseller&MaxResults=10&start=1&Cover=Big&SearchTarget=Book&output=js&Version=20131101",
        );

        if (data.errorCode)
            throw new Error("Aladin Error : 다시 한번 시도해주세요!");

        let bookList = [];

        //불러온 책 10개를 순회하여 각 책의 페이지 수를 조회함
        for (const subList of data.item) {
            const { data: ItemLookUpData } = await axios.get(
                ALADIN_URL +
                    "/ItemLookUp.aspx?ttbkey=" +
                    TTBKEY[keyNum] +
                    "&ItemId=" +
                    subList.isbn +
                    "&output=JS",
            );

            //data가 String값으로 반환
            let pageStr = String(ItemLookUpData).slice(
                ItemLookUpData.indexOf("itemPage") + 10,
                ItemLookUpData.indexOf("itemPage") + 14,
            );

            let totalPage: any = pageStr.split(",").filter(Boolean);

            if (<number>totalPage > 1) {
                const obj = {
                    title: subList.title,
                    author: subList.author,
                    pubDate: subList.pubDate,
                    description: subList.description,
                    isbn: subList.isbn,
                    coverImage: subList.cover,
                    publisher: subList.publisher,
                    totalPage: totalPage.join(", "),
                    link: subList.link,
                };
                bookList.push(obj);
            }
        }

        res.status(200).json(bookList);
    } catch (error) {
        next(error);
    }
};

export default {
    popularBook,
};
