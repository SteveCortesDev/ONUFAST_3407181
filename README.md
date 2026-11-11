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
## 🐧 Guía de Instalación y Ejecución (Linux Mint 22 XFCE Edition)

Esta guía explica cómo instalar, configurar y ejecutar **ONUFAST** en un entorno Linux Mint 22 XFCE Edition, utilizando PostgreSQL como sistema gestor de bases de datos, Python con FastAPI para el backend y React con Vite para el frontend.

### 1. Requisitos previos

Antes de comenzar, abre una terminal (`Ctrl + Alt + T`) y actualiza los paquetes del sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

Instala las herramientas necesarias:

```bash
sudo apt install -y git curl python3 python3-pip python3-venv python3-full postgresql postgresql-contrib
```

Comprueba que Python y Git estén instalados:

```bash
python3 --version
git --version
```

### 2. Instalar Node.js y npm

Se recomienda utilizar una versión LTS de Node.js compatible con el proyecto.

Instala Node.js mediante NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Comprueba las versiones instaladas:

```bash
node --version
npm --version
```

### 3. Clonar el repositorio

Ubícate en la carpeta donde deseas guardar el proyecto y ejecuta:

```bash
git clone https://github.com/SteveCortesDev/ONUFAST_3407181.git
cd ONUFAST_3407181
git checkout reestructuracion
```

### 4. Configurar PostgreSQL

Inicia y habilita el servicio de PostgreSQL:

```bash
sudo systemctl enable --now postgresql
```

Accede a la consola de PostgreSQL como usuario administrador:

```bash
sudo -u postgres psql
```

Dentro de PostgreSQL, crea el usuario y la base de datos:

```sql
ALTER USER postgres WITH PASSWORD 'Sena1234';

CREATE DATABASE onufast_db;

\q
```

Comprueba que PostgreSQL esté funcionando:

```bash
sudo systemctl status postgresql
```

### 5. Configurar y levantar el Backend (Python / FastAPI)

**1. Accede a la carpeta del backend:**

```bash
cd backend
```

**2. Crea el entorno virtual:**

```bash
python3 -m venv venv
```

**3. Activa el entorno virtual:**

```bash
source venv/bin/activate
```

Al activarlo, aparecerá `(venv)` al inicio de la línea de comandos.

**4. Actualiza pip e instala las dependencias:**

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**5. Instala la versión específica de Bcrypt utilizada por el proyecto:**

```bash
pip install bcrypt==4.0.1
```

**6. Configura las variables de entorno:**

Crea un archivo `.env` dentro de la carpeta `backend/`:

```bash
nano .env
```

Agrega la siguiente configuración:

```env
DATABASE_URL=postgresql://postgres:Sena1234@localhost:5432/onufast_db
```

Guarda los cambios con `Ctrl + O`, presiona `Enter` y sal con `Ctrl + X`.

**7. Sincroniza los modelos y crea las tablas:**

Ejecuta el siguiente comando para crear las tablas de la base de datos:

```bash
python -c "from core.database import engine, Base; import models; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine); print('¡Tablas creadas con éxito!')"
```

**8. Registra los roles iniciales del sistema:**

```bash
python -c "from core.database import SessionLocal; from models.rol import Rol; db = SessionLocal(); [db.add(Rol(id_rol=rid, nombre_rol=rnombre)) for rid, rnombre in [(1, 'Administrador'), (2, 'Cliente'), (3, 'Conductor'), (4, 'Operador'), (5, 'Encargado de Bodega')] if not db.query(Rol).filter_by(id_rol=rid).first()]; db.commit(); print('¡Roles iniciales creados!')"
```

**9. Registra los tipos de envío:**

```bash
python -c "from core.database import SessionLocal; from models.tipo_envio import TipoEnvio; db = SessionLocal(); db.add_all([TipoEnvio(id_tipenvio=1, descripcion='Envío Estándar'), TipoEnvio(id_tipenvio=2, descripcion='Envío Express'), TipoEnvio(id_tipenvio=3, descripcion='Carga Pesada')]) if not db.query(TipoEnvio).first() else None; db.commit(); print('¡Tipos de envío creados!')"
```

**10. Crea el administrador principal:**

```bash
python -c "from core.security import hash_password; from core.database import SessionLocal; from models.usuario import Usuario; from models.usuario_roles import UsuarioRol; db = SessionLocal(); u = Usuario(nombre='Admin', apellido='Principal', clave=hash_password('admin123'), correo='admin@onufast.com', telefono='0000000000', jornada='Completa'); db.add(u); db.commit(); db.refresh(u); db.add(UsuarioRol(id_usuario=u.id_usuario, id_rol=1)); db.commit(); print('¡Administrador creado con éxito!')"
```

**11. Inicia el servidor Backend:**

```bash
uvicorn main:app --reload
```

El backend estará disponible en:

- **API:** http://127.0.0.1:8000
- **Documentación Swagger:** http://127.0.0.1:8000/docs

No cierres esta terminal mientras utilices el sistema.

### 6. Configurar y levantar el Frontend (React / Vite)

**1. Abre una segunda terminal** (`Ctrl + Alt + T`).

Accede a la carpeta frontend del proyecto. Si clonaste el repositorio en tu carpeta personal, ejecuta:

```bash
cd ~/ONUFAST_3407181/frontend
```

**2. Instala las dependencias de Node.js:**

```bash
npm install
```

**3. Inicia el servidor de desarrollo:**

```bash
npm run dev
```

La interfaz web estará disponible en:

- **ONUFAST:** http://localhost:5173

### 7. Acceso al sistema

Una vez que los servidores Backend y Frontend estén funcionando, abre tu navegador y accede a:

- **Página principal:** http://localhost:5173
- **Panel de administración:** http://localhost:5173/admin
- **Registro de clientes:** http://localhost:5173/registro

**Credenciales del administrador:**

- **Correo:** `admin@onufast.com`
- **Contraseña:** `admin123`

### 8. Finalizar la ejecución

Para detener los servidores, utiliza `Ctrl + C` en sus respectivas terminales.

Para salir del entorno virtual de Python:

```bash
deactivate
```

**¡Listo!** ONUFAST estará configurado y funcionando en Linux Mint 22 XFCE Edition.
