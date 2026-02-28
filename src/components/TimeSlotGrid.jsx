import React, { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { getAvailability } from '../api/bookingApi';

const TimeGridStyles = `
  .timeslot-section {
    margin-top: 32px;
    animation: fadeIn var(--transition-normal);
  }
  .timeslot-title {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .timeslot-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }
  .time-btn {
    background-color: var(--color-coral);
    color: var(--color-white);
    padding: 12px;
    border-radius: var(--radius-sm);
    font-weight: 500;
    text-align: left;
    transition: all var(--transition-fast);
    box-shadow: 0 2px 4px rgba(224, 90, 71, 0.2);
  }
  .time-btn:hover {
    background-color: var(--color-coral-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(224, 90, 71, 0.3);
  }
  .time-btn.active {
    background-color: var(--color-turquoise);
    color: var(--color-white);
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(72, 201, 176, 0.4);
  }
  .loading-times {
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-style: italic;
    margin-top: 20px;
  }
`;

const TimeSlotGrid = () => {
    const { selectedDate, selectedTime, setSelectedTime, people } = useBooking();
    const [lunchTimes, setLunchTimes] = useState([]);
    const [dinnerTimes, setDinnerTimes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedDate) {
            setLunchTimes([]);
            setDinnerTimes([]);
            return;
        }

        let isMounted = true;
        setLoading(true);

        getAvailability({ date: selectedDate.toISOString(), people })
            .then((data) => {
                if (isMounted) {
                    setLunchTimes(data.lunch);
                    setDinnerTimes(data.dinner);
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [selectedDate, people]);

    if (!selectedDate) return null;

    return (
        <div className="timeslot-section">
            <style>{TimeGridStyles}</style>

            {loading ? (
                <div className="loading-times">Comprobando disponibilidad...</div>
            ) : (
                <>
                    <div className="timeslot-title">COMIDA</div>
                    <div className="timeslot-grid">
                        {lunchTimes.map(time => (
                            <button
                                key={time}
                                className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <div className="timeslot-title">CENA</div>
                    <div className="timeslot-grid">
                        {dinnerTimes.map(time => (
                            <button
                                key={time}
                                className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TimeSlotGrid;
