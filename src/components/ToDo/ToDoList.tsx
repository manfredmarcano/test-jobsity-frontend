import React from 'react';
import { TaskList } from './TaskList';
import { AddTask } from './AddTask';
import { PreviousMonthDays } from './PreviousMonthDays';
import { NextMonthDays } from './NextMonthDays';
import { CurrentMonthDays } from './CurrentMonthDays';

export const ToDoList = () => {
    return (
        <div className=" max-w-md mx-auto">
            <PreviousMonthDays />
            <hr />
            <CurrentMonthDays />
            <hr />
            <NextMonthDays />
            <AddTask />
            <TaskList />
        </div>
    );
};
