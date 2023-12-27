import {
    Association,
    DataTypes,
    ForeignKey,
    Model,
    NonAttribute,
} from "sequelize";
import sequelize from "../index";
import { UserAttributes } from "../interface/User.interface";
import { BooksAttributes } from "../interface/Book.interface";
import { PlanAttributes } from "../interface/Plan.interface";
import { CharacterAttributes } from "../interface/Character.interface";
import { RecordAttributes } from "../interface/Record.interface";
import { CollectionAttributes } from "../interface/Collection.interface";

// User Class 정의
export class User extends Model<UserAttributes> {
    public readonly userId?: number;
    public email!: string;
    public nickName!: string;
    public imageUrl!: string;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    declare plans?: NonAttribute<Plan[]>;
    declare records?: NonAttribute<Record[]>;
    declare collection?: NonAttribute<Collection[]>;

    public static associations: {
        plans: Association<User, Plan>;
        records: Association<User, Record>;
        collection: Association<User, Collection>;
    };
}

export class Book extends Model<BooksAttributes> {
    public readonly bookId?: number;
    public title!: string;
    public author!: string;
    public pubDate?: string;
    public description?: string;
    public isbn?: string;
    public coverImage?: string;
    public publisher?: string;
    public totalPage?: number;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    declare plans?: NonAttribute<Plan[]>;

    public static associations: {
        plans: Association<Book, Plan>;
    };
}

export class Plan extends Model<PlanAttributes> {
    public readonly planId?: number;
    public totalPage!: number;
    public currentPage?: number;
    public status?: string;
    public startDate!: Date;
    public endDate!: Date;

    public userId!: ForeignKey<User["userId"]>;
    public bookId!: ForeignKey<Book["bookId"]>;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    declare records?: NonAttribute<Record[]>;

    public static associations: {
        records: Association<Plan, Record>;
        user: Association<Plan, User>;
        book: Association<Plan, Book>;
    };
}

export class Record extends Model<RecordAttributes> {
    public readonly recordId?: number;
    public status!: string;
    public successAt?: string;

    public userId!: ForeignKey<User["userId"]>;
    public planId!: ForeignKey<Plan["planId"]>;

    // 생성 날짜, 수정 날짜 자동 생성
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    declare plan?: NonAttribute<Plan>;

    public static associations: {};
}

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

export class Collection extends Model<CollectionAttributes> {
    public readonly collectionId?: number;
    public contents!: string;

    public userId!: ForeignKey<User["userId"]>;

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
        sequelize,
        modelName: "User",
        tableName: "Users", // Table name
        freezeTableName: true, //테이블명 변경 불가
    },
);

Book.init(
    {
        bookId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
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
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        isbn: {
            type: DataTypes.CHAR(10),
            allowNull: true,
        },
        coverImage: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        publisher: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        totalPage: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
            allowNull: true,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: "inProgress",
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Plan",
        tableName: "Plans",
        freezeTableName: true,
    },
);

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
            defaultValue: "success",
        },
        successAt: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Record",
        tableName: "Records",
        freezeTableName: true,
    },
);

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

Collection.init(
    {
        collectionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contents: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Collection",
        tableName: "Collections",
        freezeTableName: true,
    },
);

User.hasMany(Plan, {
    sourceKey: "userId",
    foreignKey: "userId",
    as: "plans",
});
Plan.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Record, {
    sourceKey: "userId",
    foreignKey: "userId",
    as: "records",
});
Record.belongsTo(User, { foreignKey: "userId" });

Book.hasMany(Plan, {
    sourceKey: "bookId",
    foreignKey: "bookId",
    as: "plans",
});
Plan.belongsTo(Book, { foreignKey: "bookId" });

Plan.hasMany(Record, {
    sourceKey: "planId",
    foreignKey: "planId",
    as: "records",
});
Record.belongsTo(Plan, { foreignKey: "planId" });

Collection.belongsTo(User, { targetKey: "userId" });
User.hasOne(Collection, {
    sourceKey: "userId",
});
