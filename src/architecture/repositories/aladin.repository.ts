import { Book } from "../../db/models/domain/Tables";
// const bookCheck = (list: any) => {
//     return list.map(async (booklist: any) => {
//         const result = await Book.findOne({isbn:booklist.isbn});
//     });
// };

let result: number[] | any = 0;
const bookUpload = (list: any) => {
    list.map(async (bookData: any) => {
        if (bookData != undefined) {
            result = await Book.create({
                title: bookData.title,
                author: bookData.author,
                pubDate: bookData.pubDate,
                description: bookData.description,
                isbn: bookData.isbn,
                coverImage: bookData.coverImage,
                publisher: bookData.publisher,
                totalPage: bookData.totalPage,
            });
        }
    });
    return result;
};
export default {
    bookUpload,
};
