const fs = require('fs');
const path = require('path');

const galleryPath = path.join(__dirname, 'Gallery', 'Gallery-images');
const indexPath = path.join(__dirname, 'Gallery', 'index.html');

function generateAlbumDiv(name, date, imagePath, delay) {
    return `
    <div class="album" onclick="openDialog('${name}')">
        <a href="${imagePath}" class="album-link">
            <img src="${imagePath}" alt="${name} Album Cover" class="album-image">
        </a>
        <div class="album-name">
            <h1>${name}</h1>
            <h2>${date}</h2>
        </div>
    </div>`;
}

function extractAlbumInfo(folderName) {
    const match = folderName.match(/(.+)\s\((\d{2}\.\d{2}\.\d{4})\)/);
    if (!match) return null;
    const [ , name, date ] = match;
    return { name, date };
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
}

function generateIndexHtml(albums) {
    const albumDivs = albums.map((album, index) => {
        const delay = index * 0.5; // 0.5 seconds delay between each album
        return generateAlbumDiv(album.name, album.date, album.imagePath, delay);
    }).join('');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gisha-Yehudit-Gallery</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/ico" href="../images/for-page/web-tab-logo.png">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.1.6/simple-lightbox.min.css">
</head>
<body>
    <div class="header">
        <a href="../index.html" target="_self">
            <img class="logo-img" src="../images/for-page/header-logo.png">
        </a>
    </div>
    <div class="menu-button" onclick="toggleMenu()" style="text-shadow: 3px 3px black;"> ☰ </div>
    <div id="page-overlay" class="page-overlay" onclick="toggleMenu()"></div>
    <div id="context-menu" class="context-menu">
        <div class="close-button" onclick="toggleMenu()">✖</div>
        <ul>
            <li><a href="../index.html" target="_self">На главную страницу</a></li>
            <li><a href="#contact">Контакты</a></li>
            <hr style="margin-bottom: 8%; margin-top: 5%;">
            <li><a href="https://docs.google.com/forms/d/e/1FAIpQLScsfcbmcYiRCpFTF7yXTnoIo0qY1pMHVXBnjCcFFWrA0tDuLQ/viewform" style="margin-bottom: 3%;"> Проект<br>"Еврейской молодёжи" </a></li>  
        </ul>
    </div>
    <div class="albums-content">
        ${albumDivs}
    </div>
    <div id="dialog" class="dialog">
        <div class="dialog-content">
            <span class="close" onclick="closeDialog()">&times;</span>
            <div class="dialog-images"></div>
        </div>
    </div>
<script src="../menu-script.js"></script>
<script src="script.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.1.6/simple-lightbox.min.js"></script>
<script>
    let lightbox;
    function openDialog(albumName) {
        const dialog = document.getElementById('dialog');
        const dialogImages = document.querySelector('.dialog-images');
        dialog.classList.add('open');
        dialogImages.innerHTML = ''; // Очистить предыдущее содержимое

        fetch(`/Gallery/Gallery-images/${albumName}`)
            .then(response => response.text())
            .then(data => {
                const imagePaths = data.match(/src="([^"]+)"/g).map(src => src.replace(/src="|"/g, ''));
                imagePaths.forEach(imagePath => {
                    const a = document.createElement('a');
                    a.href = imagePath;
                    a.classList.add('dialog-image-link');
                    a.innerHTML = `<img src="${imagePath}" class="dialog-image" />`;
                    dialogImages.appendChild(a);
                });

                if (lightbox) lightbox.destroy(); // Убедитесь, что предыдущая инициализация удалена
                lightbox = new SimpleLightbox('.dialog-image-link');
            })
            .catch(error => console.error('Error loading images:', error));
    }

    function closeDialog() {
        const dialog = document.getElementById('dialog');
        dialog.classList.remove('open');
    }
</script>
</body>
</html>`;
}

function generateGallery() {
    fs.readdir(galleryPath, (err, folders) => {
        if (err) {
            console.error('Error reading gallery directory:', err);
            return;
        }

        const albums = folders.map(folder => {
            const info = extractAlbumInfo(folder);
            if (!info) return null;
            const imagePath = path.join('Gallery-images', folder, 'Logo.jpg');
            return {
                ...info,
                dateObj: parseDate(info.date),
                imagePath
            };
        }).filter(Boolean);

        albums.sort((a, b) => b.dateObj - a.dateObj);

        const indexHtmlContent = generateIndexHtml(albums);

        fs.writeFile(indexPath, indexHtmlContent, (err) => {
            if (err) {
                console.error('Error writing index.html:', err);
            } else {
                console.log('index.html generated successfully.');
            }
        });
    });
}

generateGallery();
