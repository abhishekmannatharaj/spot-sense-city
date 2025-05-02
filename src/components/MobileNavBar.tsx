
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const MobileNavBar = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const navItems = [
    {
      name: 'Map',
      path: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h10" />
          <path d="M12 2v10" />
        </svg>
      ),
    },
    {
      name: 'Bookings',
      path: '/bookings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      name: user?.userType === 'space_owner' ? 'My Spots' : 'Host',
      path: '/host',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      name: 'Account',
      path: '/account',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-between p-3 safe-bottom z-50">
        <div className="flex-1 flex justify-center">
          <Link to="/login">
            <Button variant="outline" className="w-32">Login</Button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Link to="/signup">
            <Button className="w-32">Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-between px-1 safe-bottom z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-1 flex-col items-center justify-center py-3 ${
              isActive ? 'text-nexlot-600' : 'text-gray-500'
            }`}
          >
            <span className={isActive ? 'text-nexlot-600' : 'text-gray-500'}>
              {item.icon}
            </span>
            <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNavBar;
