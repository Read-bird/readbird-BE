import { google } from "googleapis";
import {
    getFailedPlanPerPlan,
    getPlanByTodayNewUser,
    getPlanSuccessPerPlanCreate,
    getRecordPerInProgressPlan,
    getTodayDAU,
    getTodayNewUser,
    getTodayTouchPerCreatePlan,
} from "./getData";
import getDateFormat from "../setDateFormat";

export default async function data() {
    try {
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
        const newDate = new Date();
        const today = getDateFormat(
            new Date(newDate.setDate(newDate.getDate() - 1)),
        );

        async function updateData(client) {
            const sheets = google.sheets({ version: "v4", auth: client });

            const todayNewUser = await getTodayNewUser(today);

            const planSuccessPerPlanCreate =
                (await getPlanSuccessPerPlanCreate()) + "%";

            const recordPerInProgressPlan =
                (await getRecordPerInProgressPlan()) + "%";
            const failedPlanPerPlan = (await getFailedPlanPerPlan(today)) + "%";

            const getDAU = await getTodayDAU(today);

            const getTouchPerCreatePlan =
                (await getTodayTouchPerCreatePlan(today)) + "%";

            const planByTodayNewUserPerTodayNewUser =
                (todayNewUser === 0
                    ? 0
                    : Math.round(
                          (await getPlanByTodayNewUser(today)) / todayNewUser,
                      ) * 100
                ).toFixed(2) + "%";

            const todayData = new Array(
                today,
                getDAU,
                getTouchPerCreatePlan,
                recordPerInProgressPlan,
                failedPlanPerPlan,
                planSuccessPerPlanCreate,
                todayNewUser,
                planByTodayNewUserPerTodayNewUser,
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
    } catch (error) {
        console.error(error);
    }
}
