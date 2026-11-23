import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { PassengerDashboardPage } from './pages/PassengerDashboardPage';
import { TripChatPage } from './pages/TripChatPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141613] font-sans antialiased selection:bg-[#173C2C] selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/trips/create" element={<CreateTripPage />} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
              <Route path="/trips/:id/chat" element={<TripChatPage />} />
              <Route path="/dashboard/driver" element={<DriverDashboardPage />} />
              <Route path="/dashboard/passenger" element={<PassengerDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
