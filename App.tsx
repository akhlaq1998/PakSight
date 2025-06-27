import React, { useState, useCallback, useEffect } from 'react';
import { LoginPage } from './components/dashboard/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import 'recharts';

const APP_TEAM_NAME_KEY = 'paksight-teamName';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>('');

  useEffect(() => {
    const storedTeamName = localStorage.getItem(APP_TEAM_NAME_KEY);
    if (storedTeamName) {
      setTeamName(storedTeamName);
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleSetTeamName = useCallback((newName: string) => {
    const trimmedName = newName.trim();
    setTeamName(trimmedName);
    if (trimmedName) {
      localStorage.setItem(APP_TEAM_NAME_KEY, trimmedName);
    } else {
      localStorage.removeItem(APP_TEAM_NAME_KEY);
    }
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <DashboardPage teamName={teamName} onSetTeamName={handleSetTeamName} />;
};

export default App;