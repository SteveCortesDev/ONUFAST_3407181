import './Pages.css';

export default function Nosotros() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <h1>Quiénes Somos</h1>
        <p>Conoce más sobre ONUFAST y nuestra misión</p>
      </section>
      
      <section className="page-content">
        <div className="about-grid">
          <div className="about-card">
            <h2>Nuestra Historia</h2>
            <p>ONUFAST nace con la misión de revolucionar la logística en Colombia...</p>
          </div>
          <div className="about-card">
            <h2>Nuestra Misión</h2>
            <p>Entregar felicidad a tu puerta, rápido, seguro y confiable...</p>
          </div>
          <div className="about-card">
            <h2>Nuestra Visión</h2>
            <p>Ser la empresa de logística más confiable de Latinoamérica...</p>
          </div>
        </div>
      </section>
    </div>
  );
}// Prueba de commit