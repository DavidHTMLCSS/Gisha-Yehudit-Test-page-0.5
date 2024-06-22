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

// Добавляем обработчики событий для пунктов меню
document.querySelectorAll('#context-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение ссылки

        var targetId = this.getAttribute('href').substring(1); // Получаем ID целевого элемента
        var targetElement = document.getElementsByName(targetId)[0]; // Находим целевой элемент по имени

        if (targetElement) {
            // Плавный переход к якорю
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Закрываем меню
            var menu = document.getElementById('context-menu');
            var overlay = document.getElementById('page-overlay');
            var body = document.body;

            menu.classList.remove('open');
            overlay.classList.remove('open');
            body.style.overflow = 'auto'; // Возобновить прокрутку страницы
        }
    });
});