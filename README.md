## PISR API - Laravel Backend

Este repositorio contiene el backend de la API RESTful para el sistema PISR, desarrollada en Laravel. La API permite gestionar dispositivos, recibir eventos de alarma, registrar automáticamente nuevos dispositivos y realizar consultas específicas sobre eventos por tipo, dispositivo y rango de tiempo.

---

## 🚀 Instalación y configuración
Este proyecto utiliza [Laravel Sail](https://laravel.com/docs/sail) como entorno de desarrollo local basado en Docker. Asegúrate de tener los siguientes requisitos instalados:

- Docker
- Git

### 1. Clona este repositorio

```bash
git clone https://github.com/tu-usuario/PISR-Api-BK.git
cd PISR-Api-BK
```


### 2. Copia el archivo de entorno

```bash
cp .env.example .env
```


### 3. Instala dependencias PHP con Composer

```bash
docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v $(pwd):/var/www/html \
  -w /var/www/html \
  laravelsail/php82-composer:latest \
  composer install --ignore-platform-reqs

```


### 4. Levanta el entorno de desarrollo

```bash
./vendor/bin/sail up -d

```
### 5. Instala dependencias PHP con Composer

```bash
./vendor/bin/sail composer install

```

### 6. Instala dependencias de Node.js (JS y CSS)

```bash
./vendor/bin/sail npm install

```
### 7. Compila los assets de frontend

```bash
./vendor/bin/sail npm run build

```

### 8. Genera la clave de la aplicación

```bash
./vendor/bin/sail artisan key:generate

```

### 9. Ejecuta migraciones y seeders

```bash
./vendor/bin/sail artisan migrate --seed
```

### 10. Enlaza el directorio de almacenamiento (para ver imágenes desde /storage)

```bash
./vendor/bin/sail artisan storage:link

```
---
## 📡 Endpoint principal
**POST /api/SendAlarmDataJSONStn**
Este endpoint recibe eventos de alarma en formato JSON desde dispositivos.

- Si el dispositivo aún no está registrado, se da de alta automáticamente en estado "desactivado".
- Los eventos se almacenan según su tipo.
- Los dispositivos se pueden activar o desactivar para seguir recibiendo alarmas.

---
## 📊 Requisitos funcionales implementados
- Almacenamiento persistente de dispositivos y eventos de alarma.
- Alta automática de dispositivos al recibir eventos por primera vez.
- Activación y desactivación de dispositivos desde la interfaz.
- Activación y desactivación de guardado de imagenes de dispositivos desde la interfaz.
- Consulta de eventos por tipo de alarma desde la API.
- Consulta de eventos relacionados dentro de un margen de tiempo definido o por defecto con respuesta estructurada y agrupada por dispositivo.

---

---

## 🧰 Tecnologías Usadas

Este proyecto está construido con un conjunto moderno de tecnologías que permiten un desarrollo eficiente, modular y seguro:

### 🔧 Backend

- **Laravel 12**: Framework PHP robusto y expresivo para construir APIs modernas.
- **Laravel Sail**: Entorno de desarrollo ligero basado en Docker para Laravel.
- **Sanctum**: Sistema de autenticación simple para SPAs y APIs con tokens seguros.
- **PHP Puro (Subsistema emisor)**: Módulo externo en PHP plano que simula o representa dispositivos que generan eventos y los envían al endpoint principal de esta API.

### 📦 Contenedores

- **Docker**: Contenerización del entorno de desarrollo y dependencias mediante Laravel Sail (basado en Docker Compose).

### 🖼️ Frontend

- **React**: Interfaz de usuario dinámica y moderna.
- **Inertia.js**: Permite usar React como frontend sin necesidad de una API tradicional, facilitando la integración con Laravel.

---

## 📡 Endpoints de la API

### 1. 📷 Gestión de Dispositivos (Cámaras)

| Método | Ruta                                         | Función                                                                 |
|--------|----------------------------------------------|-------------------------------------------------------------------------|
| GET    | `/api/device`                                | Obtener lista de dispositivos                                          |
| POST   | `/api/device/enable-device/{id}`             | Activar guardado de registros del dispositivo                          |
| POST   | `/api/device/disable-device/{id}`            | Desactivar guardado de registros del dispositivo                       |
| POST   | `/api/device/enable-save-image/{id}`         | Activar guardado de imágenes del dispositivo                           |
| POST   | `/api/device/disable-save-image/{id}`        | Desactivar guardado de imágenes del dispositivo                        |
| POST   | `/api/device/related-records`                | Obtener registros del dispositivo disparador y eventos cercanos        |

---

### 2. 🚗 Gestión de Vehículos

| Método | Ruta               | Función                                     |
|--------|--------------------|---------------------------------------------|
| GET    | `/api/vehicles`    | Obtener todos los registros de placas detectadas |

---

### 3. 🚨 Alarmas por Tipo de Evento

| Método | Ruta                 | Función                                                                 |
|--------|----------------------|-------------------------------------------------------------------------|
| GET    | `/api/avd`           | Retorna registros de todos los eventos de tipo AVD                     |
| GET    | `/api/general`       | Retorna eventos generales: PEA, STERILE, AOIENTRY, AOILEAVE            |
| GET    | `/api/objectCounting`| Registros específicos de conteo de objetos: TRAFFIC, PASSLINE          |
| GET    | `/api/vfd`           | Retorna registros de eventos de tipo VFD                               |
| GET    | `/api/VsdCars`       | Retorna características de vehículos en eventos VSD                    |
| GET    | `/api/VsdPersons`    | Retorna características de personas en eventos VSD                     |
| GET    | `/api/alarms`        | Obtener todos los registros de alarmas                                 |

---



## 🧾 Estructura del proyecto

```bash
app/
├── Http/Controllers/
│   ├── AlarmController.php
│   ├── DeviceController.php
│   └── ...
├── Models/
│   ├── Alarm.php
│   ├── Device.php
│   └── ...
├── Services/
│   ├── AlarmsServices.php
│   └── DevicesServices.php

routes/
├── api.php
├── web.php

database/
├── migrations/
│   ├── create_alarms_table.php
│   ├── create_devices_table.php
│   └── ...


```
## 📚 Documentación Técnica de Soporte

Para comprender mejor el funcionamiento de los dispositivos, cámaras y protocolos involucrados en este proyecto, a continuación se listan documentos técnicos clave. Estos manuales contienen especificaciones, ejemplos de integración, y detalles sobre la configuración y estructura de las alarmas enviadas por los equipos.

### Manuales disponibles:

- **`I6-340LPRN-MVF1.pdf`**  
  Manual del modelo de cámara LPR (License Plate Recognition) utilizado. Contiene especificaciones técnicas, características del equipo y configuración de red.

- **`LPR Smart Sight Series Manual.pdf`**  
  Guía detallada para la serie de cámaras Smart Sight con reconocimiento de matrículas. Incluye instrucciones sobre el uso del software, configuraciones avanzadas y escenarios de aplicación.

- **`Provision-ISR Alarm Server and HTTP POST.pdf`**  
  Documento técnico que describe el protocolo de envío de alarmas mediante HTTP POST desde cámaras Provision-ISR. Este manual es clave para entender el formato de los datos XML que consume esta API REST.

### Enlace de descarga:

Los documentos están disponibles en una carpeta compartida de Google Drive:

🔗 [Acceder a los manuales técnicos en Google Drive](https://drive.google.com/drive/folders/1wWcPLNaviZVnlS_WQRDjc6aFGogCwzWw?usp=sharing)

> ⚠️ **Nota:** Si no tienes acceso, solicita permisos al administrador del proyecto.
