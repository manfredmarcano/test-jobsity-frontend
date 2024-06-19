import './styles/index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import configureAppStore, { getPreloadedState } from './store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';
import { Calendar } from '@components/Calendar/Calendar';

(async () => {
    const preloadedState = getPreloadedState();

    const root = createRoot(document.getElementById('root'));

    root.render(
        <>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <ReduxProvider store={configureAppStore(preloadedState)}>
                    <AppContextProvider>
                        <div className="h-screen flex flex-col">
                            <div className="h-2/3 flex-none">
                                <Calendar />
                            </div>
                        </div>
                    </AppContextProvider>
                </ReduxProvider>
            </LocalizationProvider>
        </>
    );
})();
