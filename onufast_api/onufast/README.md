# ONUFAST API — Modo sin base de datos

## Instalación

```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] pydantic[email] python-multipart
```

## Ejecutar

```bash
cd onufast
uvicorn main:app --reload
```

Documentación interactiva: **http://localhost:8000/docs**

---

## Flujo paso a paso (en /docs)

### 1. Crear cuenta
`POST /auth/registro`
```json
{
  "nombre": "Juan",
  "apellido": "García",
  "tipo_documento": "CC",
  "num_documento": "1234567890",
  "correo": "juan@email.com",
  "contrasena": "miClave123",
  "telefono": "3001234567"
}
```

### 2. Iniciar sesión
`POST /auth/login`
```json
{
  "nombre": "Juan García",
  "contrasena": "miClave123",
  "direccion": "Calle 45 # 12-34, Bogotá"
}
```
→ Copia el `access_token` y úsalo en el candado 🔒 de /docs

### 3. Ver tipos de envío
`GET /envios/tipos` — devuelve Express (id=1) y Normal (id=2)

### 4. Crear pedido
`POST /envios/pedido/iniciar`
```json
{ "id_tipenvio": 1, "cantidad": 1 }
```
→ Guarda el `id_pedido`

### 5. Registrar paquete
`POST /paquetes/registrar/{id_pedido}`
```json
{
  "tipo_producto": "Electrónico",
  "peso": 1.5,
  "alto": 20.0,
  "largo": 30.0,
  "ancho": 15.0,
  "es_fragil": true,
  "descripcion": "Laptop gaming"
}
```

### 6. Ver mis pedidos
`GET /envios/mis-pedidos`

---

> Los datos viven en memoria RAM. Al reiniciar `uvicorn` todo se borra.
> Cuando quieras conectar MySQL, solo agrega SQLAlchemy y cambia `store.py`.
