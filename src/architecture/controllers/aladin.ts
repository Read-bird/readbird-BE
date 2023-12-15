require("dotenv").config();
import req from "request";

const ttbkey: String | undefined = process.env.ttbkey;
const BASE_URL: any = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?";

const options: any = {
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
export const aladinAPI: any = req(
    BASE_URL,
    //"http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?",
    options,
    function (err: Error, res, body) {
        console.log("\nerr ::: " + err);
        console.log("\nres ::: " + JSON.stringify(res));
        console.log("\nbody ::: " + body);
        return res.toJSON();
    },
);

console.log("\nresult ::: " + JSON.stringify(aladinAPI));

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
