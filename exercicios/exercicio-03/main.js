document.addEventListener("DOMContentLoaded", function(){
    loadTheme();
});

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

document.getElementById('imageForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const quantity = document.getElementById('quantity').value;

    // Validação de formulário
    if (width < 300 || height < 300) {
        alert('A largura e altura devem ser no mínimo 300px.');
        return;
    }

    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = ''; // Limpa o grid antes de adicionar novas imagens

    for (let i = 0; i < quantity; i++) {
        const imgSrc = `https://picsum.photos/${width}/${height}?random=${i}.webp`;

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Imagem aleatória de ${width}x${height}`;

        const actions = document.createElement('div');
        actions.classList.add('action-buttons');

        // Botão de Download
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('download');
        downloadButton.textContent = 'Download';
        downloadButton.onclick = () => downloadImage(imgSrc, i);

        // Botão de Copiar Link
        const copyLinkButton = document.createElement('button');
        copyLinkButton.classList.add('copy-link');
        copyLinkButton.textContent = 'Copiar Link';
        copyLinkButton.onclick = () => copyLink(imgSrc);

        // Botão de Compartilhar
        const shareButton = document.createElement('button');
        shareButton.classList.add('share');
        shareButton.textContent = 'Compartilhar';
        shareButton.onclick = () => shareImage(imgSrc);

        actions.appendChild(downloadButton);
        actions.appendChild(copyLinkButton);
        actions.appendChild(shareButton);
        imageContainer.appendChild(img);
        imageContainer.appendChild(actions);
        imageGrid.appendChild(imageContainer);
    }
});

function copyLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        alert('Link copiado com sucesso!');
    }).catch(err => {
        alert('Erro ao copiar link: ' + err);
    });
}

function shareImage(link) {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, '_blank');
}

function downloadImage(link, index) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.download = `imagem_${index + 1}.webp`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}