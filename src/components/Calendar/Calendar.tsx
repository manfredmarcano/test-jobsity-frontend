import React from 'react';

import { CurrentMonthDays } from '@components/Calendar/CurrentMonthDays';
import { NextMonthDays } from '@components/Calendar/NextMonthDays';
import { PreviousMonthDays } from '@components/Calendar/PreviousMonthDays';
import moment from 'moment';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { goToNextMonth, goToPreviousMonth } from '@store/ToDo/reducer';
import { selectMonth } from '@store/ToDo/selectors';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const defineDaysOfWeek = () => {
    const sm: string[] = [];
    const md: string[] = [];

    for (let i = 0; i < 7; i++) {
        md.push(moment().weekday(i).format('dddd'));
        sm.push(moment().weekday(i).format('dd'));
    }

    return { sm, md };
};

export const Calendar = () => {
    const daysOfWeek = defineDaysOfWeek();
    const dispatch = useDispatch();
    const month = moment(useSelector(selectMonth));
    const monthName: string = month.format('MMMM');
    const monthYear: string = month.format('YYYY');

    return (
        <div className="flex flex-col h-full">
            <div className="flex-none bg-neutral-100 flex justify-between items-center px-2 py-2">
                <h1 className="font-sans font-semibold text-slate-900">
                    {monthName} {monthYear}
                </h1>
                <div className="flex flex-row gap-x-2">
                    <Button
                        startIcon={<KeyboardArrowLeft />}
                        size="small"
                        onClick={() => dispatch(goToPreviousMonth())}
                    >
                        Previous Month
                    </Button>
                    <Button
                        endIcon={<KeyboardArrowRight />}
                        size="small"
                        onClick={() => dispatch(goToNextMonth())}
                    >
                        Next Month
                    </Button>
                </div>
            </div>
            <div className="flex-none bg-sky-600 text-white text-center py-0.5">
                <ul className="hidden md:grid grid-cols-7 font-semibold text-base">
                    {daysOfWeek.md.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
                <ul className="grid md:hidden grid-cols-7 text-sm font-normal">
                    {daysOfWeek.sm.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="grow grid grid-rows-6 grid-cols-7 h-0">
                <PreviousMonthDays />
                <CurrentMonthDays />
                <NextMonthDays />
            </div>
        </div>
    );
};
