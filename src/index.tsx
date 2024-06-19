import './styles/index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

import configureAppStore, { getPreloadedState } from './store/configureStore';

import AppContextProvider from './contexts/AppContextProvider';

import { ToDoList } from '@components/ToDo/ToDoList';

(async () => {
    const preloadedState = getPreloadedState();

    const root = createRoot(document.getElementById('root'));

    root.render(
        <>
            {/* <React.StrictMode> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <ReduxProvider store={configureAppStore(preloadedState)}>
                    <AppContextProvider>
                        <ToDoList />
                    </AppContextProvider>
                </ReduxProvider>
            </LocalizationProvider>
            {/* </React.StrictMode> */}
        </>
    );
})();
