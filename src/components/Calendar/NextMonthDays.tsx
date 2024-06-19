import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectMonth } from '@store/ToDo/selectors';

export const NextMonthDays = () => {
    const month = useSelector(selectMonth);
    // console.log('MONTH NEXT: ', month);
    // console.log('MONTH NEXT: ', moment(month).format('YYYY-MM-DD'));

    const endOfMonth = moment(month).endOf('month');
    // const endOfMonth = moment().endOf('month');
    // const endOfMonth = moment().add(3, 'months').endOf('month');
    const days = [];
    const n: number = 7 - +endOfMonth.format('d');

    for (let i = 1; i < n; i++) {
        const nextDay = moment(endOfMonth).add(i, 'days');
        const id: string = nextDay.format('YYYY-MM-DD').toString();
        days.push(
            <div
                key={id}
                id={id}
                className={`border-t-2
                    ${
                        i === n - 1 ? 'border-r-2' : ''
                    } border-b-2 border-l-2 border-gray-400
                    ${+nextDay.format('d') === 6 ? 'bg-gray-200' : ''}
                    px-2 py-1
                `}
            >
                <h1 className="text-sm md:text-base font-semibold text-zinc-400">
                    {nextDay.format('D')}
                </h1>
            </div>
        );
    }

    return <>{days}</>;
};
