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
        resetBooking
    } = useBooking();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await createBooking({
                people,
                date: selectedDate.toISOString(),
                time: selectedTime,
                zone: selectedZone
            });
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
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
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
                {selectedTime && (
                    <section className="step-section" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <h2 className="step-title">4. Seleccione una zona del restaurante</h2>
                        <div className="zone-grid">
                            <button
                                className={`zone-btn ${selectedZone === 'Sala' ? 'active' : ''}`}
                                onClick={() => setSelectedZone('Sala')}
                            >
                                <span>Sala</span>
                                <span className="zone-desc">(Interior)</span>
                            </button>
                            <button
                                className={`zone-btn ${selectedZone === 'Terraza' ? 'active' : ''}`}
                                onClick={() => setSelectedZone('Terraza')}
                            >
                                <span>Terraza</span>
                                <span className="zone-desc">(Exterior)</span>
                            </button>
                        </div>
                    </section>
                )}

                {/* Resumen */}
                {selectedZone && (
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
                            <div className="summary-item">
                                <span className="summary-label">Zona</span>
                                <span className="summary-value">{selectedZone}</span>
                            </div>
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
