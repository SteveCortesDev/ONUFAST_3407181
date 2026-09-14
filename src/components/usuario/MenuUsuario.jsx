export default function MenuUsuario({
    menuActivo,
    cambiarMenu,
    navigate,
    cerrarSesion
}) {

    return (

        <aside className="usuario-sidebar">

            <button
                className={`sidebar-item ${
                    menuActivo === "panel"
                        ? "activo"
                        : ""
                }`}
                onClick={() =>
                    cambiarMenu("panel")
                }
            >
                <span>⌂</span>
                Panel de Usuario
            </button>


            <button
                className={`sidebar-item ${
                    menuActivo === "paquete"
                        ? "activo"
                        : ""
                }`}
                onClick={() =>
                    cambiarMenu("paquete")
                }
            >
                <span>▣</span>
                Registrar Paquete
            </button>


            <button
                className={`sidebar-item ${
                    menuActivo === "envios"
                        ? "activo"
                        : ""
                }`}
                onClick={() =>
                    cambiarMenu("envios")
                }
            >
                <span>▱</span>
                Mis Envíos
            </button>


            <button
                className="sidebar-item"
                onClick={() =>
                    navigate("/rastreo")
                }
            >
                <span>⌕</span>
                Rastrear Envío
            </button>


            <button
                className={`sidebar-item ${
                    menuActivo === "perfil"
                        ? "activo"
                        : ""
                }`}
                onClick={() =>
                    cambiarMenu("perfil")
                }
            >
                <span>♙</span>
                Mi Perfil
            </button>


            <div className="sidebar-separador"></div>


            <button
                className="cerrar-sesion"
                onClick={cerrarSesion}
            >
                <span>↪</span>
                Cerrar Sesión
            </button>

        </aside>
    );
}