import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Calendar from '../components/Calendar';
import TimeSlotGrid from '../components/TimeSlotGrid';
import { createBooking } from '../api/bookingApi';
import '../styles/BookingPage.css';

const BookingPage = () => {
    const {
        people,
        setPeople,
        selectedDate,
        selectedTime,
        selectedZone,
        setSelectedZone,
        bookingConfirmed,
        setBookingConfirmed,
        resetBooking,
        metadata,
        availableOptions
    } = useBooking();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
            const bookingData = {
                people,
                date: formattedDate,
                start: selectedTime,
                customer: {
                    name: "Customer Data",
                    phone: "000000000"
                }
            };
            if (selectedZone) {
                bookingData.location = selectedZone;
            }

            await createBooking(bookingData);
            setBookingConfirmed(true);
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Hubo un error al confirmar la reserva.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinish = () => {
        resetBooking();
        navigate('/');
    };

    const formatDate = (date) => {
        if (!date) return '---';
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const maxPeople = metadata?.reservationModel?.maxPeoplePerReservation || 8;
    const peopleOptions = Array.from({ length: maxPeople }, (_, i) => i + 1);

    const activeLocations = (() => {
        if (!selectedTime) return [];
        const opt = availableOptions.find(o => o.start === selectedTime);
        return opt ? (opt.locations || []) : [];
    })();

    return (
        <div className="booking-page">
            <div className="booking-container">
                <header className="booking-header">
                    <h1>Reserva tu Experiencia</h1>
                    <p>Costa Mallorca Cruise Dining</p>
                </header>

                {/* Personas */}
                <section className="step-section">
                    <h2 className="step-title">1. ¿Cuántos seréis?</h2>
                    <select
                        className="people-select"
                        value={people}
                        onChange={(e) => setPeople(Number(e.target.value))}
                    >
                        {peopleOptions.map(num => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'persona' : 'personas'}
                            </option>
                        ))}
                    </select>
                </section>

                {/* Fecha y Calendario */}
                <section className="step-section">
                    <h2 className="step-title">2. Selecciona una Fecha</h2>
                    <Calendar />
                </section>

                {/* Horas */}
                {selectedDate && (
                    <section className="step-section">
                        <h2 className="step-title">3. Elige tu Turno</h2>
                        <TimeSlotGrid />
                    </section>
                )}

                {/* Zona */}
                {selectedTime && activeLocations.length > 0 && (
                    <section className="step-section" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <h2 className="step-title">4. Seleccione una zona del restaurante</h2>
                        <div className="zone-grid">
                            {activeLocations.map(loc => (
                                <button
                                    key={loc}
                                    className={`zone-btn ${selectedZone === loc ? 'active' : ''}`}
                                    onClick={() => setSelectedZone(loc)}
                                >
                                    <span>{loc}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Resumen */}
                {selectedTime && (!activeLocations.length || selectedZone) && (
                    <div className="summary-panel" style={{ animation: 'slideUp 0.3s ease-out' }}>
                        <h3 className="summary-title">Resumen de tu Reserva</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">Personas</span>
                                <span className="summary-value">{people} {people === 1 ? 'persona' : 'personas'}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Fecha</span>
                                <span className="summary-value" style={{ textTransform: 'capitalize' }}>
                                    {formatDate(selectedDate)}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Hora</span>
                                <span className="summary-value">{selectedTime}</span>
                            </div>
                            {selectedZone && (
                                <div className="summary-item">
                                    <span className="summary-label">Zona</span>
                                    <span className="summary-value">{selectedZone}</span>
                                </div>
                            )}
                        </div>

                        <button
                            className="confirm-btn"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR RESERVA'}
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmed Modal Overlay */}
            {bookingConfirmed && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">¡Reserva confirmada!</h2>
                        <p className="modal-text">
                            Nos vemos a bordo en la costa de Mallorca. Le hemos enviado los detalles a su correo.
                        </p>
                        <button className="modal-btn" onClick={handleFinish}>
                            VOLVER AL INICIO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;
