document.addEventListener('DOMContentLoaded', function() {

    // 1. Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // Duración de la animación
        once: true,    // Animar solo una vez
        offset: 50,    // Offset (en px) desde el borde original del trigger point
    });

    // 2. Efecto Navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled', 'shadow-lg');
                navbar.classList.remove('navbar-light', 'bg-light'); // Opcional: cambiar esquema de color
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // Más opaco
            } else {
                navbar.classList.remove('navbar-scrolled', 'shadow-lg');
                navbar.classList.add('navbar-light', 'bg-light'); // Volver a original
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Ligeramente transparente
            }
        });
    }

    // 3. Smooth Scrolling para enlaces del Navbar (si no se usa scroll-behavior: smooth en CSS)
    // Bootstrap 5 maneja esto bien para los componentes con data-bs-spy, pero si quieres
    // un control más genérico para cualquier enlace # y sin depender de data-bs-spy:
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Cerrar el menú hamburguesa en móviles después de hacer clic
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarToggler && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });


    // 4. Contadores Animados (CountUp.js)
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Velocidad no se usa directamente con CountUp.js

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const countUp = new CountUp(counter, target, {
            duration: 2.5, // Duración en segundos
            useEasing: true,
            useGrouping: true, // ej. 1,000 en vez de 1000
            separator: '.', // separador de miles
            decimal: ',', // separador decimal
        });

        // Usar IntersectionObserver para iniciar el contador cuando es visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('counted')) {
                    if (!countUp.error) {
                        countUp.start();
                        counter.classList.add('counted'); // Marcar como contado para no repetir
                    } else {
                        console.error(countUp.error);
                        counter.innerText = target; // Si hay error, mostrar el número final
                    }
                    observer.unobserve(counter); // Dejar de observar una vez animado
                }
            });
        }, { threshold: 0.5 }); // 0.5 significa que el 50% del elemento debe ser visible

        observer.observe(counter);
    });


    // 5. Botón "Volver Arriba"
    const backToTopButton = document.getElementById("backToTop");
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. Año actual en el Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 7. (Opcional) Validación de Formulario de Contacto (Bootstrap ya hace validación HTML5)
    // Este es un ejemplo básico si quisieras hacer algo más con JS antes de enviar
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir envío real para este ejemplo
            // Bootstrap maneja la validación visual si usas `required` y los tipos correctos en HTML.
            // Si el formulario es válido según Bootstrap:
            if (contactForm.checkValidity()) {
                alert('Formulario enviado (simulación). ¡Gracias por tu mensaje!');
                // Aquí iría la lógica para enviar los datos (AJAX, Fetch API, etc.)
                contactForm.reset(); // Limpiar el formulario
                // Podrías necesitar remover clases de validación de Bootstrap manualmente
                contactForm.classList.remove('was-validated');
            } else {
                // Si quieres añadir clases de validación de Bootstrap manualmente
                event.stopPropagation();
                contactForm.classList.add('was-validated');
                alert('Por favor, completa todos los campos requeridos.');
            }
        });
    }

});