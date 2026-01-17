import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './screens/LoginScreen';
import { PatientDashboard } from './screens/patient/PatientDashboard';
import { TherapistDashboard } from './screens/therapist/TherapistDashboard';

// Main Routing Logic
// Checks authentication state to decide which screen to show initially
const AppRoutes: React.FC = () => {
  const { currentUser } = useApp();

  // 1. Initial Screen: Login
  // If no user is authenticated, we always show the Login Screen first.
  if (!currentUser) {
    return <LoginScreen />;
  }

  // 2. Protected Route: Therapist Dashboard
  if (currentUser.role === 'therapist') {
    return <TherapistDashboard />;
  }

  // 3. Protected Route: Patient Dashboard
  return <PatientDashboard />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;