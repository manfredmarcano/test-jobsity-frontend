import React from 'react';
import moment from 'moment';

export const NextMonthDays = () => {
    const endOfMonth = moment().endOf('month');
    // const endOfMonth = moment().subtract(2, 'months').endOf('month');
    const days = [];

    for (let i = 1; i < 7 - +endOfMonth.format('d'); i++) {
        // key: YYYY-MM-DD
        const nextDay = moment(endOfMonth).add(i, 'days');
        days.push(
            <div
                key={nextDay.format('YYYY-MM-DD').toString()}
                id={nextDay.format('YYYY-MM-DD').toString()}
            >
                <strong>{nextDay.format('DD')}</strong>
            </div>
        );
    }

    return <>{days}</>;
};
