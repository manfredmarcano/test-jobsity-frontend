import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectMonth } from '@store/ToDo/selectors';

export const PreviousMonthDays = () => {
    const month = useSelector(selectMonth);
    // console.log('MONTH PREVIOUS: ', month);
    // console.log('MONTH PREVIOUS: ', moment(month).format('YYYY-MM-DD'));

    const startOfMonth = moment(month).startOf('month');
    // console.log('startOfMonth: ', startOfMonth.format('d'));
    // const startOfMonth = moment().startOf('month');
    // const startOfMonth = moment().add(3, 'months').startOf('month');
    const days = [];

    for (let i = +startOfMonth.format('d'); i > 0; i--) {
        const previousDay = moment(startOfMonth).subtract(i, 'days');
        const id: string = previousDay.format('YYYY-MM-DD').toString();
        days.push(
            <div
                key={id}
                id={id}
                className={`border-t-2 border-l-2 border-gray-400
                    ${+previousDay.format('d') === 0 ? 'bg-gray-200' : ''}
                    px-2 py-1
                `}
            >
                <h1 className="text-sm md:text-base font-semibold text-zinc-400">
                    {previousDay.format('D')}
                </h1>
            </div>
        );
    }

    return <>{days}</>;
};
