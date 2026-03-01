import React, { createContext, useState, useContext, useEffect } from 'react';
import { getReservationMetadata } from '../api/bookingApi';


const BookingContext = createContext();

export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [people, setPeople] = useState(2);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [availableOptions, setAvailableOptions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getReservationMetadata()
      .then(data => {
        if (isMounted) setMetadata(data);
      })
      .catch(err => console.error("Could not fetch metadata:", err));
    return () => { isMounted = false; };
  }, []);


  // Function to reset the flow if date changes
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedZone(null);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setSelectedZone(null); // reset zone if time changes
  };

  const resetBooking = () => {
    setPeople(2);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedZone(null);
    setBookingConfirmed(false);
    setAvailableOptions([]);
  };

  const value = {
    people,
    setPeople,
    selectedDate,
    setSelectedDate: handleDateChange,
    selectedTime,
    setSelectedTime: handleTimeChange,
    selectedZone,
    setSelectedZone,
    bookingConfirmed,
    setBookingConfirmed,
    resetBooking,
    metadata,
    availableOptions,
    setAvailableOptions
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
