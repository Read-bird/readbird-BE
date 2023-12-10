import { DataTypes, Model } from "sequelize";
import sequelize from "../index";
import { RecordAttributes } from "../interface/Record.interface";
import { User } from "./User";
import { Plan } from "./Plan";

// User Class 정의
export class Record extends Model<RecordAttributes> {
    public readonly recordId?: number;
    public status!: string;
    public userId!: number;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {};
}

// DB에 초기화
Record.init(
    {
        recordId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "실패",
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "userId",
            },
        },
        planId: {
            type: DataTypes.INTEGER,
            references: {
                model: Plan,
                key: "planId",
            },
        },
    },
    {
        sequelize,
        modelName: "Record",
        tableName: "Record",
        freezeTableName: true,
    },
);
