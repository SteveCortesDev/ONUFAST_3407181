# 🚀 ONUFAST — Elevando el nivel de tus envíos

<div align="center">

![ONUFAST](https://img.shields.io/badge/ONUFAST-Sistema_Logístico-cc0000?style=for-the-badge&logo=box&logoColor=white)
![Status](https://img.shields.io/badge/Status-En_Desarrollo-orange?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)


**La plataforma digital que revoluciona la logística en Colombia**

[Documentación](#documentación) • [Características](#características) • [Instalación](#instalación) 
</div>

---

##  ¿Qué es ONUFAST?

ONUFAST es una plataforma integral de gestión logística y envíos de paquetes diseñada para digitalizar completamente el proceso de mensajería, desde el registro del paquete hasta su entrega final. Nace con la misión de transformar la logística colombiana en una experiencia rápida, segura y totalmente transparente.

No es solo un sistema, es **la evolución de la logística moderna**.

---

##  Características Principales

### Múltiples Roles Especializados
- **Cliente**: Registra, rastrea y gestiona sus envíos desde un portal intuitivo
- **Conductor**: Entrega paquetes, actualiza estados en tiempo real y reporta novedades
- **Encargado de Bodega**: Recibe, organiza y despacha paquetes con eficiencia
- **Administrador**: Control total del sistema, rutas, vehículos, reportes y tarifas

### Rastreo en Tiempo Real
Cada paquete tiene un código único de rastreo. El cliente ve exactamente dónde está en cada momento:
- En bodega → En camino → Entregado
- Con cambios de estado registrados, fecha y quién realizó cada acción

### Gestión Completa de Flota
- Registra y asigna vehículos
- Monitorea mantenimientos
- Controla disponibilidad de conductores
- Optimiza rutas automáticamente

### Facturación Automática
Cada pedido genera automáticamente una factura con:
- Subtotal y IVA separados
- Cálculo automático por peso y volumen
- Múltiples métodos de pago
- Notas crédito y débito


### Como ejecutar un codigo Python/FastAPI
1. Llamar carpeta
    - Abrir terminal y escribir cd..
    - Ejecutar el codigo cd nombre_tu_carpeta
    - Ejecutar el codigo cd nombre_archivo\nomb_carpeta

2. Instalar las bibliotecas de FastAPI:
    - Ejecutar el codigo en la terminal Pip install "fastapi[standard]"
    - Una vez instalado se debe verificar que todas las bubliotecas se instalaron con el comando pip list
    - Si no se instalo todo cerrar proceso con ctrl + c y luego instalar otra vez

3. Activar la terminal deseada
    - Ejecutar el siguiente codigo en la terminal cd onufast_api\onufast uvicorn main:app --reload
    - Una vez ejecutador aparecera una serie de informacion y un enlace
    - Copiar el link , pegar en un navegador y al final agregar /docs