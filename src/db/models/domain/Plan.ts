import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { PlanAttributes } from "../interface/Plan.interface";
import { User } from "./User";
import { Book } from "./Book";

// User Class 정의
export class Plan extends Model<PlanAttributes> {
    public readonly planId?: number;
    public totalPage!: number;
    public currentPage!: number;
    public status!: string;
    public startDate!: Date;
    public endDate!: Date;
    public userId!: number;
    public bookId!: number;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {};
}

// DB에 초기화
Plan.init(
    {
        planId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        totalPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currentPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "userId",
            },
        },
        bookId: {
            type: DataTypes.INTEGER,
            references: {
                model: Book,
                key: "bookId",
            },
        },
    },
    {
        sequelize,
        modelName: "Plan",
        tableName: "Plans",
        freezeTableName: true,
    },
);
