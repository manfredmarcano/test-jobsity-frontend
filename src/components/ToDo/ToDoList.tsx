import React from 'react';
import { Calendar } from '@components/Calendar/Calendar';

export const ToDoList = () => {
    return (
        <div className="h-screen flex flex-col">
            <div className="h-2/3 flex-none">
                <Calendar />
            </div>
        </div>
    );
};
