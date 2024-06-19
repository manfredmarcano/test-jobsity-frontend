import React, { useEffect, useRef, useState } from 'react';
import { Reminder } from './Reminder';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '@store/configureStore';

interface IPropsReminders {
    date: string;
}

const reminderSlotHeight: number = 22;
const reminderSlotGap: number = 2;

export const Reminders = ({ date }: IPropsReminders) => {
    const [numVisibleSlots, setNumVisibleSlots] = useState(0);
    const ref = useRef(null);

    // const remindersList = useSelector(getRemindersFromDate('d'));

    const id: string = moment(date).format('YYYY-MM-DD').toString();

    const remindersList =
        useSelector((state: RootState) => state.ToDo.reminders.byId[id]) || [];
    /* const remindersList =
        useSelector((state: RootState) => state.ToDo.reminders.byId[id]).sort(
            (a, b) =>
                new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        ) || [];
    */
    console.log('remindersList: ', remindersList);

    const calculateNumVisibleSlots = () => {
        const height: number = ref.current.getBoundingClientRect().height;
        console.log('height: ', height);

        setNumVisibleSlots(
            Math.floor(height / (reminderSlotHeight + reminderSlotGap))
        );
    };

    /* const remindersList = [
        {
            id: 'POR CALCULAR AÚN',
            content: 'Reminder #1',
            color: '#3b0673',
            // dayOfWeek: +moment(date).format('d'),
        },
        {
            id: 'POR CALCULAR AÚN',
            content: 'Reminder #2',
            color: '#afafc6',
            // dayOfWeek: +moment(date).format('d'),
        },
        {
            id: 'POR CALCULAR AÚN',
            content: 'Reminder #3',
            color: '#00d5ff',
            // dayOfWeek: +moment(date).format('d'),
        },
    ]; */

    useEffect(() => {
        console.log('[ Reminders RENDERED ] Item: ' + date);

        // if (typeof remindersList === 'undefined' || remindersList?.length === 0) return;

        /* if (numVisibleSlots <= 0) {
            return;
        } */

        // const height: number = ref.current.getBoundingClientRect().height;
        // console.log('height1: ', height);
        // setHeight(ref.current.getBoundingClientRect().height);
        window.addEventListener('resize', calculateNumVisibleSlots, false);

        /* setNumVisibleSlots(
            Math.floor(height / (reminderSlotHeight + reminderSlotGap))
        ); */

        // if (item !== '18') return null;

        // if (numVisibleSlots > 0) {
        calculateNumVisibleSlots();
        // }
    }, [numVisibleSlots]);

    // let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // arr = arr.slice(0, 4)
    // [1, 2, 3, 4]

    // console.log(item);
    // if (item !== '18') return <></>;

    const listLength: number = remindersList?.length ?? 0;

    console.log('');
    console.log('[Reminders] / remindersList.length: ', listLength);
    console.log('[Reminders] / numVisibleSlots: ', numVisibleSlots);

    /*
    const remindersListToShow: string[] =
        remindersList.length > numVisibleSlots
            ? remindersList.slice(0, numVisibleSlots - 1)
            : remindersList;
    */

    // Lista: 3 | numVisibleSlots: 3 = FULL
    // Lista: 2 | numVisibleSlots: 3 = FULL
    // Lista: 3 | numVisibleSlots: 2 = PARCIAL
    // Lista: 2 | numVisibleSlots: 2 = FULL
    // Lista: 2 | numVisibleSlots: 1 = PARCIAL
    // Lista: 1 | numVisibleSlots: 2 = FULL
    // Lista: 4 | numVisibleSlots: 1 = PARCIAL OJO CASO BORDE ()...N MAS)

    // numVisibleSlots 0 = no mostrar nada
    // CALCULAR hiddenItems
    // numVisibleSlots 1 =
    //    si HAY hiddenItems -> VACIAR Lista [] && MOSTRAR "N más" (N full length)
    //    si NO hay hiddenItems -> MOSTRAR lista entera [1] && OCULTAR "N más"
    // numVisibleSlots 2 =
    //    si HAY hiddenItems -> MOSTRAR Lista parcial [Parcial] && MOSTRAR "N más" (N sobrante)
    //    si NO hay hiddenItems -> MOSTRAR lista entera [1, 2] && OCULTAR "N más"
    // numVisibleSlots 3 =
    //    si HAY hiddenItems -> MOSTRAR Lista parcial [Parcial] && MOSTRAR "N más" (N sobrante)
    //    si NO hay hiddenItems -> MOSTRAR lista entera [1, 2, 3] && OCULTAR "N más"

    /* if (numVisibleSlots <= 0) {
        return <></>;
    } */

    console.log('reminder. ', remindersList);

    // if (typeof remindersList === 'undefined' || remindersList?.length === 0) return;

    const hasHiddenItems: boolean = numVisibleSlots < remindersList?.length;
    console.log('hasHiddenItems: ', hasHiddenItems);
    // 3 < 2 = false
    // 3 < 3 = false
    // 2 < 3 = true

    // console.log('[Reminders] / remindersListToShow: ', remindersListToShow);

    // const elements = buildElements(numVisibleSlots, hasHiddenItems);

    /**
     * : numVisibleSlots === 1
                ? hasHiddenItems
                    ? (<p>a</p>)
                    : '-'
                : 'CONTENT'
     */

    return (
        <div className="grow bg-yellow-200-NO overflow-hidden" ref={ref}>
            {(() => {
                if (numVisibleSlots <= 0)
                    return (
                        listLength > 0 && (
                            <Tooltip
                                title={`${listLength} items`}
                                arrow
                                placement="right-start"
                            >
                                <button>...</button>
                            </Tooltip>
                        )
                    );
                if (numVisibleSlots === 1) {
                    if (hasHiddenItems) {
                        return (
                            <Reminder
                                reminderSlotHeight={reminderSlotHeight}
                                reminderSlotGap={reminderSlotGap}
                                hiddenItems={listLength}
                                dayOfWeek={+moment(date).format('d')}
                                items={remindersList}
                            />
                        );
                    } else {
                        return remindersList.map((item, i) => (
                            <Reminder
                                key={i}
                                item={item}
                                reminderSlotHeight={reminderSlotHeight}
                                reminderSlotGap={reminderSlotGap}
                            />
                        ));
                    }
                } else {
                    if (hasHiddenItems) {
                        return (
                            <>
                                {remindersList
                                    .slice(0, numVisibleSlots - 1)
                                    .map((item, i) => {
                                        return (
                                            <Reminder
                                                key={i}
                                                item={item}
                                                reminderSlotHeight={
                                                    reminderSlotHeight
                                                }
                                                reminderSlotGap={
                                                    reminderSlotGap
                                                }
                                            />
                                        );
                                    })}
                                <Reminder
                                    reminderSlotHeight={reminderSlotHeight}
                                    reminderSlotGap={reminderSlotGap}
                                    hiddenItems={
                                        listLength -
                                        remindersList.slice(
                                            0,
                                            numVisibleSlots - 1
                                        ).length
                                    }
                                    dayOfWeek={+moment(date).format('d')}
                                    items={remindersList}
                                />
                            </>
                        );
                    } else {
                        return remindersList?.map((item, i) => (
                            <Reminder
                                key={i}
                                item={item}
                                reminderSlotHeight={reminderSlotHeight}
                                reminderSlotGap={reminderSlotGap}
                            />
                        ));
                    }
                }
            })()}
        </div>
    );
};
