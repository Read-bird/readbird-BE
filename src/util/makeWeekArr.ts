const makeWeekArr = (date: Date) => {
    let day = date.getDay();
    let week = [];
    for (let i = 0; i < 7; i++) {
        let newDate = new Date(date.valueOf() + 86400000 * (i - day));
        week.push(newDate);
    }
    return week;
};

export default makeWeekArr;
