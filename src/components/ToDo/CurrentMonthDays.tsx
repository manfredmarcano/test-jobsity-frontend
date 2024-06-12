import React from 'react';
import moment from 'moment';

export const CurrentMonthDays = () => {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    // const startOfMonth = moment().subtract(2, 'months').startOf('month');
    // const endOfMonth = moment().subtract(2, 'months').endOf('month');
    const days = [];

    for (let i = 0; i < +endOfMonth.format('DD'); i++) {
        // key: YYYY-MM-DD
        const monthDay = moment(startOfMonth).add(i, 'days');
        days.push(
            <div
                key={monthDay.format('YYYY-MM-DD').toString()}
                id={monthDay.format('YYYY-MM-DD').toString()}
            >
                <strong>{monthDay.format('DD')}</strong>
            </div>
        );
    }

    return <>{days}</>;
};
