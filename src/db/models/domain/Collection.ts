import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { CollectionAttributes } from "../interface/Collection.interface";

// User Class 정의
export class Collection extends Model<CollectionAttributes> {
    public readonly collectionId?: number;
    public contents!: string;

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
    },
    {
        modelName: "Collection",
        // Table name
        tableName: "Collections",
        sequelize,
        freezeTableName: true,
    },
);
