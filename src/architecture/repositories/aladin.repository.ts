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

const bookFind = (list: any) => {
    list.map(async (bookData: any) => {
        if (bookData != undefined) {
            //db에 베스트 셀러 top 10을 조회
            let isbn = await Book.findOne({
                where: {
                    isbn: bookData.isbn,
                },
            });

            //db에 도서가 없을 경우 db에 새로운 도서 저장
            if (!isbn) {
                await Book.create({
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
        }
    });
};

export default {
    bookUpload,
    bookFind,
};
