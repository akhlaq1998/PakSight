import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, MoonIcon, CheckCircleIcon, XCircleIcon } from '../icons';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const MIN_PASSWORD_LENGTH = 8;

interface PasswordCriteria {
  id: keyof MetCriteria;
  text: string;
  regex?: RegExp; // Optional regex for specific character types
  testFn?: (password: string) => boolean; // Optional custom test function
}

interface MetCriteria {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

const initialMetCriteria: MetCriteria = {
  minLength: false,
  uppercase: false,
  lowercase: false,
  number: false,
  specialChar: false,
};

const passwordCriteriaList: PasswordCriteria[] = [
  { id: 'minLength', text: `Minimum ${MIN_PASSWORD_LENGTH} characters`, testFn: (p) => p.length >= MIN_PASSWORD_LENGTH },
  { id: 'uppercase', text: 'At least one uppercase letter (A-Z)', regex: /[A-Z]/ },
  { id: 'lowercase', text: 'At least one lowercase letter (a-z)', regex: /[a-z]/ },
  { id: 'number', text: 'At least one number (0-9)', regex: /[0-9]/ },
  { id: 'specialChar', text: 'At least one special character (!@#$%^&*)', regex: /[^A-Za-z0-9]/ },
];

type StrengthLevel = 'Too Short' | 'Weak' | 'Medium' | 'Strong';
interface PasswordStrength {
  level: StrengthLevel;
  score: number; // 0-4 (or 5 if all criteria met)
  color: string;
  textClass: string;
}

const calculatePasswordStrength = (password: string, criteriaMet: MetCriteria): PasswordStrength => {
  if (password.length === 0) {
    return { level: 'Too Short', score: 0, color: 'bg-slate-200', textClass: 'text-slate-500' };
  }
  if (!criteriaMet.minLength) {
    return { level: 'Too Short', score: 0, color: 'bg-red-500', textClass: 'text-red-600' };
  }

  let score = 0;
  if (criteriaMet.minLength) score++; // Base score for length
  if (criteriaMet.uppercase) score++;
  if (criteriaMet.lowercase) score++;
  if (criteriaMet.number) score++;
  if (criteriaMet.specialChar) score++;


  if (score <= 2) return { level: 'Weak', score, color: 'bg-red-500', textClass: 'text-red-600' };
  if (score <= 3) return { level: 'Medium', score, color: 'bg-yellow-500', textClass: 'text-yellow-600' };
  return { level: 'Strong', score, color: 'bg-green-500', textClass: 'text-green-600' };
};


export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(calculatePasswordStrength('', initialMetCriteria));
  const [metCriteria, setMetCriteria] = useState<MetCriteria>(initialMetCriteria);

  useEffect(() => {
    const newMetCriteria: MetCriteria = { ...initialMetCriteria };
    let criteriaScore = 0;

    passwordCriteriaList.forEach(criterion => {
      let isMet = false;
      if (criterion.testFn) {
        isMet = criterion.testFn(password);
      } else if (criterion.regex) {
        isMet = criterion.regex.test(password);
      }
      newMetCriteria[criterion.id] = isMet;
      if (isMet) criteriaScore++;
    });
    
    setMetCriteria(newMetCriteria);
    setPasswordStrength(calculatePasswordStrength(password, newMetCriteria));
  }, [password]);


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    // Basic validation for MVP
    if (email === 'user@example.com' && password === 'password123') {
      // For demo, allow login even if 'password123' is weak by our criteria.
      // In a real app, you might check passwordStrength.level here.
      onLoginSuccess();
    } else {
      setError('Invalid email or password. Use user@example.com and password123 for demo.');
    }
  };

  const strengthBarSegments = 4; // Corresponds to Weak, Medium, Strong (length is a base)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark-blue p-4">
      <div className="text-center mb-10">
        <MoonIcon className="w-20 h-20 text-brand-secondary mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-white">PakSight</h1>
        <p className="text-lg text-brand-text-medium mt-2">AI-Powered Foreign Media Intelligence</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-brand-text-dark text-center mb-6">Sign In</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-dark">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-brand-text-dark"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password_login" className="block text-sm font-medium text-brand-text-dark">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password_login"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password" // Suggest new password
                required
                value={password}
                onChange={handlePasswordChange}
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-brand-text-dark"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-brand-text-medium hover:text-brand-text-dark"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium ${passwordStrength.textClass}`}>
                    Password Strength: {passwordStrength.level}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden">
                  {Array.from({ length: strengthBarSegments }).map((_, i) => (
                    <div key={i} className="flex-1">
                      <div 
                        className={`h-full transition-colors duration-300 ease-in-out ${
                          // Score for strength bar: 0 for too short, 1-2 weak, 3 medium, 4-5 strong
                          // We use score - 1 because minLength already gives 1 point. Max criteria score is 5.
                          // Strength segments are 4.
                          // A score of 1 (only minLength) is "Too Short" or "Weak".
                          // A score of 2 (minLength + 1 other) is "Weak".
                          // A score of 3 (minLength + 2 others) is "Medium".
                          // A score of 4 or 5 (minLength + 3 or 4 others) is "Strong".
                          // Map score to bar segments:
                          // score 0 (too short, but has text) -> red on first bar
                          // score 1 (weak, just minLength) -> red on first bar
                          // score 2 (weak) -> red up to second bar
                          // score 3 (medium) -> yellow up to third bar
                          // score 4+ (strong) -> green up to fourth bar
                          i < Math.max(1, passwordStrength.score -1) || (passwordStrength.level === "Too Short" && password.length > 0 && i === 0) ? passwordStrength.color : 'bg-slate-200'
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password Criteria Checklist */}
            {password.length > 0 && (
              <ul className="mt-3 space-y-1">
                {passwordCriteriaList.map(criterion => (
                  <li key={criterion.id} className={`flex items-center text-xs ${metCriteria[criterion.id] ? 'text-green-600' : 'text-slate-500'}`}>
                    {metCriteria[criterion.id] ? <CheckCircleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" /> : <XCircleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />}
                    {criterion.text}
                  </li>
                ))}
              </ul>
            )}
             <p className="mt-3 text-xs text-brand-text-medium">
                Minimum acceptance: Aim for "Medium" or "Strong" by fulfilling multiple criteria.
             </p>

          </div>


          <div className="flex items-center justify-between">
            {/* Kept for layout, can be removed if not needed */}
            <a href="#" className="text-sm text-brand-primary hover:text-brand-secondary invisible"> 
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-nav-blue hover:bg-brand-dialog-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
       <p className="mt-8 text-center text-xs text-brand-text-medium">
        Demo credentials: user@example.com / password123
      </p>
    </div>
  );
};