import getDateFormat from "./setDateFormat";

const getPlanTarget = (
    endDate: Date,
    totalPage: number,
    currentPage: number,
) => {
    const today: any = new Date(getDateFormat(new Date()));
    const masDate: any = new Date(endDate);

    if (today === masDate) return totalPage - currentPage;

    return Math.floor(
        (totalPage - currentPage) /
            Math.floor((masDate - today) / (1000 * 60 * 60 * 24)),
    );
};

export default getPlanTarget;
