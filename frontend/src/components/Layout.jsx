import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const t = (key) => getTranslation(key, language);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-xl font-bold">
                As-Shawkani Foundation
              </Link>
              
              {user && (
                <div className="flex space-x-4">
                  <Link to="/dashboard" className="hover:text-blue-200">
                    {t('dashboard')}
                  </Link>
                  <Link to="/campaigns" className="hover:text-blue-200">
                    {t('campaigns')}
                  </Link>
                  {user.role === 'donor' && (
                    <Link to="/donations" className="hover:text-blue-200">
                      {t('donations')}
                    </Link>
                  )}
                  {user.role === 'volunteer' && (
                    <Link to="/tasks" className="hover:text-blue-200">
                      {t('tasks')}
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <>
                      <Link to="/beneficiaries" className="hover:text-blue-200">
                        {t('beneficiaries')}
                      </Link>
                      <Link to="/reports" className="hover:text-blue-200">
                        {t('reports')}
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/users" className="hover:text-blue-200">
                      {t('users')}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>
              
              {user && (
                <>
                  <span className="text-sm">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    {t('logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
