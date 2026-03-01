import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import '../styles/Calendar.css';

const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const Calendar = () => {
    const { selectedDate, setSelectedDate, metadata } = useBooking();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 0 = Sunday in JS, so adjust to start on Monday (0 = Monday in our logic)
    const getFirstDayOfMonth = () => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const getDaysInMonth = () => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayIndex = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();

    // Create an array mapping to our grid
    const cells = [];

    // Empty slots before month starts
    for (let i = 0; i < firstDayIndex; i++) {
        cells.push(null);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(d);
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isToday = (d) => {
        const today = new Date();
        return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const isSelected = (d) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === d &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
        );
    };

    const handleDateClick = (d, isAvailable) => {
        if (!isAvailable) return;
        const newDate = new Date(year, month, d);
        setSelectedDate(newDate);
    };

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&larr;</button>
                <div className="calendar-month">
                    {monthNames[month]} {year}
                </div>
                <button onClick={handleNextMonth}>&rarr;</button>
            </div>

            <div className="calendar-grid">
                {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}

                {cells.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="calendar-cell empty"></div>;
                    }

                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const note = metadata?.schedule?.[dateString]?.notes;

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const cellDate = new Date(year, month, day);
                    const latestDays = metadata?.latestBookingDays || 60; // Default to 60 if missing

                    const maxDate = new Date(today);
                    maxDate.setDate(today.getDate() + latestDays);

                    // Block past days and days beyond latestBookingDays
                    const isAvail = cellDate >= today && cellDate <= maxDate;
                    const statusClass = isAvail ? 'available' : 'unavailable';

                    const selectedClass = isSelected(day) ? 'selected' : '';
                    const todayClass = isToday(day) ? 'today' : '';

                    return (
                        <div
                            key={`day-${day}`}
                            className={`calendar-cell ${statusClass} ${selectedClass} ${todayClass}`}
                            onClick={() => handleDateClick(day, isAvail)}
                        >
                            {day}
                            {note && (
                                <div className="calendar-note" style={{ fontSize: '0.65em', color: '#e05a47', marginTop: '2px', lineHeight: '1.2' }}>
                                    {note}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
