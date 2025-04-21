import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Admin from './components/Admin.jsx';
import Principal from './components/Principal.jsx';
import Calendario from './components/Calendario.jsx';
import Meteorologia from './components/Meteorologia.jsx';
import Cuaderno from './components/Cuaderno.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<Admin />} />
          <Route path="principal" element={<Principal />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="meteorologia" element={<Meteorologia />} />
          <Route path="cuaderno" element={<Cuaderno/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
