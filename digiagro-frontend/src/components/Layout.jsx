import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div style={{ backgroundColor: '#F5F5DC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;