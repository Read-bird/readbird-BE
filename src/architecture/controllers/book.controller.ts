import { NextFunction, Request, Response } from "express";
import BookService from "../services/book.service";

class BookController {
    bookService = new BookService();

    searchBooks = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '검색어를 이용하여 도서를 검색할 수 있습니다.'
        //  #swagger.tags = ['Book']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['type'] = {
            in: "query",                            
            description: "검색 타입 = title || author 등 book에 있는 모든 키값",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['value'] = {
            in: "query",                            
            description: "검색어",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['page'] = {
            in: "query",                            
            description: "검색 할 페이지",                   
            required: false,                     
            type: "number",
            default : 1         
        } */
        /* #swagger.parameters['scale'] = {
            in: "query",                            
            description: "검색 할 도서의 개수",                   
            required: false,                     
            type: "number",
            default : 10    
        } */
        /*  #swagger.responses[200] = {
            description: '도서 검색 성공',
            schema: {
                "searchType": "author",
                "page": 1,
                "scale": 5,
                "totalCount": 8,
                "totalPage": 2,
                "bookList": [
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
            let { value, page, scale, type }: any = request.query;

            if (!value || value.length === 0)
                throw new Error("Bad Request : 검색어를 입력해주세요.");

            if (!page || page === null) page = 1;
            if (!scale || scale === null) scale = 10;
            if (!type || type === null) type = "all";

            const searchBookList = await this.bookService.searchAllBooks(
                value,
                page,
                scale,
                type,
            );

            response.status(200).json({
                searchType: type,
                page: Number(page),
                scale: Number(scale),
                totalCount: searchBookList.totalCount,
                totalPage: searchBookList.totalPage,
                bookList: searchBookList.bookList,
            });
        } catch (error) {
            next(error);
        }
    };

    getBookDetail = async (req: Request, res: Response, next: NextFunction) => {
        //  #swagger.description = 'bookId에 해당하는 도서의 상세 데이터를 보여줍니다'
        //  #swagger.tags = ['Book']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['bookId'] = {
            in: "param",                            
            description: "북 아이디",                   
            required: true,                     
            type: "number"         
        } */
        /*  #swagger.responses[200] = {
            description: '도서 검색 성공',
            schema: {
                "bookId": 1,
                "title": "title",
                "author": "author",
                "pubDate": "2023-12-23",
                "description": "description",
                "isbn": 222222,
                "publisher": "출판사",
                "totalPage": 233,
                "coverImage": "url",
            } 
        }*/
        try {
            const { bookId }: any = req.params;

            if (!bookId) throw new Error("Bad Request : BookId를 입력해주세요");
            const book = await this.bookService.getBookDetail(Number(bookId));

            if (book) {
                res.status(200).json({
                    bookId: book.bookId,
                    title: book.title,
                    author: book.author,
                    pubDate: book.pubDate,
                    description: book.description,
                    isbn: book.isbn,
                    publisher: book.publisher,
                    totalPage: book.totalPage,
                    coverImage: book.coverImage,
                });
            } else {
                res.status(400).send(
                    "Bad Request: 요청하신 BookId가 존재 하지 않습니다",
                );
            }
        } catch (error) {
            next(error);
        }
    };
}

export default BookController;
