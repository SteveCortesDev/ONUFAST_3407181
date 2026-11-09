# 🚀 ONUFAST — Elevando el nivel de tus envíos

<div align="center">

![ONUFAST](https://img.shields.io/badge/ONUFAST-Sistema_Logístico-cc0000?style=for-the-badge&logo=box&logoColor=white)
![Status](https://img.shields.io/badge/Status-En_Desarrollo-orange?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**La plataforma digital que revoluciona la logística en Colombia**

[Documentación](#-instalación-y-ejecución) • [Características](#-características-principales) • [Roles](#-múltiples-roles-especializados)
</div>

---

## 📦 ¿Qué es ONUFAST?

ONUFAST es una plataforma integral de gestión logística y envíos de paquetes diseñada para digitalizar completamente el proceso de mensajería, desde el registro del paquete hasta su entrega final. Nace con la misión de transformar la logística colombiana en una experiencia rápida, segura y totalmente transparente.

No es solo un sistema, es **la evolución de la logística moderna**.

---

## ✨ Características Principales

### Múltiples Roles Especializados
- **Cliente**: Registra, rastrea y gestiona sus envíos desde un portal intuitivo.
- **Conductor**: Entrega paquetes, actualiza estados en tiempo real y reporta novedades.
- **Encargado de Bodega**: Recibe, organiza y despacha paquetes con eficiencia.
- **Administrador**: Control total del sistema, gestión de usuarios, rutas y asignación de roles.

### Rastreo en Tiempo Real
Cada paquete tiene un código único de rastreo. El cliente ve exactamente dónde está en cada momento:
- En bodega → En camino → Entregado.
- Con cambios de estado registrados, fecha y quién realizó cada acción.

### Seguridad y Autenticación
- Login protegido con encriptación de contraseñas (Bcrypt).
- Tokens de seguridad (JWT) para mantener la sesión activa.
- Rutas protegidas: un cliente no puede entrar al panel de administrador.

### Creación de Envíos (Wizard)
- Formulario intuitivo de 4 pasos.
- Cálculo automático de precio base + recargo por peso.
- Pasarela de pago simulada (Efectivo, Transferencia, Tarjeta).
- Generación de código de rastreo único (Ej: `ONU-2AA56A4628`).

---

## 💻 Instalación y Ejecución (Windows)

Sigue estos pasos **al pie de la letra** para levantar el proyecto en tu computadora.

### 1. Requisitos Previos
Asegúrate de tener instalado:
- [Python 3.10+](https://www.python.org/downloads/) *(Importante: Marcar "Add Python to PATH")*
- [Node.js LTS](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/windows/) *(Configurar el usuario `postgres` con la contraseña `Sena1234`)*
- [Git](https://git-scm.com/)

### 2. Clonar el Repositorio
Abre una terminal (PowerShell o CMD) y ejecuta:
```bash
git clone https://github.com/SteveCortesDev/ONUFAST_3407181.git
cd ONUFAST_3407181
git checkout reestructuracion
3. Configurar la Base de Datos
Abre una terminal y conéctate a PostgreSQL (te pedirá la contraseña Sena1234):

bash
psql -U postgres
Dentro de la consola de Postgres, crea la base de datos:

sql
CREATE DATABASE onufast_db;
\q
Carga todas las tablas y datos de prueba ejecutando este comando (desde la raíz del proyecto):

bash
psql -U postgres -d onufast_db -f "backend/db/Base de datos onufast.sql"
4. Configurar el Backend (Python/FastAPI)
Entra a la carpeta del backend:

bash
cd backend
Crea y activa un entorno virtual:

bash
python -m venv venv
.\venv\Scripts\activate
Instala las dependencias:

bash
pip install -r requirements.txt
Crear el archivo .env: Crea un archivo llamado .env dentro de la carpeta backend y pega esta línea:

env
DATABASE_URL=postgresql://postgres:Sena1234@localhost:5432/onufast_db
Levanta el servidor:

bash
uvicorn main:app --reload
El backend estará en http://127.0.0.1:8000. Documentación en http://127.0.0.1:8000/docs.

5. Configurar el Frontend (React/Vite)
Abre otra terminal y ejecuta:

Entra a la carpeta del frontend (desde la raíz del proyecto):

bash
cd frontend
Instala los módulos de Node:

bash
npm install
Levanta el servidor de desarrollo:

bash
npm run dev
El frontend estará en http://localhost:5173.

🔑 Credenciales de Prueba
👑 Administrador (Creado manualmente)
Para crear el Super Administrador (necesario para ver el panel de Admin), con el entorno virtual de Python activado, ejecuta este comando:

bash
python -c "from core.security import hash_password; from core.database import SessionLocal; from models.usuario import Usuario; from models.usuario_roles import UsuarioRol; db = SessionLocal(); u = Usuario(nombre='Admin', apellido='Principal', clave=hash_password('admin123'), correo='admin@onufast.com', telefono='0000000000', jornada='Completa'); db.add(u); db.commit(); db.refresh(u); r = UsuarioRol(id_usuario=u.id_usuario, id_rol=1); db.add(r); db.commit(); print('Administrador creado')"
Correo: admin@onufast.com

Contraseña: admin123

🧑‍💼 Clientes (Creados por el script SQL)
Correo: daniel@gmail.com | Contraseña: 123456

Correo: laura@gmail.com | Contraseña: 123456

📂 Estructura del Proyecto
text
ONUFAST_3407181/
├── backend/            # Código fuente de Python/FastAPI
│   ├── core/           # Configuración de BD y Seguridad
│   ├── db/             # Script SQL
│   ├── models/         # Tablas de SQLAlchemy
│   ├── routers/        # Endpoints de la API
│   ├── schemas/        # Validaciones de Pydantic
│   ├── main.py         # Punto de entrada del Backend
│   └── requirements.txt
│
├── frontend/           # Código fuente de React/Vite
│   ├── public/         # Imágenes estáticas
│   ├── src/            # Código fuente
│   │   ├── app/        # App.jsx y main.jsx
│   │   ├── features/   # Módulos (admin, auth, envios, usuario)
│   │   ├── shared/     # API y componentes reutilizables
│   │   └── styles/     # Archivos CSS
│   ├── package.json
│   └── vite.config.js
│
└── README.md           # Este archivo