import { useEffect, useState } from "react";
import api from "@/shared/api";
import "./CSS/PerfilConductor.css";

/* ==========================================
   ICONOS SVG (mismo estilo que el resto del panel)
========================================== */

function Icono({ size = 18, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const IconCorreo = (p) => (
  <Icono {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icono>
);

const IconTelefono = (p) => (
  <Icono {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </Icono>
);

const IconDocumento = (p) => (
  <Icono {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M5.5 16c.5-1.3 1.3-2 2.5-2s2 .7 2.5 2M14 10h5M14 14h5" />
  </Icono>
);

const IconNumero = (p) => (
  <Icono {...p}>
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </Icono>
);

const IconReloj = (p) => (
  <Icono {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icono>
);

const IconEscudo = (p) => (
  <Icono {...p}>
    <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3z" />
    <path d="m9 12 2 2 4-4" />
  </Icono>
);

const IconAlerta = (p) => (
  <Icono {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Icono>
);

const IconActualizar = (p) => (
  <Icono {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 12A9 9 0 0 1 18.5 5.8L21 8" />
    <path d="M21 3v5h-5M3 21v-5h5" />
  </Icono>
);

/* ==========================================
   DATO: una fila con icono, etiqueta y valor
   Si el valor viene vacÃ­o, se muestra atenuado
========================================== */

function Dato({ Icon, etiqueta, valor, vacio = "No disponible" }) {
  const tieneValor = valor !== null && valor !== undefined && valor !== "";

  return (
    <div className="perfil-dato">
      <span className="perfil-dato-icono">
        <Icon />
      </span>
      <div>
        <dt>{etiqueta}</dt>
        <dd className={tieneValor ? "" : "sin-dato"}>
          {tieneValor ? valor : vacio}
        </dd>
      </div>
    </div>
  );
}

export default function PerfilConductor() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [fotoFallo, setFotoFallo] = useState(false);

  // Fuera del useEffect para poder reintentar si falla
  const cargarPerfil = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/usuarios/perfil");
      setPerfil(respuesta.data);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      setError("No fue posible cargar tu informaciÃ³n.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  /* ---------- CARGANDO: esqueleto con la forma del perfil ---------- */
  if (cargando) {
    return (
      <div className="perfil-conductor" aria-busy="true">
        <div className="perfil-portada perfil-esqueleto">
          <span className="esq esq-avatar" />
          <div className="esq-textos">
            <span className="esq esq-linea" />
            <span className="esq esq-linea corta" />
          </div>
        </div>

        <div className="perfil-secciones">
          {[1, 2, 3].map((n) => (
            <div className="perfil-seccion perfil-esqueleto" key={n}>
              <span className="esq esq-linea corta" />
              <span className="esq esq-bloque" />
              <span className="esq esq-bloque" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error || !perfil) {
    return (
      <div className="perfil-conductor">
        <div className="perfil-error" role="alert">
          <span className="perfil-error-icono">
            <IconAlerta size={28} />
          </span>
          <h3>No se pudo cargar tu perfil</h3>
          <p>{error || "No recibimos informaciÃ³n del servidor."}</p>
          <button type="button" onClick={cargarPerfil}>
            <IconActualizar size={16} />
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const nombre = perfil.nombre || "Conductor";
  const inicial = nombre.trim().charAt(0).toUpperCase();
  const roles = perfil.roles?.length > 0 ? perfil.roles : [];

  return (
    <div className="perfil-conductor">
      {/* PORTADA */}
      <header className="perfil-portada">
        <div className="perfil-avatar">
          {fotoFallo ? (
            <span className="perfil-avatar-inicial">{inicial}</span>
          ) : (
            <img
              src="#"
              alt={`Foto de perfil de ${nombre}`}
              onError={() => setFotoFallo(true)}
            />
          )}
        </div>

        <div className="perfil-nombre">
          <h1>{nombre}</h1>
          <p>Conductor ONUFAST</p>

          <div className="perfil-etiquetas">
            {roles.length > 0 ? (
              roles.map((rol) => (
                <span className="perfil-rol" key={rol}>
                  {rol}
                </span>
              ))
            ) : (
              <span className="perfil-rol perfil-rol--vacio">
                Sin rol asignado
              </span>
            )}

            {perfil.id_usuario != null && (
              <span className="perfil-id">ID {perfil.id_usuario}</span>
            )}
          </div>
        </div>
      </header>

      {/* DATOS AGRUPADOS POR TEMA */}
      <div className="perfil-secciones">
        <section className="perfil-seccion">
          <h2>Contacto</h2>
          <dl>
            <Dato
              Icon={IconCorreo}
              etiqueta="Correo electrÃ³nico"
              valor={perfil.correo}
            />
            <Dato
              Icon={IconTelefono}
              etiqueta="TelÃ©fono"
              valor={perfil.telefono}
            />
          </dl>
        </section>

        <section className="perfil-seccion">
          <h2>Documento</h2>
          <dl>
            <Dato
              Icon={IconDocumento}
              etiqueta="Tipo de documento"
              valor={perfil.tipo_documento}
            />
            <Dato
              Icon={IconNumero}
              etiqueta="NÃºmero de documento"
              valor={perfil.num_documento}
            />
          </dl>
        </section>

        <section className="perfil-seccion">
          <h2>Trabajo</h2>
          <dl>
            <Dato
              Icon={IconReloj}
              etiqueta="Jornada"
              valor={perfil.jornada}
              vacio="No definida"
            />
            <Dato
              Icon={IconEscudo}
              etiqueta="Rol"
              valor={roles.join(", ")}
              vacio="Sin rol asignado"
            />
          </dl>
        </section>
      </div>
    </div>
  );
}
