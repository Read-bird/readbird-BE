const getPlanTarget = (
    endDate: Date,
    totalPage: number,
    currentPage: number,
) => {
    const today: any = new Date();
    const masDate: any = new Date(endDate);

    return Math.floor(
        (totalPage - currentPage) / today.toISOString().split("T")[0] ===
            masDate.toISOString().split("T")[0]
            ? 1
            : Math.floor((masDate - today) / (1000 * 60 * 60 * 24)),
    );
};

export default getPlanTarget;
