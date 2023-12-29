import axios from "axios";
import { Book } from "../../db/models/domain/Tables";
import BookRepository from "../repositories/book.repository";

const ALADIN_URL: String | undefined = process.env.ALADIN_URL;
const TTBKEY: String | undefined = process.env.TTBKEY;

class BookService {
    bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository(Book);
    }

    searchAllBooks = async (
        value: string,
        page: number,
        scale: number,
        type: string,
    ) => {
        let searchType;

        if (type === "all") searchType = "Keyword";
        if (type === "title") searchType = "Title";
        if (type === "author") searchType = "Author";
        if (type === "publisher") searchType = "Publisher";

        const { data } = await axios.get(
            `${ALADIN_URL}/ItemSearch.aspx?&ttbkey=${TTBKEY}&Query=${value}&QueryType=${searchType}&Start=${page}&MaxResults=${scale}&SearchTarget=Book&Output=js&Version=20131101`,
        );

        let bookList: any = [];

        if (data.item) {
            for (let i = 0; i < data.item.length; i++) {
                const bookData = await axios.get(
                    `${ALADIN_URL}/ItemLookUp.aspx?ttbkey=${TTBKEY}&ItemId=${data.item[i].isbn}&output=js`,
                );

                const totalPage = bookData.data
                    .split(`\"itemPage\":`)[1]
                    .split(",")[0];

                bookList.push({
                    title: data.item[i].title,
                    author: data.item[i].author,
                    pubDate: data.item[i].pubDate,
                    description: data.item[i].description,
                    isbn: data.item[i].isbn,
                    coverImage: data.item[i].cover,
                    publisher: data.item[i].publisher,
                    totalPage,
                });
            }
        }

        return {
            totalCount: data.totalResults,
            totalPage: Math.ceil(data.totalResults / scale),
            bookList,
        };
    };

    getBookDetail = async (isbn: string) => {
        const { data } = await axios.get(
            `${ALADIN_URL}/ItemLookUp.aspx?ttbkey=${TTBKEY}&ItemId=${isbn}&output=js`,
        );

        const title = data.split(`알라딘 상품정보 - `)[1].split(`\"`)[0];
        const author = data.split(`author\" : \"`)[1].split(`\"`)[0];
        const pubDate = data.split(`publisher\":\"`)[1].split(`\"`)[0];
        const description = data
            .split(`description\" : \"`)[1]
            .split(`\"`)[0]
            .replace(/\\/gi, "");
        const publisher = data.split(`publisher\":\"`)[1].split(`\"`)[0];
        const totalPage = data.split(`itemPage\":`)[1].split(",")[0];
        const coverImage = data.split(`cover\":\"`)[1].split(`\"`)[0];

        return {
            title,
            author,
            pubDate,
            description,
            isbn,
            publisher,
            totalPage,
            coverImage,
        };
    };
}

export default BookService;
