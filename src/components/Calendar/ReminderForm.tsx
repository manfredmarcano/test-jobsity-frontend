import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Skeleton,
    TextField,
} from '@mui/material';
import {
    DatePicker,
    DateValidationError,
    TimePicker,
    TimeValidationError,
} from '@mui/x-date-pickers';
import {
    addReminder,
    editReminder,
    openReminderModal,
    removeReminder,
} from '@store/ToDo/reducer';
import { getReminderModal } from '@store/ToDo/selectors';
import { RootState } from '@store/configureStore';
import { reminderSchema } from '@utils/index';
import { useFormik } from 'formik';
import moment from 'moment';
import { MuiColorInput } from 'mui-color-input';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

interface IReminderValues {
    content: string;
    date: moment.Moment;
    time: moment.Moment;
    city: string;
    color: string;
    id: string;
}

export const ReminderForm = () => {
    const reminderModal = useSelector(getReminderModal);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [cityQuery, setCityQuery] = useState('');
    const [weather, setWeather] = useState('');
    const [debouncedValue] = useDebounce(cityQuery, 500);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (debouncedValue) {
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/forecast/daily?q=${debouncedValue}&cnt=1&appid=08a1e669f00f1fc6b382c56aa263ce4c`
                    );
                    setWeather(response.data.list[0].weather[0].main);
                } else {
                    setWeather('');
                }
            } catch (error) {
                setWeather('');
            }
        };
        fetchData();
    }, [debouncedValue]);

    const reminder = useSelector(
        (state: RootState) => state.ToDo.reminders.byId[reminderModal?.date]
    );

    console.log('remm: ', reminder);

    const initialValues: IReminderValues = {
        content: '',
        date: null,
        time: null,
        city: '',
        color: '',
        id: '',
    };

    const originalDate: string = reminderModal?.date;

    if (reminderModal?.type === 'ADD') {
        initialValues.content = '';
        initialValues.date = moment(reminderModal.date);
        initialValues.time = moment(reminderModal.date);
        initialValues.city = '';
        initialValues.color = '';
    } else if (reminderModal?.type === 'VIEW') {
        console.log('reminderModal: ', reminderModal);

        const reminderToView = reminder.find((e) => e.id === reminderModal.id);
        initialValues.content = reminderToView.content;
        initialValues.date = moment(reminderToView.datetime);
        initialValues.time = moment(reminderToView.datetime);
        initialValues.city = reminderToView.city;
        initialValues.color = reminderToView.color;
        initialValues.id = reminderToView.id;
    }

    const [errorDate, setErrorDate] = useState<DateValidationError | null>(
        null
    );

    const [errorTime, setErrorTime] = useState<TimeValidationError | null>(
        null
    );

    const handleClose = () => {
        setIsEditing(false);
        dispatch(openReminderModal(null));
    };

    const errorDateMessage = useMemo(() => {
        console.log('err:  ', errorDate);
        switch (errorDate) {
            // case 'maxDate':
            // case 'minDate': {
            // return 'Please select a date in the first quarter of 2022';
            // }
            case 'invalidDate': {
                return 'This date is not valid';
            }
            default: {
                return '';
            }
        }
    }, [errorDate]);

    const errorTimeMessage = useMemo(() => {
        console.log('err:  ', errorTime);
        switch (errorTime) {
            // case 'maxDate':
            // case 'minDate': {
            // return 'Please select a date in the first quarter of 2022';
            // }
            case 'invalidDate': {
                return 'This time is not valid';
            }
            default: {
                return '';
            }
        }
    }, [errorTime]);

    const formik = useFormik({
        initialValues: {
            content: initialValues.content,
            date: initialValues.date,
            time: initialValues.time,
            city: initialValues.city,
            color: initialValues.color,
        },
        onSubmit: (values, action) => {
            console.log(JSON.stringify(values, null, 2));

            if (reminderModal?.type === 'ADD') {
                dispatch(
                    addReminder({
                        id: performance.now().toString(),
                        city: values.city.trim(),
                        color: values.color.trim(),
                        content: values.content.trim(),
                        datetime:
                            moment(values.date).format('YYYY-MM-DD') +
                            ' ' +
                            moment(values.time).format('HH:mm'),
                    })
                );
            } else {
                if (originalDate !== moment(values.date).format('YYYY-MM-DD')) {
                    dispatch(
                        removeReminder({
                            date: originalDate,
                            id: initialValues.id,
                        })
                    );
                    dispatch(
                        addReminder({
                            id: performance.now().toString(),
                            city: values.city.trim(),
                            color: values.color.trim(),
                            content: values.content.trim(),
                            datetime:
                                moment(values.date).format('YYYY-MM-DD') +
                                ' ' +
                                moment(values.time).format('HH:mm'),
                        })
                    );
                } else {
                    // edit
                    dispatch(
                        editReminder({
                            id: initialValues.id,
                            city: values.city.trim(),
                            color: values.color.trim(),
                            content: values.content.trim(),
                            datetime:
                                moment(values.date).format('YYYY-MM-DD') +
                                ' ' +
                                moment(values.time).format('HH:mm'),
                        })
                    );
                }
            }

            setIsEditing(false);
            dispatch(openReminderModal(null));

            action.resetForm();
        },
        validationSchema: reminderSchema,
        enableReinitialize: true,
        validateOnMount: true,
    });

    console.log('[RENDERING: ReminderForm formik]: ', formik);
    console.log('[RENDERING: ReminderForm reminderModal]: ', reminderModal);
    console.log('originalDate: ', originalDate);

    return (
        <Dialog
            open={reminderModal !== null}
            onClose={handleClose}
            fullWidth={true}
        >
            <DialogTitle sx={{ paddingBottom: '10px' }}>
                {reminderModal ? (
                    (reminderModal?.type === 'ADD'
                        ? 'New '
                        : isEditing
                        ? 'Edit '
                        : '') + 'Reminder'
                ) : (
                    <Skeleton animation="wave" />
                )}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mt-2">
                        {reminderModal ? (
                            <TextField
                                // id="content"
                                name="content"
                                label="Enter Content *"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.content &&
                                    Boolean(formik.errors.content)
                                }
                                helperText={
                                    formik.touched.content &&
                                    formik.errors.content
                                }
                                disabled={
                                    reminderModal?.type === 'VIEW' && !isEditing
                                }
                            />
                        ) : (
                            <Skeleton animation="wave" />
                        )}
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            {reminderModal ? (
                                <DatePicker
                                    // id="date"
                                    name="date"
                                    //defaultValue={moment(reminderModal?.date)} // VER
                                    onError={(newError) =>
                                        setErrorDate(newError)
                                    }
                                    label="Select Date"
                                    value={formik.values.date}
                                    onChange={(value) => {
                                        // console.log('[RENDERING: ReminderForm CHANGE VALUE: ', value);
                                        // formik.setFieldValue('date', moment(value));
                                        formik.setFieldValue(
                                            'date',
                                            moment(value)
                                        );
                                    }}
                                    // onChange={formik.handleChange}
                                    className="w-full"
                                    format="YYYY-MM-DD"
                                    slotProps={{
                                        textField: {
                                            helperText: errorDateMessage,
                                            error: !!errorDateMessage,
                                            required: true,
                                        },
                                    }}
                                    disabled={
                                        reminderModal?.type === 'VIEW' &&
                                        !isEditing
                                    }
                                />
                            ) : (
                                <Skeleton animation="wave" />
                            )}
                        </div>
                        <div className="sm:col-span-3">
                            {reminderModal ? (
                                <TimePicker
                                    // id="time"
                                    name="time"
                                    onError={(newError) =>
                                        setErrorTime(newError)
                                    }
                                    label="Select Time"
                                    value={formik.values.time}
                                    onChange={(value) => {
                                        console.log('CHANGED TIME', value);
                                        formik.setFieldValue(
                                            'time',
                                            moment(value)
                                        );
                                    }}
                                    className="w-full"
                                    slotProps={{
                                        textField: {
                                            helperText: errorTimeMessage,
                                            error: !!errorTimeMessage,
                                            required: true,
                                        },
                                    }}
                                    disabled={
                                        reminderModal?.type === 'VIEW' &&
                                        !isEditing
                                    }
                                />
                            ) : (
                                <Skeleton animation="wave" />
                            )}
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            {reminderModal ? (
                                <TextField
                                    // id="city"
                                    name="city"
                                    label="Enter City *"
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    value={formik.values.city}
                                    // onChange={formik.handleChange}
                                    onChange={(value) => {
                                        console.log('CITY TIME', value);
                                        formik.setFieldValue(
                                            'city',
                                            value.target.value
                                        );
                                        setCityQuery(value.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.city &&
                                        Boolean(formik.errors.city)
                                    }
                                    helperText={
                                        formik.touched.city &&
                                        formik.errors.city
                                    }
                                    disabled={
                                        reminderModal?.type === 'VIEW' &&
                                        !isEditing
                                    }
                                />
                            ) : (
                                <Skeleton animation="wave" />
                            )}
                        </div>
                        <div className="sm:col-span-3">
                            {reminderModal ? (
                                <MuiColorInput
                                    id="color"
                                    name="color"
                                    label="Select Color *"
                                    className="w-full"
                                    autoComplete="off"
                                    value={formik.values.color}
                                    onChange={(value) => {
                                        formik.setFieldValue('color', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    format="hex"
                                    placeholder="#000000"
                                    error={
                                        formik.touched.color &&
                                        Boolean(formik.errors.color)
                                    }
                                    helperText={
                                        formik.touched.color &&
                                        formik.errors.color
                                    }
                                    disabled={
                                        reminderModal?.type === 'VIEW' &&
                                        !isEditing
                                    }
                                />
                            ) : (
                                <Skeleton animation="wave" />
                            )}
                        </div>
                        <div className="sm:col-span-3">
                            {reminderModal ? (
                                weather && (
                                    <>
                                        <span>Weather: </span>
                                        <Chip label={weather} />
                                    </>
                                )
                            ) : (
                                <Skeleton animation="wave" />
                            )}
                        </div>
                    </div>
                    {/* <div>
                        <pre>{JSON.stringify(formik.values, null, 2)}</pre>
                    </div> */}
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: '0 24px 16px 24px' }}>
                {reminderModal ? (
                    <>
                        <Button variant="contained" onClick={handleClose}>
                            {reminderModal?.type === 'VIEW'
                                ? 'Close'
                                : 'Cancel'}
                        </Button>

                        {reminderModal?.type === 'VIEW' ? (
                            <Button
                                variant="contained"
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {!isEditing ? 'Edit' : 'Cancel edition'}
                            </Button>
                        ) : null}

                        {reminderModal?.type === 'ADD' ||
                        (reminderModal?.type === 'VIEW' && isEditing) ? (
                            <Button
                                variant="contained"
                                type="button"
                                disabled={!formik.isValid}
                                onClick={() => formik.submitForm()}
                            >
                                {reminderModal?.type === 'VIEW'
                                    ? 'Save'
                                    : 'Add'}
                            </Button>
                        ) : null}
                    </>
                ) : (
                    <Skeleton animation="wave" />
                )}
            </DialogActions>
        </Dialog>
    );
};
