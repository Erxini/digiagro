import { useState, useEffect } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [hovered, setHovered] = useState('register'); // Estado inicial en 'register'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const { register, login, authError } = useAuth();
  
  // Función para actualizar el estado isMobile cuando cambia el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Funciones de validación
  const validateRegister = (values) => {
    const errors = {};
    
    // Validar nombre
    if (!values.nombre?.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (values.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email?.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(values.email.trim())) {
      errors.email = 'Ingrese un email válido';
    }
    
    // Validar contraseña
    if (!values.password?.trim()) {
      errors.password = 'La contraseña es obligatoria';
    } else if (values.password.trim().length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validar rol
    if (!values.rol?.trim()) {
      errors.rol = 'Debe seleccionar un rol';
    }
    
    return errors;
  };
  
  const validateLogin = (values) => {
    const errors = {};
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email?.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(values.email.trim())) {
      errors.email = 'Ingrese un email válido';
    }
    
    // Validar contraseña
    if (!values.password?.trim()) {
      errors.password = 'La contraseña es obligatoria';
    }
    
    return errors;
  };
  
  // Uso de useFormValidation para el formulario de registro
  const {
    values: registerValues,
    errors: registerErrors,
    handleChange: handleRegisterChange,
    handleBlur: handleRegisterBlur,
    handleSubmit: handleRegisterSubmit,
    resetForm: resetRegisterForm
  } = useFormValidation(
    { nombre: '', email: '', password: '', rol: '' },
    validateRegister
  );
  
  // Uso de useFormValidation para el formulario de login
  const {
    values: loginValues,
    errors: loginErrors,
    handleChange: handleLoginChange,
    handleBlur: handleLoginBlur,
    handleSubmit: handleLoginSubmit
  } = useFormValidation(
    { email: '', password: '' },
    validateLogin
  );

  useEffect(() => {
    console.log('Estado hovered actualizado:', hovered);
  }, [hovered]);

  // Función para manejar el registro
  const submitRegister = async () => {
    try {
      const success = await register(registerValues);
      
      if (success) {
        resetRegisterForm();
        setHovered('login'); // Cambiar a login después de registro exitoso
        console.log('Usuario registrado con éxito');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };
  
  // Función para manejar el login
  const submitLogin = async () => {
    try {
      console.log('Intentando iniciar sesión con:', loginValues);
      await login(loginValues);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // Determinar la clase del overlay según el estado y si es móvil o no
  const getOverlayClass = () => {
    if (!hovered) return '';
    
    if (isMobile) {
      return hovered === 'login' ? 'slide-up' : hovered === 'register' ? 'slide-down' : '';
    } else {
      return hovered === 'login' ? 'slide-left' : hovered === 'register' ? 'slide-right' : '';
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', marginTop: '40px' }}
    >
      <div className="container-fluid d-flex justify-content-center">
        <div
          className={`login-register-wrapper position-relative ${isMobile ? 'd-flex flex-column' : 'd-flex'}`}
          style={{ margin: isMobile ? '0 auto' : '0 200px' }}
        >
          {/* Login Form */}
          <div className="login-form p-4 bg-white shadow position-relative z-2"
            onMouseEnter={() => setHovered('login')}
            onMouseLeave={() => setHovered(null)}
          >
            <h3 className="mb-3">Iniciar Sesión</h3>
            {authError && <div className="alert alert-danger">{authError}</div>}
            <form onSubmit={handleLoginSubmit(submitLogin)}>
              <div className="mb-3 text-start">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`}
                  placeholder="Correo electrónico"
                  value={loginValues.email}
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                />
                {loginErrors.email && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {loginErrors.email}
                  </div>
                }
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  name="password"
                  className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`} 
                  placeholder="Contraseña"
                  value={loginValues.password}
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                />
                {loginErrors.password && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {loginErrors.password}
                  </div>
                }
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
            {authError && <div className="alert alert-danger">{authError}</div>}
            <form onSubmit={handleRegisterSubmit(submitRegister)}>
              <div className="mb-3 text-start">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${registerErrors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Nombre completo"
                  value={registerValues.nombre}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                />
                {registerErrors.nombre && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {registerErrors.nombre}
                  </div>
                }
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${registerErrors.email ? 'is-invalid' : ''}`}
                  placeholder="Correo electrónico"
                  value={registerValues.email}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                />
                {registerErrors.email && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {registerErrors.email}
                  </div>
                }
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${registerErrors.password ? 'is-invalid' : ''}`}
                  placeholder="Contraseña"
                  value={registerValues.password}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                />
                {registerErrors.password && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {registerErrors.password}
                  </div>
                }
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Rol</label>
                <select
                  name="rol"
                  className={`form-select ${registerErrors.rol ? 'is-invalid' : ''}`}
                  value={registerValues.rol}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="Admin">Administrador</option>
                  <option value="Tec">Técnico</option>
                  <option value="Agri">Agricultor</option>
                </select>
                {registerErrors.rol && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {registerErrors.rol}
                  </div>
                }
              </div>
              <button type="submit" className="btn btn-success">Registrarse</button>
            </form>
          </div>

          {/* Overlay con clases dinámicas según el estado y dispositivo */}
          <div className={`overlay ${getOverlayClass()}`}></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
