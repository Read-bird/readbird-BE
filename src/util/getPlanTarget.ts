import getDateFormat from "./setDateFormat";

const getPlanTarget = (
    endDate: Date | any,
    totalPage: number,
    currentPage: number,
) => {
    const today: any = new Date(getDateFormat(new Date()));

    if (
        today.getDate() === endDate.getDate() &&
        today.getMonth() === endDate.getMonth() &&
        today.getYear() === endDate.getYear()
    ) {
        return totalPage - currentPage;
    } else {
        return Math.floor(
            (totalPage - currentPage) /
                Math.floor((endDate - today) / (1000 * 60 * 60 * 24)),
        );
    }
};

export default getPlanTarget;
