export default function ComoFunciona() {
  const pasos = [
    { numero: "1", titulo: "Regístrate", desc: "Crea tu cuenta en segundos de forma segura." },
    { numero: "2", titulo: "Crea tu pedido", desc: "Ingresa los datos de origen, destino y paquete." },
    { numero: "3", titulo: "Lo recogemos", desc: "Nuestro equipo se encarga de la recolección en tu puerta." },
    { numero: "4", titulo: "Lo entregamos", desc: "Llevamos felicidad y seguridad hasta el destino final." }
  ];

  return (
    <section className="como-funciona-section">
      <h2 className="section-title-light">Cómo Funciona</h2>
      <p className="section-subtitle">Tu envío seguro en cuatro pasos simples</p>
      
      <div className="pasos-container">
        {pasos.map((paso, index) => (
          <div key={index} className="paso-card">
            <div className="paso-numero">{paso.numero}</div>
            <h3>{paso.titulo}</h3>
            <p>{paso.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}