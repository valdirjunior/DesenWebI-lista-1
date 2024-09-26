const takePhotoButton = document.getElementById('take-photo');
const uploadPhotoInput = document.getElementById('upload-photo');
const camera = document.getElementById('camera');
const photoTitleInput = document.getElementById('title');
const photoDescriptionInput = document.getElementById('description');
const photoPreview = document.getElementById('photo-preview');
const savePhotoButton = document.getElementById('save-photo');
const editPhotoButton = document.getElementById('save-edit');
const mapDiv = document.getElementById('map');
let userLocation = {};
let capturedPhoto = null;
const photos = JSON.parse(localStorage.getItem('photos')) || [];

document.addEventListener("DOMContentLoaded", function(){
    loadTheme();
    loadPhotos();
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

takePhotoButton.addEventListener('click', () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            camera.style.display = 'block';
            camera.srcObject = stream;
            savePhotoButton.style.display = 'block';
        })
        .catch(() => {
            alert('Câmera não disponível, faça o upload de uma foto.');
        });
    }
});

uploadPhotoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
        photoPreview.style.display = 'block';
        photoPreview.src = reader.result;
        capturedPhoto = reader.result;
        };
        reader.readAsDataURL(file);
        savePhotoButton.style.display = 'block';
    }
});

document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            displayMap(userLocation);
        }, () => {
            promptForLocation();
        });
    } else {
        promptForLocation();
    }
});

function promptForLocation() {
    const lat = prompt('Insira a latitude:');
    const lng = prompt('Insira a longitude:');
    userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
    };
    displayMap(userLocation);
}

function displayMap(location) {
    mapDiv.style.display = 'block';
    const map = new google.maps.Map(mapDiv, {
        zoom: 15,
        center: location
    });
    new google.maps.Marker({
        position: location,
        map: map
    });
}

savePhotoButton.addEventListener('click', () => {
    const title = photoTitleInput.value;
    const description = photoDescriptionInput.value;
    const photo = photoPreview.src;
    const date = new Date().toLocaleString();
    
    
    if (!photo) {
        alert('Nenhuma foto foi tirada ou carregada!');
        return;
    }
    
    if (!title) {
        alert('O título é obrigatório!');
        return;
    }
    
    const photoData = {
        title,
        description,
        photo,
        location: userLocation,
        date
    };
    
    
    photos.push(photoData);
    localStorage.setItem('photos', JSON.stringify(photos));

    clearInputs();
    loadPhotos();
});

function clearInputs() {
    photoTitleInput.value = '';
    photoDescriptionInput.value = '';
    photoPreview.src = '';
    uploadPhotoInput.value = '';
    photoPreview.style.display = 'none';
    userLocation = null;
    mapDiv.innerHTML = '';
}

function loadPhotos() {
    const tableBody = document.querySelector('#photo-table tbody');
    tableBody.innerHTML = '';
    photos.forEach((photo, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${photo.photo}" alt="Foto"></td>
            <td>${index + 1}</td>
            <td>${photo.title}</td>
            <td>${photo.description || ''}</td>
            <td>${photo.location.lat}, ${photo.location.lng}</td>
            <td>${photo.date}</td>
            <td>
                <button class="view-btn" onclick="viewDetails(${index})">Ver Detalhes</button>
                <button class="edit-btn" onclick="editPhoto(${index})">Editar</button>
                <button class="delete-btn" onclick="deletePhoto(${index})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewDetails(index) {
    const photo = photos[index];
    alert(`
        Título: ${photo.title}
        Descrição: ${photo.description || 'Sem descrição'}
        Localização: ${photo.location.lat}, ${photo.location.lng}
        Data: ${photo.date}
    `);
}

function deletePhoto(id) {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
        photos.splice(id, 1);
        localStorage.setItem('photos', JSON.stringify(photos));
        loadPhotos();
    }
}

function editPhoto(id) {
    const photo = photos[id];
    photoTitleInput.value = photo.title;
    photoDescriptionInput.value = photo.description;
    photoPreview.src = photo.photo;
    // const location = {
    //     latitude: photo.location.lat,
    //     longitude: photo.location.lng  
    // };      
    // console.log(location);  
    // displayMap(location);
    photoPreview.style.display = 'block';
    mapDiv.style.display = 'none';
    const getLocation = document.getElementById('get-location')
    getLocation.style.display = 'none';



    editPhotoButton.style.display = 'block';
    savePhotoButton.style.display = 'none';

    editPhotoButton.addEventListener( 'click' , () => {
        photos[id].title = photoTitleInput.value;
        photos[id].description = photoDescriptionInput.value;
        // photos[id].photo = photoPreview.src;
        // photos[id].location.lat = location.latitude;
        // photo[id].location.lng = location.longitude;

        localStorage.setItem('photos', JSON.stringify(photos));
        clearInputs();
        editPhotoButton.style.display = 'none';
        // savePhotoButton.style.display = 'block';
        mapDiv.style.display = 'block';
        photoPreview.style.display = 'none';
        getLocation.style.display = 'block';
        loadPhotos();
    });

    return;
}

loadPhotos();