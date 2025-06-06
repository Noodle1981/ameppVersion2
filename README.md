# amepp_base
# ameppVersion2

¡Entendido! Muy buena la visión general. Efectivamente, "Viajes" es una entidad más compleja, pero las otras (Servicios, Talleres, Beneficios, Noticias) comparten una estructura similar basada en mostrar información con un flyer/imagen, título, descripción y fecha.

Esto sugiere que podríamos usar una estructura de tabla más genérica para algunas de estas, o tablas separadas pero con campos muy parecidos. Vamos a analizarlo.

Objetivo Principal: Panel de Administración para Cargar Contenido.

Esto refuerza la necesidad de tablas bien definidas en la base de datos, ya que el panel de Laravel (que probablemente construirás o usarás un paquete como Filament, Nova, o Backpack) interactuará directamente con estas tablas a través de los Models de Eloquent.

Analizando las Entidades y sus Similitudes:

Servicios: Título, Descripción, Imagen/Flyer, Fecha de Publicación.

Talleres: Título, Descripción, Imagen/Flyer, Fecha de Publicación (o fecha del taller).

Beneficios: Título, Descripción, Imagen/Flyer, Fecha de Vigencia.

Noticias: Título, Contenido (puede ser más largo), Imagen/Flyer, Fecha de Publicación, Enlace "Leer Más" (implica que podría haber una vista de detalle).

Todas comparten:

Título

Descripción/Contenido

Imagen/Flyer

Una fecha relevante (publicación, vigencia, evento)

Propuesta de Estructura de Base de Datos:

Podemos optar por:

Tablas Separadas: Más simple de entender al principio y permite campos específicos para cada entidad si es necesario en el futuro. Es mi recomendación inicial dada la naturaleza distinta de cada concepto, aunque compartan campos.

Tabla Genérica de "Publicaciones" o "Contenidos" con un campo "tipo" (Polimorfismo): Más avanzado. Podrías tener una tabla contents y un campo content_type (servicio, taller, beneficio, noticia) y luego tablas específicas para detalles adicionales si los hubiera (service_details, workshop_details). Esto puede reducir la duplicación de tablas si son muy similares y no esperas que diverjan mucho. Pero puede complicar las consultas y la lógica del panel de administración si no se maneja con cuidado.

Opción 1: Tablas Separadas (Recomendada para empezar)

1. Tabla viajes (ya la propusimos, la mantendremos como la más compleja):

CREATE TABLE viajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    flyer_imagen_url VARCHAR(255),
    fecha_inicio_viaje DATE NOT NULL,
    fecha_fin_viaje DATE,
    duracion_dias INT,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio DECIMAL(10, 2),
    moneda VARCHAR(10) DEFAULT 'ARS',
    destino_principal VARCHAR(150),
    capacidad_maxima INT,
    estado ENUM('PROXIMAMENTE', 'VIGENTE', 'COMPLETO', 'FINALIZADO', 'CANCELADO') DEFAULT 'PROXIMAMENTE',
    -- Campos específicos de viaje:
    itinerario TEXT,            -- Podría ser HTML o Markdown
    incluye TEXT,             -- Lista de lo que incluye el viaje
    no_incluye TEXT,          -- Lista de lo que NO incluye
    requisitos_viaje TEXT,    -- Documentación, vacunas, etc.
    -- Fin campos específicos
    notas_adicionales TEXT,
    slug VARCHAR(255) UNIQUE, -- Para URLs amigables (ej: aventura-en-patagonia)
    es_destacado BOOLEAN DEFAULT FALSE, -- Para mostrar en la home
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


Añadí slug para URLs amigables. Laravel puede generar esto automáticamente.

Añadí es_destacado para controlar si aparece en la página principal.

Añadí algunos campos más específicos de viajes como ejemplo (itinerario, incluye, etc.)

2. Tabla servicios:

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    flyer_imagen_url VARCHAR(255),
    fecha_publicacion DATE, -- O podría ser solo created_at si siempre es la fecha de creación
    -- ¿Algún campo específico para servicios? Ej:
    -- area_responsable VARCHAR(100),
    -- contacto_servicio VARCHAR(255),
    enlace_mas_info VARCHAR(255), -- Si hay una página de detalle o externa
    orden INT DEFAULT 0, -- Para ordenar manualmente si es necesario
    esta_activo BOOLEAN DEFAULT TRUE, -- Para habilitar/deshabilitar
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

3. Tabla talleres:

CREATE TABLE talleres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    flyer_imagen_url VARCHAR(255),
    fecha_taller DATETIME, -- Fecha y hora del taller
    duracion VARCHAR(100), -- Ej: "2 horas", "3 encuentros de 1h30m"
    lugar VARCHAR(255),
    costo DECIMAL(10,2),
    moneda VARCHAR(10) DEFAULT 'ARS',
    cupos_disponibles INT,
    -- ¿Inscripciones abiertas?
    -- estado ENUM('PROXIMAMENTE', 'INSCRIPCION_ABIERTA', 'EN_CURSO', 'FINALIZADO', 'CANCELADO') DEFAULT 'PROXIMAMENTE',
    enlace_inscripcion VARCHAR(255),
    orden INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

