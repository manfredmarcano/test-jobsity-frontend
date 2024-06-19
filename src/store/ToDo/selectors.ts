import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

export const selectAllTasks = createSelector(
    (state: RootState) => state.ToDo.tasks,
    (tasks) => {
        const { byId, ids } = tasks;
        return ids.map((id) => byId[id]);
    }
);

export const selectMonth = createSelector(
    (state: RootState) => state.ToDo.month,
    (month) => month
);

export const getReminderModal = createSelector(
    (state: RootState) => state.ToDo.reminderModal,
    (reminderModal) => reminderModal
);
