# 🚀 ONUFAST — Elevando el nivel de tus envíos

> **La plataforma digital que revoluciona la logística y gestión de mensajería en Colombia.**

<p align="center">
  <img src="https://img.shields.io/badge/ONUFAST-Sistema_Logístico-cc0000?style=for-the-badge&logo=box&logoColor=white" alt="ONUFAST"/>
  <img src="https://img.shields.io/badge/Status-En_Desarrollo-orange?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python" alt="Python"/>
</p>

---

## 📋 Tabla de Contenidos

1. [¿Qué es ONUFAST?](#-qué-es-onufast)
2. [Características Principales](#-características-principales)
   - [Múltiples Roles Especializados](#-múltiples-roles-especializados)
   - [Rastreo en Tiempo Real y Mapas Interactivos](#-rastreo-en-tiempo-real-y-mapas-interactivos)
   - [Seguridad y Autenticación](#-seguridad-y-autenticación)
   - [Creación de Envíos y Asignación Operativa](#-creación-de-envíos-wizard-y-asignación-operativa)
3. [Guía de Instalación y Ejecución (Windows)](#-guía-de-instalación-y-ejecución-windows)
4. [Credenciales de Acceso](#-credenciales-de-acceso)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Instalación en Linux Mint 22 XFCE](#-instalación-en-linux-mint-22-xfce)
7. [Finalizar la Ejecución](#-finalizar-la-ejecución)

---

## 📦 ¿Qué es ONUFAST?

**ONUFAST** es una plataforma integral de gestión logística y envíos de paquetes diseñada para digitalizar completamente el proceso operativo de mensajería: desde el registro inicial del paquete y cotización, hasta su despacho, rastreo y entrega final.

Nace con la misión de transformar la logística colombiana en una experiencia **rápida, segura, eficiente y totalmente transparente**.

La plataforma integra diferentes módulos operativos que permiten conectar clientes, conductores, encargados de bodega y administradores dentro de un mismo ecosistema digital.

---

## ✨ Características Principales

### 👥 Múltiples Roles Especializados

ONUFAST cuenta con un sistema de gestión de usuarios basado en roles, donde cada perfil tiene permisos y responsabilidades específicas.

| Rol | Responsabilidades principales |
| :--- | :--- |
| **Cliente** | Registra, cotiza, selecciona el punto exacto en el mapa, rastrea y gestiona sus envíos personales desde un portal intuitivo. |
| **Conductor** | Visualiza rutas asignadas, actualiza estados de entrega en tiempo real, navega hacia el destino exacto y reporta novedades. |
| **Encargado de Bodega** | Recibe, organiza, valida paquetes y gestiona inventarios de salida. |
| **Administrador** | Tiene control total del sistema, asigna paquetes directamente a conductores, gestiona usuarios y roles y supervisa el tablero global. |

### 📍 Rastreo en Tiempo Real y Mapas Interactivos

El sistema incorpora herramientas de geolocalización que permiten conocer la ubicación de los envíos y facilitar su seguimiento.

- **Código único:** Cada paquete cuenta con un identificador exclusivo para facilitar su seguimiento. Ejemplo: `ONU-2AA56A4628`.

- **Punto exacto de entrega (`SelectorUbicacionMapa`):** Permite seleccionar las coordenadas de destino (`latitud_destino` y `longitud_destino`) mediante el GPS del navegador, un clic directo o un marcador arrastrable sobre OpenStreetMap con Leaflet durante el registro del paquete.

- **Visualización en mapa (`MapaRastreo`):** Muestra el marcador en vivo del conductor, el marcador del punto de entrega y una línea punteada que conecta la ubicación actual con el destino, tanto en el seguimiento de envíos como en las entregas del conductor.

- **Ciclo de vida del envío:** Seguimiento paso a paso del estado de cada paquete.

```text
En bodega ➔ En camino ➔ Entregado / Cancelado
```

- **Trazabilidad:** Historial completo de cambios de estado y auditoría de movimientos.

### 🔒 Seguridad y Autenticación

ONUFAST implementa mecanismos de seguridad para proteger la información y controlar el acceso a los diferentes módulos de la plataforma.

- Autenticación robusta basada en tokens **JWT (JSON Web Tokens)**.
- Encriptación de contraseñas mediante **Bcrypt**.
- Rutas protegidas tanto en el backend como en el frontend según el rol del usuario autenticado.

### 📦 Creación de Envíos (Wizard) y Asignación Operativa

El sistema incorpora un proceso guiado para facilitar el registro y la administración de paquetes.

- **Formulario interactivo de múltiples pasos:** Permite registrar envíos mediante un proceso guiado, con selección visual del punto de entrega y confirmación de coordenadas.

- **Cálculo automático de tarifas:** Calcula los costos según el tipo de envío y las características del paquete.

- **Generación automática de códigos:** Cada envío obtiene su propio código de rastreo.

- **Gestión documental:** Soporte completo para la gestión documental de los envíos.

- **Asignación de paquetes a conductores:** Desde el panel administrativo se pueden asignar rápidamente paquetes mediante el endpoint `POST /rutas/asignar-envio`, reutilizando la ruta activa del conductor o creando una nueva automáticamente y actualizando el conteo de paquetes.

---

# 💻 Guía de Instalación y Ejecución (Windows)

Sigue estos pasos detallados para clonar, configurar y poner en marcha el proyecto en un entorno local de Windows.

## 1. 📋 Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas:

| Herramienta | Requisito |
| :--- | :--- |
| **Python** | Versión 3.10 o superior. |
| **Node.js** | Versión LTS. |
| **npm** | Incluido con Node.js. |
| **PostgreSQL** | Configurado con el superusuario predeterminado `postgres` y contraseña `Sena1234`. |
| **Git** | Instalado y configurado. |

> ⚠️ **Importante:** Durante la instalación de Python, marca la opción **Add Python to PATH**.

## 2. 📥 Clonar el Repositorio

Abre una terminal (PowerShell o CMD) y ejecuta:

```bash
git clone https://github.com/SteveCortesDev/ONUFAST_3407181.git
```

Entra en la carpeta del proyecto:

```bash
cd ONUFAST_3407181
```

> El repositorio ya trabaja sobre la rama principal.

## 3. 🗄️ Configurar la Base de Datos en PostgreSQL

Conéctate a la consola de PostgreSQL desde tu terminal:

```bash
psql -U postgres
```

Ingresa la contraseña:

```text
Sena1234
```

Crea la base de datos del proyecto:

```sql
CREATE DATABASE onufast_db;
```

Sal de la consola:

```sql
\q
```

## 4. 🐍 Configurar y Levantar el Backend (Python / FastAPI)

Accede a la carpeta del backend:

```bash
cd backend
```

### Crear y activar el entorno virtual

```bash
python -m venv venv
```

Activa el entorno virtual:

```bash
.\venv\Scripts\activate
```

> 💡 **Nota:** Si PowerShell bloquea la ejecución de scripts, utiliza:

```cmd
cmd /c venv\Scripts\activate.bat
```

### Instalar las dependencias

```bash
pip install -r requirements.txt
```

### Configurar las variables de entorno

Crea un archivo llamado `.env` dentro de la carpeta `backend/` y agrega la siguiente configuración:

```env
DATABASE_URL=postgresql://postgres:Sena1234@localhost:5432/onufast_db
```

### Sincronizar los modelos y crear las tablas

Con el entorno virtual activo, ejecuta:

```bash
python -c "from core.database import engine, Base; import models; Base.metadata.create_all(bind=engine); print('¡Tablas creadas/actualizadas con éxito!')"
```

> **Nota:** Este comando crea o actualiza las tablas automáticamente, incluyendo las coordenadas de destino en los paquetes.
>
> Si necesitas recrear las tablas desde cero en un entorno limpio de pruebas, puedes ejecutar previamente `Base.metadata.drop_all(bind=engine)` dentro del mismo bloque `python -c`. Este procedimiento elimina las tablas y sus datos existentes.

### Poblar los roles del sistema

Ejecuta el siguiente comando para registrar los roles iniciales:

```bash
python -c "from core.database import SessionLocal; from models.rol import Rol; db = SessionLocal(); [db.add(Rol(id_rol=rid, nombre_rol=rnombre)) for rid, rnombre in [(1, 'Administrador'), (2, 'Cliente'), (3, 'Conductor'), (4, 'Operador'), (5, 'Encargado de Bodega')] if not db.query(Rol).filter_by(id_rol=rid).first()]; db.commit(); print('¡Roles iniciales creados!')"
```

### Poblar los tipos de envío

```bash
python -c "from core.database import SessionLocal; from models.tipo_envio import TipoEnvio; db = SessionLocal(); db.add_all([TipoEnvio(id_tipenvio=1, descripcion='Envío Estándar'), TipoEnvio(id_tipenvio=2, descripcion='Envío Express'), TipoEnvio(id_tipenvio=3, descripcion='Carga Pesada')]) if not db.query(TipoEnvio).first() else None; db.commit(); print('¡Tipos de envío creados!')"
```

### Instalar la dependencia de encriptación

```bash
pip install bcrypt==4.0.1
```

### Crear el Administrador Principal

Ejecuta el siguiente comando para generar el usuario administrador:

```bash
python -c "from core.security import hash_password; from core.database import SessionLocal; from models.usuario import Usuario; from models.usuario_roles import UsuarioRol; db = SessionLocal(); u = Usuario(nombre='Admin', apellido='Principal', clave=hash_password('admin123'), correo='admin@onufast.com', telefono='0000000000', jornada='Completa'); db.add(u); db.commit(); db.refresh(u); db.add(UsuarioRol(id_usuario=u.id_usuario, id_rol=1)); db.commit(); print('¡Administrador creado con éxito!')"
```

### Iniciar el servidor Backend

```bash
uvicorn main:app --reload
```

El backend estará disponible en:

| Servicio | Dirección |
| :--- | :--- |
| **API Backend** | http://127.0.0.1:8000 |
| **Documentación Swagger UI** | http://127.0.0.1:8000/docs |

## 5. ⚛️ Configurar y Levantar el Frontend (React / Vite)

Abre una nueva ventana de terminal y navega a la carpeta `frontend`, asegurándote de que el backend siga ejecutándose.

Ejemplo de ruta:

```bash
cd C:\Ruta\Al\Proyecto\ONUFAST_3407181\frontend
```

### Instalar las dependencias de Node.js

```bash
npm install
```

### Iniciar el entorno de desarrollo

```bash
npm run dev
```

La interfaz web estará disponible en:

🌐 **Aplicación ONUFAST:** http://localhost:5173

---

# 🔑 Credenciales de Acceso

## 👑 Administrador del Sistema

| Campo | Información |
| :--- | :--- |
| **Correo** | `admin@onufast.com` |
| **Contraseña** | `admin123` |
| **Rol** | Administrador |
| **Acceso** | http://localhost:5173/admin |

El administrador cuenta con acceso total al panel de administración.

## 🧑‍💼 Clientes de Prueba

Puedes registrar nuevos clientes directamente desde la interfaz web de registro:

🌐 http://localhost:5173/registro

---

# 📂 Estructura del Proyecto

La arquitectura de ONUFAST está dividida en dos componentes principales: backend y frontend.

```text
ONUFAST_3407181/
│
├── backend/                         # Código fuente de Python / FastAPI
│   │
│   ├── core/                        # Configuración de base de datos y seguridad JWT
│   │
│   ├── db/                          # Scripts SQL y respaldos
│   │
│   ├── models/                      # Modelos y entidades ORM (SQLAlchemy)
│   │                                  # Incluye coordenadas en Paquete
│   │
│   ├── routers/                     # Endpoints y controladores de la API
│   │                                  # (envios, rastreo_gps, rutas)
│   │
│   ├── schemas/                     # Esquemas de validación de datos (Pydantic)
│   │
│   ├── main.py                      # Punto de entrada principal de FastAPI
│   │
│   └── requirements.txt             # Dependencias de Python
│
├── frontend/                        # Aplicación web en React / Vite
│   │
│   ├── public/                      # Recursos e imágenes estáticas
│   │
│   ├── src/                         # Código fuente de la interfaz
│   │   │
│   │   ├── app/                     # Configuración raíz (App.jsx, main.jsx)
│   │   │
│   │   ├── features/                # Módulos funcionales
│   │   │                                  # admin, auth, conductor,
│   │   │                                  # envios, usuario
│   │   │
│   │   ├── shared/                  # Cliente Axios, rutas protegidas
│   │   │                                  # y componentes compartidos
│   │   │                                  # (MapaRastreo, SelectorUbicacionMapa)
│   │   │
│   │   └── styles/                  # Hojas de estilo CSS globales y modulares
│   │
│   ├── package.json                 # Dependencias de Node.js (incluye Leaflet)
│   │
│   └── vite.config.js               # Configuración de Vite y alias de rutas (@/)
│
└── README.md                        # Documentación general del proyecto
```

---

# 🐧 Instalación en Linux Mint 22 XFCE

Esta guía explica cómo instalar y ejecutar **ONUFAST en Linux Mint 22 XFCE Edition**, utilizando Python, Node.js, PostgreSQL y React.

## 1. 🔄 Actualizar el sistema e instalar dependencias

Abre una terminal utilizando el atajo:

```text
Ctrl + Alt + T
```

Actualiza los paquetes del sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

Instala las herramientas necesarias:

```bash
sudo apt install -y git curl python3 python3-pip python3-venv python3-full postgresql postgresql-contrib
```

## 2. 🟢 Instalar Node.js y npm

ONUFAST utiliza Node.js para ejecutar el frontend desarrollado con React.

Instala Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```

Instala Node.js:

```bash
sudo apt install -y nodejs
```

### Verificar las versiones instaladas

Ejecuta los siguientes comandos:

```bash
node --version
npm --version
python3 --version
git --version
```

Esto permite comprobar que las herramientas necesarias están correctamente instaladas.

## 3. 🗄️ Configurar PostgreSQL

Inicia y habilita el servicio de PostgreSQL:

```bash
sudo systemctl enable --now postgresql
```

Accede a PostgreSQL como administrador:

```bash
sudo -u postgres psql
```

Dentro de la consola de PostgreSQL, ejecuta:

```sql
ALTER USER postgres WITH PASSWORD 'Sena1234';

CREATE DATABASE onufast_db;
```

Sal de PostgreSQL:

```sql
\q
```

> ⚠️ **Importante:** En Linux Mint, el acceso inicial mediante `psql -U postgres` puede presentar un error de autenticación Peer. Por eso se utiliza `sudo -u postgres psql` para acceder como administrador.

## 4. 📥 Descargar el Proyecto

Dirígete a la carpeta donde deseas guardar el proyecto.

Por ejemplo, el Escritorio:

```bash
cd ~/Escritorio
```

Clona el repositorio:

```bash
git clone https://github.com/SteveCortesDev/ONUFAST_3407181.git
```

Entra en la carpeta del proyecto:

```bash
cd ONUFAST_3407181
```

> El repositorio ya está posicionado en la rama principal.

## 5. 🐍 Configurar el Backend

Ingresa a la carpeta del backend:

```bash
cd backend
```

### Crear el entorno virtual de Python

```bash
python3 -m venv venv
```

### Activar el entorno virtual

```bash
source venv/bin/activate
```

### Actualizar pip

```bash
python -m pip install --upgrade pip
```

### Instalar las dependencias

```bash
pip install -r requirements.txt
```

Instala la versión de Bcrypt utilizada por el proyecto:

```bash
pip install bcrypt==4.0.1
```

## 6. ⚙️ Configurar las Variables de Entorno

Dentro de la carpeta `backend`, crea un archivo llamado `.env`:

```bash
nano .env
```

Agrega la siguiente configuración:

```env
DATABASE_URL=postgresql://postgres:Sena1234@localhost:5432/onufast_db
```

Guarda el archivo utilizando:

- `Ctrl + O` para guardar.
- Presiona `Enter` para confirmar.
- `Ctrl + X` para salir.

## 7. 🏗️ Crear las Tablas de la Base de Datos

Antes de continuar, verifica que estés dentro de la carpeta `backend` y que el entorno virtual esté activado.

Ejecuta:

```bash
python -c "from core.database import engine, Base; import models; Base.metadata.create_all(bind=engine); print('Tablas creadas con exito')"
```

> 💡 **Nota:** Este comando crea las tablas sin eliminar la información existente.

## 8. 👥 Registrar los Roles Iniciales

Ejecuta el siguiente comando:

```bash
python -c "from core.database import SessionLocal; from models.rol import Rol; db = SessionLocal(); [db.add(Rol(id_rol=rid, nombre_rol=rnombre)) for rid, rnombre in [(1, 'Administrador'), (2, 'Cliente'), (3, 'Conductor'), (4, 'Operador'), (5, 'Encargado de Bodega')] if not db.query(Rol).filter_by(id_rol=rid).first()]; db.commit(); print('Roles iniciales creados')"
```

Este comando registra los siguientes roles:

| ID | Rol |
| :---: | :--- |
| 1 | Administrador |
| 2 | Cliente |
| 3 | Conductor |
| 4 | Operador |
| 5 | Encargado de Bodega |

## 9. 📦 Registrar los Tipos de Envío

Ejecuta:

```bash
python -c "from core.database import SessionLocal; from models.tipo_envio import TipoEnvio; db = SessionLocal(); db.add_all([TipoEnvio(id_tipenvio=1, descripcion='Envio Estandar'), TipoEnvio(id_tipenvio=2, descripcion='Envio Express'), TipoEnvio(id_tipenvio=3, descripcion='Carga Pesada')]) if not db.query(TipoEnvio).first() else None; db.commit(); print('Tipos de envio creados')"
```

Los tipos de envío registrados son:

| ID | Tipo de envío |
| :---: | :--- |
| 1 | Envío Estándar |
| 2 | Envío Express |
| 3 | Carga Pesada |

## 10. 👑 Crear el Usuario Administrador

Ejecuta:

```bash
python -c "from core.security import hash_password; from core.database import SessionLocal; from models.usuario import Usuario; from models.usuario_roles import UsuarioRol; db = SessionLocal(); u = Usuario(nombre='Admin', apellido='Principal', clave=hash_password('admin123'), correo='admin@onufast.com', telefono='0000000000', jornada='Completa'); db.add(u); db.commit(); db.refresh(u); db.add(UsuarioRol(id_usuario=u.id_usuario, id_rol=1)); db.commit(); print('Administrador creado con exito')"
```

> ⚠️ **Importante:** Ejecuta este comando una sola vez. Si el administrador ya existe, no lo vuelvas a ejecutar porque el correo debe ser único.

## 11. 🚀 Ejecutar el Backend

Desde la carpeta `backend`, con el entorno virtual activado, ejecuta:

```bash
uvicorn main:app --reload
```

El backend estará disponible en:

| Servicio | Dirección |
| :--- | :--- |
| **API Backend** | http://127.0.0.1:8000 |
| **Documentación Swagger** | http://127.0.0.1:8000/docs |

## 12. ⚛️ Ejecutar el Frontend

Abre una segunda terminal y dirígete a la carpeta `frontend`.

Si guardaste el proyecto en el Escritorio:

```bash
cd ~/Escritorio/ONUFAST_3407181/frontend
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en:

🌐 **Aplicación ONUFAST:** http://localhost:5173

## 13. 🔑 Credenciales de Acceso

Utiliza las siguientes credenciales para ingresar al sistema:

| Campo | Información |
| :--- | :--- |
| **Correo** | `admin@onufast.com` |
| **Contraseña** | `admin123` |
| **Rol** | Administrador |

## 14. 🛑 Finalizar la Ejecución

Para detener el backend o frontend, utiliza:

```text
Ctrl + C
```

Para salir del entorno virtual de Python:

```bash
deactivate
```

---

## 🎉 ¡Instalación Completada!

**ONUFAST estará funcionando localmente en Linux Mint 22 XFCE.**

Ya puedes acceder a la plataforma, iniciar sesión como administrador, gestionar los envíos y explorar las funcionalidades del sistema.

---

<p align="center">
  <strong>🚀 ONUFAST — Elevando el nivel de tus envíos.</strong>
  <br/>
  <em>Innovación, tecnología y eficiencia para la logística colombiana.</em>
  <br/><br/>
  <img src="https://img.shields.io/badge/Desarrollado_con-❤️-cc0000?style=for-the-badge" alt="Hecho con amor"/>
</p>