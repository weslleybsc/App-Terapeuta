import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './screens/LoginScreen';
import { PatientDashboard } from './screens/patient/PatientDashboard';
import { TherapistDashboard } from './screens/therapist/TherapistDashboard';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginScreen />;
  }

  if (currentUser.role === 'therapist') {
    return <TherapistDashboard />;
  }

  return <PatientDashboard />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;