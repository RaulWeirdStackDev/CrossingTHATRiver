// JavaScript para el modal de instrucciones
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalInstrucciones');
    const btnAbrir = document.getElementById('btnInstrucciones');
    const btnCerrar = document.getElementById('closeInstrucciones');

    // Abrir modal
    btnAbrir.addEventListener('click', function() {
        modal.classList.add('show');
    });

    // Cerrar modal con botón X
    btnCerrar.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
});