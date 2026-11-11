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
🐧 Guía de Instalación y Ejecución (Linux Mint 22 XFCE)

Esta guía permite instalar, configurar y ejecutar ONUFAST en Linux Mint 22 XFCE Edition, utilizando PostgreSQL, Python, FastAPI, Node.js y React.

Los siguientes pasos fueron comprobados durante el proceso de instalación en Linux Mint 22 con Python 3.12.

1. Requisitos Previos e Instalación de Herramientas

Abre una terminal utilizando Ctrl + Alt + T.

Actualiza los paquetes del sistema:

sudo apt update && sudo apt upgrade -y

Instala las herramientas necesarias:

sudo apt install -y git curl python3 python3-pip python3-venv python3-full postgresql postgresql-contrib

Comprueba que Python y Git estén instalados:

python3 --version
git --version

2. Instalar Node.js y npm

Instala Node.js 22 utilizando NodeSource:

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

Comprueba las versiones instaladas:

node --version
npm --version

3. Clonar el Repositorio

Ubícate en la carpeta donde deseas guardar el proyecto.

Por ejemplo, para guardarlo en el Escritorio:

cd ~/Escritorio

Clona el repositorio:

git clone https://github.com/SteveCortesDev/ONUFAST_3407181.git

Accede a la carpeta del proyecto:

cd ONUFAST_3407181

Selecciona la rama correspondiente:

git checkout reestructuracion

4. Configurar PostgreSQL

Inicia y habilita el servicio de PostgreSQL:

sudo systemctl enable --now postgresql

1. Accede a PostgreSQL como administrador del sistema:

En Linux Mint, PostgreSQL utiliza inicialmente autenticación Peer para las conexiones locales. Por eso, se recomienda acceder mediante:

sudo -u postgres psql

2. Configura la contraseña del usuario postgres:

Dentro de la consola de PostgreSQL, ejecuta:

ALTER USER postgres WITH PASSWORD 'Sena1234';

3. Crea la base de datos del proyecto:

CREATE DATABASE onufast_db;

Sal de PostgreSQL:

\q

Comprueba el estado del servicio:

sudo systemctl status postgresql

5. Configurar y Levantar el Backend (Python / FastAPI)

1. Accede a la carpeta del backend:

Desde la raíz del proyecto:

cd backend

2. Crea el entorno virtual de Python:

python3 -m venv venv

3. Activa el entorno virtual:

source venv/bin/activate

Cuando esté activado, aparecerá (venv) al inicio de la terminal.

4. Actualiza pip:

python -m pip install --upgrade pip

5. Instala las dependencias del backend:

pip install -r requirements.txt

Este comando instala las librerías definidas en requirements.txt, incluyendo FastAPI, SQLAlchemy, Uvicorn, psycopg2-binary y las demás dependencias del proyecto.

6. Instala la versión específica de Bcrypt:

pip install bcrypt==4.0.1

7. Configura las variables de entorno:

Crea el archivo .env dentro de backend/:

nano .env

Agrega la siguiente configuración:

DATABASE_URL=postgresql://postgres:Sena1234@localhost:5432/onufast_db

Guarda los cambios:

Ctrl + O para guardar.

Enter para confirmar.

Ctrl + X para salir.

8. Desactiva la expansión del historial de Bash:

Este paso es importante porque algunos comandos Python contienen caracteres especiales como !, que Bash puede interpretar como una instrucción del historial.

Ejecuta:

set +H

9. Sincroniza los modelos y crea las tablas:

Ejecuta el siguiente comando:

python -c "from core.database import engine, Base; import models; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine); print('Tablas creadas con exito')"

10. Poblar los roles del sistema:

python -c "from core.database import SessionLocal; from models.rol import Rol; db = SessionLocal(); [db.add(Rol(id_rol=rid, nombre_rol=rnombre)) for rid, rnombre in [(1, 'Administrador'), (2, 'Cliente'), (3, 'Conductor'), (4, 'Operador'), (5, 'Encargado de Bodega')] if not db.query(Rol).filter_by(id_rol=rid).first()]; db.commit(); print('Roles iniciales creados')"

11. Poblar los tipos de envío:

