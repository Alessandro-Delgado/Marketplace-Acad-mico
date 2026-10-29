🚀 Guía de Configuración Local - UTPINO COMPARTE
¡Hola equipo! Sigan estos pasos al pie de la letra para configurar y probar el proyecto en sus computadoras locales.

🛠️ 1. Prerrequisitos (Herramientas necesarias)
Asegúrense de tener instalado en su PC:

Node.js (versión recomendada LTS para Angular).

XAMPP (para correr Apache y MySQL).

📂 2. Configuración del Backend y Base de Datos (PHP / MySQL)
Iniciar Servicios: Abran el panel de control de XAMPP y enciendan Apache y MySQL.

Crear la Base de Datos:

Entren a phpMyAdmin.

Creen una nueva base de datos (pueden llamarla utpino_db).

Importar la Tabla:

Seleccionen su base de datos creada, vayan a la pestaña Importar, suban el archivo .sql del proyecto (o ejecuten el script de la tabla usuario) y denle a Continuar.

Ubicar el Backend:

Copien la carpeta del backend PHP dentro de la ruta de XAMPP: C:/xampp/htdocs/ (en Windows).

Verificar Conexión:

Revisen el archivo conexion.php y asegúrense de que los accesos por defecto estén así:

Host: localhost

Usuario: root

Contraseña: (vacía)

Base de datos: utpino_db (o el nombre que le hayan puesto).

💻 3. Configuración del Frontend (Angular)
Abrir el Proyecto: Abran la carpeta del frontend en su editor de código (como Visual Studio Code).

Instalar Dependencias: Abran la terminal integrada de VS Code y ejecuten el siguiente comando para descargar los módulos necesarios:

Bash
npm install
(Nota: No se preocupen por los archivos temporales o de caché como .tsbuildinfo si aparecen en su control de versiones; Git los ignorará automáticamente).

Verificar la ruta del Backend:

Asegúrense de que en sus servicios de Angular (por ejemplo, en auth.service.ts), la URL apunte correctamente a su servidor local de XAMPP, algo como:
http://localhost/utpino-backend/
