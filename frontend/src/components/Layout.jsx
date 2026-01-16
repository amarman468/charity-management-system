import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold flex-shrink-0">
                As-Shawkani Foundation
              </Link>

              {/* Desktop Navigation */}
              {user && (
                <div className="hidden md:flex md:space-x-4 ml-10">
                  {user.role !== 'staff' && (
                    <Link to="/dashboard" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                      {t('dashboard')}
                    </Link>
                  )}
                  <Link to="/campaigns" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                    {t('campaigns')}
                  </Link>

                  {user.role === 'donor' && (
                    <Link to="/donations" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                      {t('donations')}
                    </Link>
                  )}
                  {user.role === 'volunteer' && (
                    <Link to="/tasks" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                      {t('tasks')}
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <>
                      <Link to="/beneficiaries" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                        {t('beneficiaries')}
                      </Link>
                      <Link to="/reports" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                        {t('reports')}
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <div className="relative group">
                      <button className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                        Admin <span className="ml-1">▼</span>
                      </button>
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-50">
                        <div className="py-1">
                          <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {t('users')}
                          </Link>
                          <Link to="/admin/tasks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Manage Tasks
                          </Link>
                          <Link to="/admin/requests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Admin Requests
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 text-sm"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>

              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-sm"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleLanguage}
                className="mr-2 px-2 py-1 bg-blue-700 rounded hover:bg-blue-800 text-xs"
              >
                {language === 'en' ? 'BN' : 'EN'}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user && (
                <>
                  {user.role !== 'staff' && (
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white">
                      {t('dashboard')}
                    </Link>
                  )}
                  <Link to="/campaigns" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white">
                    {t('campaigns')}
                  </Link>

                  {user.role === 'donor' && (
                    <Link to="/donations" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white">
                      {t('donations')}
                    </Link>
                  )}
                  {user.role === 'volunteer' && (
                    <Link to="/tasks" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white">
                      {t('tasks')}
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <>
                      <Link to="/beneficiaries" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white">
                        {t('beneficiaries')}
                      </Link>
                      <Link to="/reports" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white">
                        {t('reports')}
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <div className="border-t border-blue-600 my-2"></div>
                      <div className="px-3 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Admin
                      </div>
                      <Link to="/admin/users" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white pl-6">
                        {t('users')}
                      </Link>
                      <Link to="/admin/tasks" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white pl-6">
                        Manage Tasks
                      </Link>
                      <Link to="/admin/requests" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 hover:text-white pl-6">
                        Admin Requests
                      </Link>
                    </>
                  )}

                  <div className="border-t border-blue-600 pt-4 mt-4 pb-2">
                    <div className="flex items-center px-5">
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">{user.name}</div>
                        <div className="text-sm font-medium text-blue-300">{user.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white bg-red-700"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
