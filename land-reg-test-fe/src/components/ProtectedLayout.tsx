import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
