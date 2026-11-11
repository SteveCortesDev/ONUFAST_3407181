# 🚀 ONUFAST — Elevando el nivel de tus envíos

> La plataforma digital que revoluciona la logística y gestión de mensajería en Colombia.

![ONUFAST](https://img.shields.io/badge/ONUFAST-Sistema_Logístico-cc0000?style=for-the-badge&logo=box&logoColor=white)
![Status](https://img.shields.io/badge/Status-En_Desarrollo-orange?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)


---

## 📋 Tabla de Contenidos
1. [¿Qué es ONUFAST?](#-qué-es-onufast)
2. [Características Principales](#-características-principales)
3. [Guía de Instalación y Ejecución (Windows)](#-guía-de-instalación-y-ejecución-windows)
4. [Credenciales de Acceso](#-credenciales-de-acceso)
5. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 📦 ¿Qué es ONUFAST?

**ONUFAST** es una plataforma integral de gestión logística y envíos de paquetes diseñada para digitalizar completamente el proceso operativo de mensajería: desde el registro inicial del paquete y cotización, hasta su despacho, rastreo y entrega final. 

Nace con la misión de transformar la logística colombiana en una experiencia **rápida, segura, eficiente y totalmente transparente**.

---

## ✨ Características Principales

### 👥 Múltiples Roles Especializados

| Rol | Responsabilidades Principales |
| :--- | :--- |
| **Cliente** | Registra, cotiza, rastrea y gestiona sus envíos personales desde un portal intuitivo. |
| **Conductor** | Visualiza rutas asignadas, actualiza estados de entrega en tiempo real y reporta novedades. |
| **Encargado de Bodega** | Recibe, organiza, valida paquetes y gestiona inventarios de salida. |
| **Administrador** | Control total del sistema, gestión de usuarios, asignación dinámica de roles y supervisión global del tablero. |

### 📍 Rastreo en Tiempo Real
* **Código único:** Cada paquete cuenta con un identificador exclusivo (ej. `ONU-2AA56A4628`).
* **Ciclo de vida:** Seguimiento paso a paso del estado del envío:
  ```text
  En bodega ➔ En camino ➔ Entregado / Cancelado
  ```
* **Trazabilidad:** Historial completo de cambios de estado y auditoría de movimientos.

### 🔒 Seguridad y Autenticación
* Autenticación robusta basada en tokens **JWT (JSON Web Tokens)**.
* Encriptación de contraseñas mediante **Bcrypt**.
* Rutas protegidas tanto en el *backend* como en el *frontend* según el rol del usuario autenticado.

### 📦 Creación de Envíos (Wizard)
* Formulario interactivo guiado de múltiples pasos.
* Cálculo automático de tarifas según tipo de envío y características del paquete.
* Generación automática de códigos de rastreo y soporte completo de gestión documental.

---

## 💻 Guía de Instalación y Ejecución (Windows)

Sigue estos pasos detallados para clonar, configurar y poner en marcha el proyecto en un entorno local.

### 1. Requisitos Previos
Asegúrate de tener instalado en tu sistema:
* **Python 3.10+** *(Importante: Marcar la opción `"Add Python to PATH"` durante la instalación)*.
* **Node.js (LTS)** y **npm**.
* **PostgreSQL** *(Configurado con el superusuario predeterminado `postgres` y contraseña `Sena1234`)*.
* **Git**.

---

### 2. Clonar el Repositorio
Abre una terminal (**PowerShell** o **CMD**) y ejecuta:

```bash
git clone https://github.com/SteveCortesDev/ONUFAST_3407181.git
cd ONUFAST_3407181
git checkout reestructuracion
```

---

### 3. Configurar la Base de Datos en PostgreSQL
1. Conéctate a la consola de PostgreSQL desde tu terminal *(ingresa `Sena1234` cuando te solicite la contraseña)*:
   ```bash
   psql -U postgres
   ```
2. Crea la base de datos del proyecto y sal de la consola:
   ```sql
   CREATE DATABASE onufast_db;
   \q
   ```

---

### 4. Configurar y Levantar el Backend (Python / FastAPI)

1. **Accede a la carpeta del backend:**
   ```bash
   cd backend
   ```

2. **Crea y activa el entorno virtual:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
   > *Nota: Si PowerShell bloquea la ejecución de scripts, utiliza:* `cmd /c venv\Scripts\activate.bat`

3. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configura las variables de entorno:**
   Crea un archivo llamado `.env` dentro de la carpeta `backend/` y agrega la siguiente línea:
   ```env
   DATABASE_URL=postgresql://postgres:Sena1234@localhost:5432/onufast_db
   ```

5. **Sincroniza modelos y puebla los catálogos base:**
   Con el entorno virtual activo, ejecuta los siguientes comandos en orden:

   * **Crear tablas automáticas:**
     ```bash
     python -c "from core.database import engine, Base; import models; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine); print('¡Tablas creadas con éxito!')"
     ```

   * **Poblar roles del sistema:**
     ```bash
     python -c "from core.database import SessionLocal; from models.rol import Rol; db = SessionLocal(); [db.add(Rol(id_rol=rid, nombre_rol=rnombre)) for rid, rnombre in [(1, 'Administrador'), (2, 'Cliente'), (3, 'Conductor'), (4, 'Operador'), (5, 'Encargado de Bodega')] if not db.query(Rol).filter_by(id_rol=rid).first()]; db.commit(); print('¡Roles iniciales creados!')"
     ```

   * **Poblar tipos de envío:**
     ```bash
     python -c "from core.database import SessionLocal; from models.tipo_envio import TipoEnvio; db = SessionLocal(); db.add_all([TipoEnvio(id_tipenvio=1, descripcion='Envío Estándar'), TipoEnvio(id_tipenvio=2, descripcion='Envío Express'), TipoEnvio(id_tipenvio=3, descripcion='Carga Pesada')]) if not db.query(TipoEnvio).first() else None; db.commit(); print('¡Tipos de envío creados!')"
     ```
      
      Instalar depencia de incriptacion 
      ```pip install bcrypt==4.0.1```
   
   * **Crear el Administrador Principal:**
     ```bash
     python -c "from core.security import hash_password; from core.database import SessionLocal; from models.usuario import Usuario; from models.usuario_roles import UsuarioRol; db = SessionLocal(); u = Usuario(nombre='Admin', apellido='Principal', clave=hash_password('admin123'), correo='admin@onufast.com', telefono='0000000000', jornada='Completa'); db.add(u); db.commit(); db.refresh(u); db.add(UsuarioRol(id_usuario=u.id_usuario, id_rol=1)); db.commit(); print('¡Administrador creado con éxito!')"
     ```

6. **Inicia el servidor Backend:**
   ```bash
   uvicorn main:app --reload
   ```
   * **API activa en:** `http://127.0.0.1:8000`
   * **Documentación Swagger UI:** `http://127.0.0.1:8000/docs`

---

### 5. Configurar y Levantar el Frontend (React / Vite)

1. Abre una **nueva ventana de terminal** y navega a la carpeta `frontend`:
   ```bash
   cd C:\Ruta\Al\Proyecto\ONUFAST_3407181\frontend
   ```

2. **Instala las dependencias de Node:**
   ```bash
   npm install
   ```

3. **Inicia el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   * **Interfaz web disponible en:** `http://localhost:5173`

---

## 🔑 Credenciales de Acceso

### 👑 Administrador del Sistema
* **Correo:** `admin@onufast.com`
* **Contraseña:** `admin123`
* **Acceso:** Total al panel de administración en `http://localhost:5173/admin`.

### 🧑‍💼 Clientes de Prueba
Puedes registrar nuevos clientes directamente desde la interfaz web de registro en:
* `http://localhost:5173/registro`

---

## 📂 Estructura del Proyecto

```text
ONUFAST_3407181/
├── backend/                  # Código fuente de Python / FastAPI
│   ├── core/                 # Configuración de base de datos y seguridad JWT
│   ├── db/                   # Scripts SQL y respaldos
│   ├── models/               # Modelos y entidades ORM (SQLAlchemy)
│   ├── routers/              # Endpoints y controladores de la API
│   ├── schemas/              # Esquemas de validación de datos (Pydantic)
│   ├── main.py               # Punto de entrada principal de FastAPI
│   └── requirements.txt      # Dependencias de Python
│
├── frontend/                 # Aplicación web en React / Vite
│   ├── public/               # Recursos e imágenes estáticas
│   ├── src/                  # Código fuente de la interfaz
│   │   ├── app/              # Configuración raíz (App.jsx, main.jsx)
│   │   ├── features/         # Módulos funcionales (admin, auth, envios, usuario)
│   │   ├── shared/           # Cliente Axios, rutas protegidas y componentes reutilizables
│   │   └── styles/           # Hojas de estilo CSS globales y modulares
│   ├── package.json          # Dependencias de Node.js
│   └── vite.config.js        # Configuración de Vite y alias de rutas (@/)
│
└── README.md                 # Documentación general del proyecto
```
