Code Express - Versión Pro (Frontend + Backend)

Instrucciones rápidas:
1. Copiar la carpeta al servidor con PHP 8+ y MySQL.
2. Importar db/schema.sql en MySQL (crea database codeexpress_db).
3. Verificar db/config.php con tus credenciales.
4. Admin demo: /admin/login.php -> usuario: admin / contraseña: Cambiar123!
5. Formularios guardan en BD (modo prueba). Para mail real, integrar PHPMailer.

Contenido:
- index.html, services.html, portfolio.html, about.html, contact.html
- assets/css/style.css (diseño pro), assets/js/main.js (GSAP animaciones)
- api/submit_contact.php, api/submit_hire.php (guardan en DB, devuelven JSON)
- admin/login.php, dashboard.php, export_contacts.php, logout.php
- db/config.php (host local por defecto), db/schema.sql
- assets/mockups/* para simular proyectos
