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

// db에서 찾은 도서 리스트 반환 데이터
let booklist: string | any = [];
const popularBook = async (list: any) => {
    for (const bookData of list) {
        if (bookData !== undefined) {
            // 데이터베이스에서 도서 조회
            let isbn = await Book.findOne({
                where: {
                    isbn: bookData.isbn,
                },
            });

            // 도서가 없으면 데이터베이스에 추가
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

            // 데이터베이스에서 도서 조회
            let bookObj = await Book.findOne({
                attributes: [
                    "bookId",
                    "title",
                    "pubDate",
                    "description",
                    "isbn",
                    "coverImage",
                    "publisher",
                    "totalPage",
                ],
                where: {
                    isbn: bookData.isbn,
                },
            });

            booklist.push(bookObj);
        }
    }

    return booklist;
};

export default {
    bookUpload,
    popularBook,
};