4. Tabla beneficios:

CREATE TABLE beneficios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    flyer_imagen_url VARCHAR(255),
    fecha_vigencia_desde DATE,
    fecha_vigencia_hasta DATE, -- Opcional, si tiene vencimiento
    -- ¿Tipo de beneficio (descuento, acceso, etc.)?
    -- categoria_beneficio VARCHAR(100),
    como_acceder TEXT, -- Instrucciones
    condiciones TEXT, -- Términos y condiciones
    proveedor VARCHAR(150), -- Quién otorga el beneficio (Farmadis, Cine Premier)
    orden INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

5. Tabla noticias:

CREATE TABLE noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT, -- Un extracto corto para la vista de listado
    contenido_completo TEXT NOT NULL, -- El cuerpo de la noticia, puede ser HTML/Markdown
    flyer_imagen_url VARCHAR(255), -- Imagen destacada
    fecha_publicacion DATE NOT NULL,
    -- autor_id INT, -- Si quieres asociar un autor (usuario del sistema)
    -- FOREIGN KEY (autor_id) REFERENCES usuarios(id),
    categoria_noticia VARCHAR(100), -- Ej: "Institucional", "Eventos", "Comunidad"
    fuente VARCHAR(255), -- Si es una noticia externa
    enlace_externo VARCHAR(255), -- Si la noticia es solo un link a otro sitio
    es_destacada BOOLEAN DEFAULT FALSE, -- Para mostrar en la home o sección principal de noticias
    esta_publicada BOOLEAN DEFAULT TRUE, -- Para borradores
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

Campos Comunes Sugeridos en estas Tablas (que no estaban tan explícitos antes):

slug VARCHAR(255) UNIQUE: Fundamental para URLs amigables (ej. servicios/asesoria-contable). Laravel tiene paquetes para generar esto automáticamente a partir del título.

orden INT DEFAULT 0: Si los administradores necesitan un orden específico de visualización que no sea por fecha o alfabético.

esta_activo BOOLEAN DEFAULT TRUE o esta_publicada BOOLEAN DEFAULT TRUE: Para controlar la visibilidad del ítem sin borrarlo.

flyer_imagen_url VARCHAR(255): En todos los casos, esta sería la ruta a la imagen que se sube desde el panel de administración. Laravel tiene un sistema de archivos muy robusto para esto (Storage).

Tabla usuarios (para los administradores y posiblemente asociados):

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Se guarda hasheada
    rol ENUM('ADMIN', 'EDITOR', 'ASOCIADO') DEFAULT 'ASOCIADO', -- Define permisos
    remember_token VARCHAR(100), -- Para "recordarme" en el login de Laravel
    email_verified_at TIMESTAMP NULL, -- Si implementas verificación de email
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

Consideraciones Adicionales:

Tipos de Datos ENUM: Son específicos de MySQL/MariaDB. Si usas PostgreSQL u otro SGBD, usarías VARCHAR con una restricción CHECK o manejarías la validación a nivel de aplicación en Laravel. Para Laravel, a menudo es más flexible usar un VARCHAR y definir los valores permitidos en el modelo o en una clase de constantes.

Relaciones:

Si una noticia tiene un autor, necesitas una clave foránea a la tabla usuarios.

Si quisieras categorizar más formalmente (ej. categorias_noticias como tabla separada), necesitarías tablas de unión (muchos a muchos) o claves foráneas (uno a muchos). Por ahora, un VARCHAR para categoria_noticia es más simple.

Imágenes/Flyers: Laravel no guarda la imagen en la base de datos, sino la ruta donde se almacena el archivo. Tendrás que configurar el almacenamiento de archivos en Laravel (disco local, S3, etc.).

Próximos Pasos para Ti (con Laravel):

Elegir SGBD: MySQL/MariaDB es una elección común y bien soportada. SQLite es genial para desarrollo local rápido.

Crear Migraciones: Por cada una de estas tablas, crearás un archivo de migración en Laravel (php artisan make:migration create_nombretabla_table). Esto te permite versionar tu esquema de BD.

Crear Models: Por cada tabla, un Model de Eloquent (php artisan make:model NombreModelo).

Panel de Administración: Implementar las interfaces para que los administradores puedan hacer CRUD (Crear, Leer, Actualizar, Borrar) para cada una de estas entidades.

Esta estructura de tablas separadas te da flexibilidad para que cada sección evolucione. Si en el futuro "Talleres" necesita muchos campos que "Servicios" no, no hay problema.

