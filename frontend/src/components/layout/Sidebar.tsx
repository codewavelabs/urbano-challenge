import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={'sidebar' + className}>
      <img
        className="absolute inset-0 object-cover w-full h-full z-[-1]"
        src="/sidemenu-bg.jpg"
      ></img>
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
      <div className="flex flex-col relative flex z-10 h-full">
        <Link to="/" className="flex justify-center items-center mb-5">
          <img className="self-center" src="/urbano-logo-white.png"></img>
        </Link>
        <nav className="mt-16 flex flex-col gap-3 flex-grow">
          <SidebarItem to="/">
            <Home /> Dashboard
          </SidebarItem>
          <SidebarItem to="/courses">
            <BookOpen /> Courses
          </SidebarItem>
          {authenticatedUser.role === 'admin' ? (
            <SidebarItem to="/users">
              <Users /> Users
            </SidebarItem>
          ) : null}
        </nav>
        <button
          className="mt-auto mb-5 text-red-500 rounded-md p-3 transition-colors flex gap-3 font-semibold focus:outline-none"
          onClick={handleLogout}
        >
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
}
