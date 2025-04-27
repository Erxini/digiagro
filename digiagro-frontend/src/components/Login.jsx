import { useState, useEffect } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [activeForm, setActiveForm] = useState('login'); // Cambiamos el nombre del estado para reflejar mejor su propósito
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { register, login, recuperarPassword, authError, loginFieldErrors } = useAuth(); // Añadido recuperarPassword
  
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
    
    // Validar teléfono
    const telefonoRegex = /^[0-9]{9}$/;
    if (!values.telefono?.trim()) {
      errors.telefono = 'El teléfono es obligatorio';
    } else if (!telefonoRegex.test(values.telefono.trim())) {
      errors.telefono = 'Ingrese un teléfono válido de 9 dígitos';
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

  // Validar email para recuperación de contraseña
  const validateResetEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim()) {
      return 'El email es obligatorio';
    } else if (!emailRegex.test(email.trim())) {
      return 'Ingrese un email válido';
    }
    return '';
  };

  // Manejar el envío del formulario de recuperación de contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const error = validateResetEmail(resetEmail);
    if (error) {
      setResetEmailError(error);
      return;
    }
    
    try {
      const response = await recuperarPassword(resetEmail);
      if (response && response.success) {
        setResetSuccess(true);
        // Mostrar mensaje de éxito durante 3 segundos y luego limpiar
        setTimeout(() => {
          setResetSuccess(false);
          setResetEmail('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
    }
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
    { nombre: '', email: '', password: '', telefono: '', rol: '' },
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

  // Función para cambiar entre formularios
  const toggleForm = () => {
    setActiveForm(activeForm === 'login' ? 'register' : 'login');
  };

  // Función para manejar el registro
  const submitRegister = async () => {
    try {
      const success = await register(registerValues);
      
      if (success) {
        resetRegisterForm();
        setActiveForm('login'); // Cambiar a login después de registro exitoso
        setShowSuccessModal(true); // Mostrar el modal de éxito
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
      // No hacer nada más aquí, el hook useAuth se encarga de la redirección si es exitoso
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // Determinar la clase del overlay según el estado y si es móvil o no
  const getOverlayClass = () => {
    if (isMobile) {
      return activeForm === 'login' ? 'slide-up' : 'slide-down';
    } else {
      return activeForm === 'login' ? 'slide-left' : 'slide-right';
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', marginTop: '40px' , marginBottom: '0px' }}
    >
      <div className="container-fluid d-flex justify-content-center">
        <div
          className={`login-register-wrapper position-relative ${isMobile ? 'd-flex flex-column' : 'd-flex'}`}
          style={{ margin: isMobile ? '0 auto' : '-20px 50px' }}
        >
          {/* Login Form */}
          <div className="login-form p-4 bg-white shadow position-relative z-2">
            <h3 className="mb-3">Iniciar Sesión</h3>
            {/* Solo mostramos el error general si no hay errores específicos de campo */}
            {authError && !Object.keys(loginFieldErrors).length > 0 && 
              <div className="alert alert-danger">{authError}</div>
            }
            <form onSubmit={handleLoginSubmit(submitLogin)}>
              <div className="mb-3 text-start">
                <input 
                  type="email" 
                  name="email"
                  className={`form-control ${loginErrors.email || loginFieldErrors.email ? 'is-invalid' : ''}`}
                  placeholder="Correo electrónico"
                  value={loginValues.email}
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                />
                {(loginErrors.email || loginFieldErrors.email) && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {loginFieldErrors.email || loginErrors.email}
                  </div>
                }
              </div>
              <div className="mb-3 text-start">
                <input 
                  type="password" 
                  name="password"
                  className={`form-control ${loginErrors.password || loginFieldErrors.password ? 'is-invalid' : ''}`} 
                  placeholder="Contraseña"
                  value={loginValues.password}
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                />
                {(loginErrors.password || loginFieldErrors.password) && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {loginFieldErrors.password || loginErrors.password}
                  </div>
                }
              </div>
              <button type="submit" className="btn btn-success">Entrar</button>
            </form>
            
            {/* Sección de recuperación de contraseña */}
            <div className="mt-4 pt-3 border-top text-center">
              <p className="mb-2">¿Has olvidado tu contraseña?</p>
              
              <form onSubmit={handleResetPassword} className="mb-2">
                <div className="input-group mb-2">
                  <input
                    type="email"
                    className={`form-control ${resetEmailError ? 'is-invalid' : ''}`}
                    placeholder="Correo electrónico"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setResetEmailError('');
                    }}
                  />
                  <button type="submit" className="btn btn-success">
                    Enviar
                  </button>
                </div>
                {resetEmailError && (
                  <div className="text-danger small text-start" style={{ marginTop: '-5px' }}>
                    {resetEmailError}
                  </div>
                )}
              </form>
              
              {resetSuccess && (
                <div className="alert alert-success py-2 small" role="alert">
                  Si el correo existe, recibirás una nueva contraseña en breve.
                </div>
              )}
            </div>
          </div>

          {/* Register Form */}
          <div
            className="register-form p-4 bg-white shadow position-relative z-2"
          >
            <h3 className="mb-3">Registro</h3>
            {authError && <div className="alert alert-danger">{authError}</div>}
            <form onSubmit={handleRegisterSubmit(submitRegister)}>
              <div className="mb-3 text-start">
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
                <input
                  type="text"
                  name="telefono"
                  className={`form-control ${registerErrors.telefono ? 'is-invalid' : ''}`}
                  placeholder="Teléfono"
                  value={registerValues.telefono}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                />
                {registerErrors.telefono && 
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>
                    {registerErrors.telefono}
                  </div>
                }
              </div>
              <div className="mb-3 text-start">
                <select
                  name="rol"
                  className={`form-select ${registerErrors.rol ? 'is-invalid' : ''}`}
                  value={registerValues.rol}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                >
                  <option value="">Seleccionar rol</option>
                  {/* <option value="Admin">Administrador</option> */}
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

          <div 
            className={`overlay ${getOverlayClass()}`} 
            onClick={toggleForm}
            style={{ cursor: 'pointer' }}
          >
            <div className="overlay-content">
              {activeForm === 'login' ? (
                <div className="text-center text-light">
                  <h4>¿No tienes cuenta?</h4>
                  <p>Regístrate para comenzar</p>
                  <Button variant="outline-light">Regístrate</Button>
                </div>
              ) : (
                <div className="text-center text-light">
                  <h4>¿Ya tienes cuenta?</h4>
                  <p>Inicia sesión con tus credenciales</p>
                  <Button variant="outline-light">Iniciar Sesión</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de registro exitoso */}
      <Modal 
        show={showSuccessModal} 
        onHide={handleCloseModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header style={{ backgroundColor: '#4CAF50', color: 'white' }}>
          <Modal.Title>Registro Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            <i className="fas fa-check-circle fa-3x mb-3" style={{ color: '#4CAF50' }}></i>
          </p>
          <p className="text-center">
            ¡Usuario registrado correctamente!
          </p>
          <p className="text-center">
            Ahora puedes iniciar sesión con tus credenciales.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
