import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
