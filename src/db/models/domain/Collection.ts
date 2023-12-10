import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { CollectionAttributes } from "../interface/Collection.interface";
import { User } from "./User";

// User Class 정의
export class Collection extends Model<CollectionAttributes> {
    public readonly collectionId?: number;
    public contents!: string;
    public userId!: number;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {};
}

// DB에 초기화
Collection.init(
    {
        collectionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contents: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "{}",
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "userId",
            },
        },
    },
    {
        sequelize,
        modelName: "Collection",
        tableName: "Collections",
        freezeTableName: true,
    },
);
