import React from 'react';
import moment from 'moment';

export const PreviousMonthDays = () => {
    const startOfMonth = moment().startOf('month');
    // const startOfMonth = moment().subtract(2, 'months').startOf('month');
    const days = [];

    for (let i = +startOfMonth.format('d'); i > 0; i--) {
        // key: YYYY-MM-DD
        const previousDay = moment(startOfMonth).subtract(i, 'days');
        days.push(
            <div
                key={previousDay.format('YYYY-MM-DD').toString()}
                id={previousDay.format('YYYY-MM-DD').toString()}
            >
                <strong>{previousDay.format('DD')}</strong>
            </div>
        );
    }

    return <>{days}</>;
};
