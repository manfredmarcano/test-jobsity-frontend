import {
    createSlice,
    // createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

// import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import moment from 'moment';

type Task = {
    id: string;
    name: string;
    completed: boolean;
};

export type IReminder = {
    id: string;
    content: string;
    datetime: string;
    color: string;
    city: string;
};

type IReminderModal = {
    type: 'ADD' | 'VIEW';
    date?: string;
    id?: string;
};

type IEditModal = {
    date: string;
    id: string;
};

export type ToDoState = {
    /**
     * tasks data
     */
    tasks: {
        byId: {
            [key: string]: Task;
        };
        ids: string[];
    };
    month: string;
    reminders: {
        byId: {
            [key: string]: IReminder[]; // key = FECHA -> Cada fecha tendrá una lista de reminders
        };
        ids: string[];
    };
    reminderModal: IReminderModal;
};

export const initialToDoState: ToDoState = {
    tasks: {
        byId: {},
        ids: [],
    },
    month: moment().toISOString(),
    reminders: {
        byId: {},
        ids: [],
    },
    reminderModal: null,
};

const slice = createSlice({
    name: 'ToDo',
    initialState: initialToDoState,
    reducers: {
        taskAdded: (state, action: PayloadAction<Task>) => {
            const { id } = action.payload;
            state.tasks.byId[id] = action.payload;
            state.tasks.ids.push(id);
        },
        taskToggled: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.tasks.byId[id].completed = !state.tasks.byId[id].completed;
        },
        goToPreviousMonth: (state) => {
            state.month = moment(state.month)
                .subtract(1, 'months')
                .toISOString();
        },
        goToNextMonth: (state) => {
            state.month = moment(state.month).add(1, 'months').toISOString();
        },
        addReminder: (state, action: PayloadAction<IReminder>) => {
            const { datetime } = action.payload;
            const id: string = moment(datetime).format('YYYY-MM-DD').toString();
            if (state.reminders.ids.includes(id)) {
                state.reminders.byId[id].push(action.payload);
            } else {
                state.reminders.byId[id] = [action.payload];
                state.reminders.ids.push(id);
            }
        },
        openReminderModal: (state, action: PayloadAction<IReminderModal>) => {
            state.reminderModal = action.payload;
        },
        removeReminder: (state, action: PayloadAction<IEditModal>) => {
            const index = state.reminders.byId[action.payload.date].findIndex(
                (e) => e.id === action.payload.id
            );
            state.reminders.byId[action.payload.date].splice(index, 1);
            if (!state.reminders.byId[action.payload.date].length) {
                delete state.reminders.byId[action.payload.date];
                const index = state.reminders.ids.findIndex(
                    (e) => e === action.payload.date
                );
                state.reminders.ids.splice(index, 1);
            }
        },
        editReminder: (state, action: PayloadAction<IReminder>) => {
            const { datetime } = action.payload;
            const id: string = moment(datetime).format('YYYY-MM-DD').toString();
            const index = state.reminders.byId[id].findIndex(
                (e) => e.id === action.payload.id
            );
            state.reminders.byId[id][index] = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    taskAdded,
    taskToggled,
    goToPreviousMonth,
    goToNextMonth,
    addReminder,
    openReminderModal,
    removeReminder,
    editReminder,
} = slice.actions;

export default reducer;
