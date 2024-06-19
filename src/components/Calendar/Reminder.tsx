import { Grid, Popover } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { openReminderModal } from '@store/ToDo/reducer';
import { getTextColor, hexToRgba } from '@utils/index';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

type IReminderItem = {
    id: string;
    content: string;
    color: string;
    datetime: string;
};

interface IPropsReminder {
    item?: IReminderItem;
    reminderSlotHeight: number;
    reminderSlotGap: number;
    dayOfWeek?: number;
    hiddenItems?: number;
    items?: IReminderItem[];
}

export const Reminder = ({
    item,
    reminderSlotHeight,
    reminderSlotGap,
    hiddenItems = null,
    dayOfWeek = null,
    items = [],
}: IPropsReminder) => {
    const dispatch = useDispatch();
    const [isHover, setIsHover] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'simple-popover' : undefined;

    return (
        <>
            {!hiddenItems ? (
                <Tooltip title={item.content} arrow placement="right-start">
                    <div
                        className={`${
                            getTextColor(item.color) === 'white'
                                ? 'text-white'
                                : 'text-black'
                        }
                            cursor-pointer font-sans text-xs font-semibold px-1 rounded shadow-md
                            transition duration-150 ease-out hover:ease-in truncate`}
                        style={{
                            height: `${reminderSlotHeight}px`,
                            lineHeight: `${reminderSlotHeight}px`,
                            marginBottom: `${reminderSlotGap}px`,
                            backgroundColor: isHover
                                ? hexToRgba(item.color, 0.7)
                                : item.color,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                                openReminderModal({
                                    type: 'VIEW',
                                    id: item.id,
                                    date: moment(item.datetime).format(
                                        'YYYY-MM-DD'
                                    ),
                                })
                            );
                            // alert('REMINDER');
                        }}
                        role="button"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {item.content}
                    </div>
                </Tooltip>
            ) : (
                <button
                    className={`bg-transparent ${
                        !!dayOfWeek && (dayOfWeek === 0 || dayOfWeek === 6)
                            ? 'hover:bg-gray-200'
                            : 'hover:bg-gray-300'
                    } cursor-pointer text-black font-sans text-xs font-semibold px-1 rounded
                    transition duration-150 ease-out hover:ease-in truncate`}
                    style={{
                        height: `${reminderSlotHeight}px`,
                        lineHeight: `${reminderSlotHeight}px`,
                        marginBottom: `${reminderSlotGap}px`,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        // e.preventDefault();
                        handleMoreClick(e);
                    }}
                    aria-describedby={popoverId}
                >
                    {hiddenItems} más
                </button>
            )}
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="container mx-auto px-2 pt-2 min-w-[120px]">
                    <p className="font-sans text-center text-sm text-slate-500">
                        {moment(items[0]?.datetime).format('ddd')}
                    </p>
                    <p className="font-sans text-center mb-2">
                        {moment(items[0]?.datetime).format('D')}
                    </p>

                    {items.map((elem, i) => (
                        <div className="mb-2" key={i}>
                            <Reminder
                                item={elem}
                                reminderSlotHeight={reminderSlotHeight}
                                reminderSlotGap={reminderSlotGap}
                            />
                        </div>
                    ))}
                </div>

                {/* <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {items.map((elem, i) => (
                            <Reminder
                                key={i}
                                item={elem}
                                reminderSlotHeight={reminderSlotHeight}
                                reminderSlotGap={reminderSlotGap}
                            />
                        ))}
                    </Grid>
                </Grid> */}

                {/* <ul>
                    {items.map((elem, i) => (
                        <Reminder
                            key={i}
                            item={elem}
                            reminderSlotHeight={reminderSlotHeight}
                            reminderSlotGap={reminderSlotGap}
                        />
                    ))}
                </ul> */}
                {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
            </Popover>
        </>
    );
};
