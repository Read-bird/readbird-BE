require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import aladinRepository from "../repositories/aladin.repository";

//알라딘 api 호출을 위한 개인키
const TTBKEY: String | undefined = process.env.TTBKEY;

const popularBook = async (req: Request, res: Response, next: NextFunction) => {
    //도서 리스트를 담는 데이터
    const list: any = [];
    //(도서 정보 + 페이지 수) 도서 리스트를 담는 데이터
    let bList: any = [];
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
                        "coverImage": "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg"
                    }
                ]
            } 
        }*/

    try {
        let {
            data: { item },
        } = await axios.get(
            "http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=" +
                TTBKEY +
                "&QueryType=Bestseller&MaxResults=10&start=1&Cover=Big&SearchTarget=Book&output=js&Version=20131101",
        );

        //불러온 책 10개를 순회하여 각 책의 페이지 수를 조회함
        for (const sublist of item) {
            const { data: ItemLookUpData } = await axios.get(
                "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=" +
                    TTBKEY +
                    "&ItemId=" +
                    sublist.isbn +
                    "&output=JS",
            );

            if (typeof ItemLookUpData === "string") {
                //data가 String값으로 반환
                let pageStr = ItemLookUpData.slice(
                    ItemLookUpData.indexOf("itemPage") + 10,
                    ItemLookUpData.indexOf("itemPage") + 14,
                );
                let totalPage: any = pageStr.split(",").filter(Boolean);

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
            } else {
                console.error("itemLookUpData is not a string:");
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
    popularBook,
};
