import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { CharacterAttributes } from "../interface/Character.interface";

// User Class 정의
export class Character extends Model<CharacterAttributes> {
    public readonly characterId?: number;
    public name!: string;
    public content!: string;
    public imageUrl!: string;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {};
}

// DB에 초기화
Character.init(
    {
        characterId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Character",
        tableName: "Characters",
        freezeTableName: true,
    },
);
