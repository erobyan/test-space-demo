import { Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reservar" element={<BookingPage />} />
      </Routes>
    </BookingProvider>
  );
}

export default App;
