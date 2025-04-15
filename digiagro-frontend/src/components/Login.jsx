import { useState, useEffect } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [hovered, setHovered] = useState('register'); // Estado inicial en 'register'
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    console.log('Estado hovered actualizado:', hovered);
  }, [hovered]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      nombre: nombre.trim(),
      email: email.trim(),
      password: password.trim(),
      rol: rol.trim(),
    };

    console.log("Datos enviados:", userData);

    try {
      const response = await fetch('http://localhost:3000/digiagro/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Usuario registrado con éxito');
        setNombre('');
        setEmail('');
        setPassword('');
        setRol('');
        setHovered('register'); 
        console.log('Estado hovered:', hovered); // Verifica el estado
      } else {
        const errorData = await response.json();
        alert(`Error al registrar el usuario: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Hubo un problema al registrar el usuario');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', marginTop: '40px' }}
    >
      <div className="container-fluid d-flex justify-content-center">
        <div
          className="login-register-wrapper d-flex position-relative"
          style={{ margin: '0 200px' }}
        >
          {/* Login Form */}
          <div className="login-form p-4 bg-white shadow position-relative z-2"
            onMouseEnter={() => setHovered('login')}
            onMouseLeave={() => setHovered(null)}
          >
            <h3 className="mb-3">Iniciar Sesión</h3>
            <form>
              <div className="mb-3 text-start">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Correo electrónico" />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control" placeholder="Contraseña" />
              </div>
              <button type="submit" className="btn btn-success">Entrar</button>
            </form>
          </div>

          {/* Register Form */}
          <div
            className="register-form p-4 bg-white shadow position-relative z-2"
            onMouseEnter={() => setHovered('register')}
            onMouseLeave={() => setHovered(null)}
          >
            <h3 className="mb-3">Registro</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3 text-start">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option selected value="">Selecciona tipo</option>
                  <option value="Tec">Técnico</option>
                  <option value="Agri">Agricultor</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success">Registrarse</button>
            </form>
          </div>

          {/* Overlay */}
          <div className={`overlay ${hovered === 'login' ? 'slide-left' : hovered === 'register' ? 'slide-right' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
