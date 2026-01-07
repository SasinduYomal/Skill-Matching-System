import React from 'react';
import { Home, Users, Wrench, Briefcase, Shuffle, Menu, X, BarChart3, Settings, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/personnel', label: 'Personnel', icon: Users },
    { path: '/skills', label: 'Skills', icon: Wrench },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/matching', label: 'Skill Matching', icon: Shuffle },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-20 left-4 z-50 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-70 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static z-50 h-full-screen w-64 bg-gradient-to-b from-gray-50 to-white shadow-2xl transition-all duration-500 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-800 shadow-lg">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SkillMatch</h2>
              <p className="text-indigo-200 text-xs mt-1">Team Optimization System</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold shadow-inner border-l-4 border-indigo-500'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-sm'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Settings with dropdown */}
            <li>
              <div 
                onClick={toggleDropdown}
                className="flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-sm cursor-pointer transition-all duration-300"
              >
                <Settings className="h-5 w-5 mr-3" />
                <span className="font-medium flex-1">Settings</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>
              
              {isDropdownOpen && (
                <ul className="mt-2 ml-8 space-y-1 bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <li>
                    <Link 
                      to="/settings/profile" 
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/settings/preferences" 
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      Preferences
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/settings/security" 
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      Security
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        
        {/* User info */}
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-70 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;