function toggleMenu() {
    var menu = document.getElementById('context-menu');
    var overlay = document.getElementById('page-overlay');
    var body = document.body;

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.remove('open');
        body.style.overflow = 'auto'; // Возобновить прокрутку страницы
    } else {
        menu.classList.add('open');
        overlay.classList.add('open');
        body.style.overflow = 'hidden'; // Заблокировать прокрутку страницы
    }
}
