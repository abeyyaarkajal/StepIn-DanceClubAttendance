function isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
}

function getWorkingDays(month, year) {
    let workingDays = 0;
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        if (!isWeekend(date)) {
            workingDays++;
        }
    }

    return workingDays;
}

module.exports = {
    isWeekend,
    getWorkingDays,
};