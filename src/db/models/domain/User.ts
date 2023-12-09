import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { UserAttributes } from "../interface/User.interface";

// User Class 정의
export class User extends Model<UserAttributes> {
    public readonly userId?: number;
    public email!: string;
    public name!: string;
    public imageUrl!: string;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {};
}

// DB에 초기화
User.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        nickName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        modelName: "User",
        // Table name
        tableName: "Users",
        sequelize,
        freezeTableName: true,
    },
);
