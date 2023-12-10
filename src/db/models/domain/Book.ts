import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { BooksAttributes } from "../interface/Book.interface";

// User Class 정의
export class Book extends Model<BooksAttributes> {
    public readonly bookId?: number;
    public title!: string;
    public author!: string;
    public pubDate!: string;
    public description!: string;
    public isbn!: number;
    public coverImage!: string;
    public publisher!: string;
    public totalPage!: number;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {};
}

// DB에 초기화
Book.init(
    {
        bookId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        pubDate: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        isbn: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
        },
        coverImage: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        publisher: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        totalPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Book",
        tableName: "Books",
        freezeTableName: true,
    },
);
