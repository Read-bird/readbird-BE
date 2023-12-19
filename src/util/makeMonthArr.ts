const makeMonthArr = (date: Date) => {
    let day = date.getDate();
    console.log(date);
    console.log(day);
    let month = [];
    for (let i = 1; i < 32; i++) {
        let newDate = new Date(date.valueOf() + 86400000 * (i - day));
        if (newDate.getMonth() === date.getMonth()) month.push(newDate);
    }
    return month;
};

export default makeMonthArr;
