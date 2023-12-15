require("dotenv").config();
import express from "express";
const app = express();

const ttbkey: String | undefined = process.env.ttbkey;
const BASE_URL: String = "http://www.aladdin.co.kr/ttb/api/ItemSearch.aspx?";
//let array = [{}];

const options = {
    uri: BASE_URL,
    qs: {
        ttbkey: ttbkey,
        Query: "aladdin",
        QueryType: "Title",
        MaxResults: "10",
        start: "1",
        SearchTarget: "Book",
        output: "js",
    },
};
// app.get('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbned46701325001&Query=aladdin&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=xml&Version=20070901', async(req:Request, res:Response) ={
//     try{
//         const response:any = await axios.get()
//     }
// })
// const AladdinOpenAPIHandler = {
//     [Symbol.iterator](array: any) {
//         let nextIndex: number = 0;
//         return{
//             next: () => {
//                 return {
//                     value: this.array[nextIndex++],
//                     done: nextIndex < this.array.length,
//                 };
//             };
//         }
//     },
// };
