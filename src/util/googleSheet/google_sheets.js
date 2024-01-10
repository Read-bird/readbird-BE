import { google } from "googleapis";
import {
    getFailedPlanPerPlan,
    getPlanSuccessPerPlanCreate,
    getRecordPerInProgressPlan,
    getTodayNewUser,
    today,
} from "./getData";

export default async function data() {
    const client = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY,
        ["https://www.googleapis.com/auth/spreadsheets"],
    );
    client.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return;
        } else {
            updateData(client);
        }
    });
    async function updateData(client) {
        const sheets = google.sheets({ version: "v4", auth: client });
        const getToday = today;
        const todayNewUser = await getTodayNewUser();
        const planSuccessPerPlanCreate =
            (await getPlanSuccessPerPlanCreate()) + "%";
        const recordPerInProgressPlan =
            (await getRecordPerInProgressPlan()) + "%";
        const failedPlanPerPlan = (await getFailedPlanPerPlan()) + "%";
        const todayData = new Array(
            getToday,
            "개발중",
            "개발중",
            recordPerInProgressPlan,
            failedPlanPerPlan,
            planSuccessPerPlanCreate,
            todayNewUser,
        );
        const request = {
            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
            range: "시트1!A1",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "OVERWRITE",
            resource: { values: new Array(todayData) },
        };
        await sheets.spreadsheets.values.append(request);
        return;
    }
}
