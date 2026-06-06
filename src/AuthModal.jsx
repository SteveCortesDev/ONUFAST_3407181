import { useState } from 'react';

export default function AuthModal({ isOpen, onClose }) {
  // Estado para alternar entre pestañas: 'login' o 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Si el modal está cerrado, no renderiza nada en el DOM
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera negra con el logotipo superior */}
        <div className="modal-header-black">
          <img src="/LOGO_ONUFAST.jpg" alt="Onufast Logo" className="modal-logo" />
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Selector de pestañas interactivas */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registrarse
          </button>
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Iniciar Sesión
          </button>
        </div>

        {/* CONTENIDO DINÁMICO SEGÚN LA PESTAÑA SELECCIONADA */}
        {activeTab === 'login' ? (
          /* Formulario de Iniciar Sesión (image_6ce059.png) */
          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Correo electrónico:</label>
              <input type="email" placeholder="Correo electrónico" required />
            </div>
            <div className="input-group">
              <label>Contraseña:</label>
              <div className="password-wrapper">
                <input type="password" placeholder="Contraseña" required />
                <span className="toggle-password">👁️</span>
              </div>
            </div>
            <span className="form-link">Olvide mi contraseña</span>
            
            <button type="submit" className="btn-submit">Iniciar</button>
            
            <span className="sub-text">Acceso Rápido</span>
            <div className="social-login">
              <img src="/chrome-icon.png" alt="Google" className="social-icon-img" />
            </div>
          </form>
        ) : (
          /* Formulario de Registrarse (image_6ce077.png) */
          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Nombre</label>
              <input type="text" placeholder="Nombre" required />
            </div>
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" placeholder="Usuario" required />
            </div>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input type="email" placeholder="Correo Electronico" required />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <div className="password-wrapper">
                <input type="password" placeholder="Contraseña" required />
                <span className="toggle-password">👁️</span>
              </div>
            </div>
            <div className="input-group">
              <label>Confirma Contraseña</label>
              <input type="password" placeholder="Confirma Contraseña" required />
            </div>
            
            <span className="sub-text">Registro Rápido</span>
            <div className="social-login">
              <img src="/chrome-icon.png" alt="Google" className="social-icon-img" />
            </div>

            <button type="submit" className="btn-submit">Registrar</button>
          </form>
        )}

      </div>
    </div>
  );
}