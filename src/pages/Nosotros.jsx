import './Pages.css';

const stats = [
  { number: '+5K', label: 'Envíos mensuales' },
  { number: '32', label: 'Ciudades cubiertas' },
  { number: '99%', label: 'Clientes satisfechos' },
];

const aboutCards = [
  {
    title: 'Nuestra Historia',
    text: 'ONUFAST nace con la misión de revolucionar la logística en Colombia, conectando personas y negocios con rapidez y seguridad.',
    image: 'public/Nosotros - Historia.jpg',
  },
  {
    title: 'Nuestra Misión',
    text: 'Entregar felicidad a tu puerta: rápido, seguro y confiable. Cada paquete es una promesa que cumplimos.',
    image: 'public/Nosotros - Misión.jpg',
  },
  {
    title: 'Nuestra Visión',
    text: 'Ser la empresa de logística más confiable de Latinoamérica, expandiendo fronteras sin perder el toque humano.',
    image: 'public/Nosotros - Vision.jpg',
  },
];

const values = [
  { icon: '⚡', label: 'Rapidez' },
  { icon: '🛡️', label: 'Confianza' },
  { icon: '❤️', label: 'Compromiso' },
];

const team = [
  { initials: 'YM', name: 'Yahir Moran', role: 'Backend Developer' },
  { initials: 'SR', name: 'Sofia Ramirez', role: 'Data Base Developer' },
  { initials: 'DP', name: 'Daniel Pulido', role: 'Frontend Developer' },
  { initials: 'EA', name: 'Esteban Angulo', role: 'Backend Developer' },
  { initials: 'DT', name: 'David Torres', role: 'Frontend Developer' },
];

export default function Nosotros() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <h1>Quiénes Somos</h1>
        <p>Conoce más sobre ONUFAST y nuestra misión</p>
      </section>

      <section className="page-content">
        {/* ESTADÍSTICAS */}
        <div className="nosotros-stats">
          {stats.map((s) => (
            <div className="nosotros-stat-card" key={s.label}>
              <span className="nosotros-stat-number">{s.number}</span>
              <span className="nosotros-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* TARJETAS HISTORIA / MISIÓN / VISIÓN */}
        <div className="about-grid">
          {aboutCards.map((card) => (
            <div className="about-card nosotros-about-card" key={card.title}>
              <div className="nosotros-card-img">
                {card.image ? (
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    onError={(e) => {
                      // ✅ Fallback si la imagen no carga
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = <span class="nosotros-card-emoji">📸</span>;
                    }}
                  />
                ) : (
                  <span className="nosotros-card-emoji">{card.emoji || '📄'}</span>
                )}
              </div>
              <div className="nosotros-card-body">
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* VALORES */}
        <div className="nosotros-values">
          {values.map((v) => (
            <div className="nosotros-value-pill" key={v.label}>
              <span className="nosotros-value-icon">{v.icon}</span>
              <span className="nosotros-value-text">{v.label}</span>
            </div>
          ))}
        </div>

        {/* EQUIPO */}
        <div className="nosotros-team-section">
          <h2 className="nosotros-section-title">Nuestro equipo</h2>
          <div className="nosotros-team-grid">
            {team.map((member) => (
              <div className="nosotros-team-card" key={member.name}>
                <div className="nosotros-avatar">
                  <span>{member.initials}</span>
                </div>
                <p className="nosotros-team-name">{member.name}</p>
                <p className="nosotros-team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}