python -c "from core.database import SessionLocal; from models.tipo_envio import TipoEnvio; db = SessionLocal(); db.add_all([TipoEnvio(id_tipenvio=1, descripcion='Envio Estandar'), TipoEnvio(id_tipenvio=2, descripcion='Envio Express'), TipoEnvio(id_tipenvio=3, descripcion='Carga Pesada')]) if not db.query(TipoEnvio).first() else None; db.commit(); print('Tipos de envio creados')"

12. Crear el Administrador Principal:

python -c "from core.security import hash_password; from core.database import SessionLocal; from models.usuario import Usuario; from models.usuario_roles import UsuarioRol; db = SessionLocal(); u = Usuario(nombre='Admin', apellido='Principal', clave=hash_password('admin123'), correo='admin@onufast.com', telefono='0000000000', jornada='Completa'); db.add(u); db.commit(); db.refresh(u); db.add(UsuarioRol(id_usuario=u.id_usuario, id_rol=1)); db.commit(); print('Administrador creado con exito')"

13. Iniciar el servidor Backend:

uvicorn main:app --reload

El backend estará disponible en:

API: http://127.0.0.1:8000

Documentación Swagger UI: http://127.0.0.1:8000/docs

Mantén abierta esta terminal mientras utilices el sistema.

6. Configurar y Levantar el Frontend (React / Vite)

1. Abre una segunda terminal utilizando Ctrl + Alt + T.

Accede a la carpeta frontend:

cd ~/Escritorio/ONUFAST_3407181/frontend

Si clonaste el proyecto en otra ubicación, modifica la ruta según corresponda.

2. Instala las dependencias de Node.js:

npm install

Este comando instala los paquetes definidos en package.json y genera la carpeta node_modules/.

3. Inicia el entorno de desarrollo:

npm run dev

La interfaz web estará disponible en:

ONUFAST: http://localhost:5173

7. Acceso al Sistema

Una vez que los servidores Backend y Frontend estén funcionando, abre tu navegador y accede a:

Página principal: http://localhost:5173

Panel de administración: http://localhost:5173/admin

Registro de clientes: http://localhost:5173/registro

8. Finalizar la Ejecución

Para detener los servidores, utiliza:

Ctrl + C

Ejecuta el comando en cada terminal donde esté funcionando un servidor.

Para salir del entorno virtual de Python:

deactivate

¡Listo! ONUFAST estará configurado y funcionando en Linux Mint 22 XFCE Edition.

🔑 Credenciales de Acceso

👑 Administrador del Sistema

Correo: admin@onufast.com

Contraseña: admin123

Acceso: Total al panel de administración en http://localhost:5173/admin.

🧑‍💼 Clientes de Prueba

Puedes registrar nuevos clientes directamente desde la interfaz web de registro:

http://localhost:5173/registro

📂 Estructura del Proyecto

ONUFAST_3407181/
│
├── backend/                  # Código fuente de Python / FastAPI
│   ├── venv/                 # Entorno virtual de Python (local)
│   ├── core/                 # Configuración de base de datos y seguridad JWT
│   ├── db/                   # Scripts SQL y respaldos
│   ├── models/               # Modelos y entidades ORM (SQLAlchemy)
│   ├── routers/              # Endpoints y controladores de la API
│   ├── schemas/              # Esquemas de validación de datos (Pydantic)
│   ├── main.py               # Punto de entrada principal de FastAPI
│   ├── requirements.txt      # Dependencias de Python
│   └── .env                  # Variables de entorno y conexión a PostgreSQL
│
├── frontend/                 # Aplicación web en React / Vite
│   ├── node_modules/         # Dependencias instaladas de Node.js
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

⚠️ Consideraciones Importantes

El comando Base.metadata.drop_all(bind=engine) elimina las tablas existentes antes de crearlas nuevamente. No lo ejecutes en una base de datos que contenga información que quieras conservar.

El comando de creación del administrador está pensado para una instalación inicial. No debe ejecutarse repetidamente, ya que intentará registrar nuevamente el mismo usuario.

El archivo .env contiene información de conexión a la base de datos. No debe publicarse ni subirse al repositorio.

Las carpetas venv/ y node_modules/ se generan localmente mediante la instalación de dependencias y no necesitan compartirse en Git.

Las credenciales proporcionadas son de demostración y deben cambiarse antes de utilizar el sistema en un entorno de producción.

ONUFAST — Tecnología, velocidad y confianza para la logística colombiana.
