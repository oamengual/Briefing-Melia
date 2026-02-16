# Guía de Despliegue Nativo en Synology NAS (Sin Docker)

Para correr la aplicación directamente en tu Synology y acceder mediante Tailscale, sigue estos pasos:

## 1. Requisitos Previos en el NAS

- Instala el paquete **Node.js** (v18 o superior) desde el "Centro de paquetes" de Synology.
- Asegúrate de que **Tailscale** esté instalado y conectado en el NAS.
- Habilita el servicio **SSH** en `Panel de control > Terminal y SNMP`.

## 2. Preparación del Código

Desde tu ordenador (donde ya tienes el proyecto), genera la versión optimizada para producción:

```bash
# Ejecuta esto en tu ordenador
npm run build
```

## 3. Subir el Proyecto al NAS

- Abre **File Station** en tu Synology.
- Crea una carpeta (ej: `/volume1/web/brief-generator`).
- Copia **todo** el contenido de tu proyecto local a esa carpeta (incluyendo las carpetas ocultas como `.next`).

## 4. Instalación y Ejecución vía SSH

Abre un terminal en tu ordenador y conéctate al NAS:

```bash
# Conéctate (sustituye 'usuario' e 'ip-o-nombre-nas')
ssh usuario@ip-nas

# Entra en la carpeta del proyecto
cd /volume1/web/brief-generator

# Instala dependencias para producción (más ligero para el NAS)
npm install --omit=dev --no-progress

# Instalar PM2 para que la app no se cierre
sudo npm install -g pm2

# Iniciar la aplicación usando la ruta completa
/usr/local/bin/pm2 start ecosystem.config.js

# Asegurar que se inicie al reiniciar el NAS
/usr/local/bin/pm2 save
```

## 5. Acceso mediante Tailscale

Una vez que PM2 esté corriendo:

- La aplicación estará disponible en la dirección IP de Tailscale de tu NAS en el puerto 3000.
- Ejemplo: `http://100.x.y.z:3000`

---
> [!TIP]
> Puedes usar el **Portal de Inicio de Sesión** de Synology para crear un Proxy Inverso si quieres usar un nombre de dominio más amigable en lugar de la IP.
