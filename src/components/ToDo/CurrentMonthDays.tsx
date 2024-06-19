import React from 'react';
import moment from 'moment';
import { Reminders } from '@components/Calendar/Reminders';
import { selectMonth } from '@store/ToDo/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { openReminderModal } from '@store/ToDo/reducer';
import { ReminderForm } from '@components/Calendar/ReminderForm';

export const REMINDER_CONTENT_MAX_LENGTH = 30;

export const CurrentMonthDays = () => {
    const dispatch = useDispatch();

    const month = useSelector(selectMonth);

    const handleClickOpen = (date: string) => {
        console.log('ID: ', date);
        // setOpen(true);
        dispatch(openReminderModal({ type: 'ADD', date }));
    };

    const startOfMonth = moment(month).startOf('month');
    const endOfMonth = moment(month).endOf('month');
    const days = [];
    const lastSaturdayOfMonth = moment(endOfMonth).day(-1).format('DD');

    for (let i = 0; i < +endOfMonth.format('DD'); i++) {
        const monthDay = moment(startOfMonth).add(i, 'days');
        const id: string = monthDay.format('YYYY-MM-DD').toString();
        const day: number = +monthDay.format('d');
        days.push(
            <div
                key={id}
                id={id}
                className={`
                    border-t-2 ${day === 6 ? 'border-r-2' : ''} border-l-2
                    ${i + 1 > +lastSaturdayOfMonth ? 'border-b-2' : ''}
                    border-gray-400 
                    ${
                        day === 0 || day === 6
                            ? 'bg-gray-200 hover:bg-gray-300'
                            : 'bg-zinc-50 hover:bg-gray-200'
                    }
                    transition duration-150 ease-out hover:ease-in
                    px-2 py-1 cursor-pointer
                    flex flex-col
                `}
                onClick={(e) => {
                    console.log('EEEE: ', e);
                    e.stopPropagation();
                    handleClickOpen(monthDay.toISOString());
                }}
            >
                <h1
                    className={`text-sm md:text-base font-semibold flex-none ${
                        day === 0 || day === 6 ? 'text-sky-500' : 'text-black'
                    }`}
                >
                    {monthDay.format('D')}
                </h1>

                <Reminders date={monthDay.toISOString()} />
            </div>
        );
    }

    return (
        <>
            {days}
            <ReminderForm />
        </>
    );
};
