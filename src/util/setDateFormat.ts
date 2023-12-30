const getDateFormat = (date: Date) => {
    return new Date(date.getTime() + 1000 * 60 * 60 * 9)
        .toISOString()
        .split("T")[0];
};

export default getDateFormat;
