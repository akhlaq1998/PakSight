import React, { useState, useEffect } from 'react';
import { MenuIcon, AnalyticsIcon, PencilIcon } from '../icons';

interface NavbarProps {
  teamName: string;
  onSetTeamName: (name: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ teamName, onSetTeamName }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentEditNameValue, setCurrentEditNameValue] = useState(teamName);

  useEffect(() => {
    // Sync local edit state if prop changes externally (e.g., on initial load)
    setCurrentEditNameValue(teamName);
  }, [teamName]);

  const handleEditToggle = () => {
    if (!isEditingName) {
      setCurrentEditNameValue(teamName); // Reset to current team name when starting edit
    }
    setIsEditingName(!isEditingName);
  };

  const handleSaveName = () => {
    onSetTeamName(currentEditNameValue);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setCurrentEditNameValue(teamName); // Revert to original team name
    setIsEditingName(false);
  };

  return (
    <nav className="bg-brand-nav-blue text-brand-text-light p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: App Title */}
        <div className="flex items-center space-x-2">
          <AnalyticsIcon className="w-8 h-8 text-brand-secondary" />
          <h1 className="text-2xl font-bold">PakSight</h1>
          <span className="text-xs text-brand-text-medium mt-1.5 hidden sm:inline-block">- Foreign Media Intelligence (MVP)</span>
        </div>

        {/* Right Section: Team Name & Menu */}
        <div className="flex items-center space-x-4">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentEditNameValue}
                onChange={(e) => setCurrentEditNameValue(e.target.value)}
                placeholder="Your/Team Name"
                className="px-2 py-1 text-sm rounded-md bg-brand-dialog-blue text-brand-text-light border border-brand-secondary focus:ring-brand-primary focus:border-brand-primary"
                aria-label="Edit team name"
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1 text-sm bg-brand-primary hover:bg-brand-secondary rounded-md"
                aria-label="Save team name"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm bg-slate-500 hover:bg-slate-400 rounded-md"
                aria-label="Cancel editing team name"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {teamName ? (
                <span className="text-sm">Hi, {teamName}!</span>
              ) : (
                <span className="text-sm text-brand-text-medium italic">Team name not set</span>
              )}
              <button
                onClick={handleEditToggle}
                className="text-brand-text-light hover:text-brand-secondary"
                aria-label={teamName ? "Edit team name" : "Set team name"}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <button 
            className="text-brand-text-light hover:text-brand-secondary"
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>
  );
};