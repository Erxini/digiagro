import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ backgroundColor: '#F5F5DC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="flex-grow-1"
        style={{ paddingLeft: '50px', paddingRight: '50px'}}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;