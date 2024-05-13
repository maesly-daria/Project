/* eslint-disable max-len */
console.log(23);
let perPage = 5;
let currentPage = 1;
let totalPage = 0;
const mainUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/';

const tbody = document.querySelector(".tbody");
let roadName;

function renderOrders(orders) { 
    tbody.innerHTML = ''; 
    for (const result of orders) {
        const tr = document.createElement("tr"); 
        tr.id = result.id; 
        roadName = document.createElement("td"); 
        roadName.textContent = result.name; 
        tr.append(roadName); 
        const description = document.createElement("td"); 
        description.textContent = result.description; 
        tr.append(description); 
        const mainObject = document.createElement("td"); 
        mainObject.textContent = result.mainObject;
        tr.append(mainObject); 

        const changeBtn = document.createElement('button')
        changeBtn.classList.add('changeBtn');
        changeBtn.textContent = "Выбрать";
        changeBtn.addEventListener("click", event => guidsData(tr, event));
        tr.append(changeBtn);//
        tbody.appendChild(tr);  
    }
}
// Пагинация
function renderPagination() {
    const blockPagination = document.querySelector('.pagination');
    blockPagination.innerHTML = '';
    //***
    const prevBtn = document.createElement("button");
    prevBtn.classList.add('nextBtn');
    prevBtn.textContent = 'Обратно';
    prevBtn.style.margin = '2px';
    prevBtn.style.backgroundColor = 'none';
    prevBtn.addEventListener('click', (event) => {
        if (currentPage > 1) {
            currentPage--;
            getOrgers();
        }
    });
    blockPagination.append(prevBtn);//
    
    for (let i = Math.max(parseInt(currentPage) - 2, 1); i <= Math.min(parseInt(currentPage) + 2, totalPage); i++) {
        const btn = document.createElement('button');
        btn.classList.add('pagBtn')
        btn.textContent = i;
        btn.addEventListener('click', (event)=>{
            const target = event.target;
            currentPage = target.textContent;
            getOrgers();
        });
        if (currentPage == i) {
            btn.style.backgroundColor = '#ffffff';
        } else {
            btn.style.backgroundColor = 'none';
        }
        
        blockPagination.append(btn);   }

    const nextBtn = document.createElement("button");
    nextBtn.classList.add('nextBtn');
    nextBtn.textContent = 'Следующий';
    nextBtn.style.margin = '2px';
    nextBtn.style.backgroundColor = 'none';
    nextBtn.addEventListener('click', (event) => {
        if (currentPage < totalPage) {
            currentPage++;
            getOrgers();
        }
    });
    blockPagination.append(nextBtn);
}

function getOrgers() {
    const url = new URL('routes', mainUrl);
    url.searchParams.set('api_key', 'e313f6b6-43db-4653-ab1d-f44d1e7820d1');
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        totalPage = Math.ceil(data.length / perPage);
        const start = currentPage * perPage - perPage;
        const end = currentPage * perPage;
        //***
        for (const order of data) {
            const select = document.querySelector('.form-select');
            select.addEventListener('change', (event) => {
                const selectedObject = event.target.value;  // Получаем выбранный объект
                filterRoadsByObject(selectedObject);        // Вызываем функцию для фильтрации маршрутов по выбранному объекту
            });
            for (const elem of splitMainObject(order.mainObject)) {
                const option = document.createElement("option");
                option.textContent = elem;
                select.append(option);
            };}
        renderOrders(data.slice(start, end));
        renderPagination();
    };
    //***
    xhr.send();
}

function filterRoadsByObject(selectedObject) {
    const rows = document.querySelectorAll('.tour.road tbody tr');  // Получаем все строки таблицы маршрутов
    rows.forEach((row) => {
        if (selectedObject === "Основной объект") {
            row.style.display = '';  // Показываем все строки, если выбрано значение "Основной объект"
        } else {
            if (row.textContent.includes(selectedObject)) {
                row.style.display = '';  // Показываем строку, если объект соответствует выбранному
            } else {
                row.style.display = 'none';  // Скрываем строку, если объект не соответствует выбранному
            }
        }
    });
}

// Добавим сброс фильтра при выборе "Основной объект"
const select = document.querySelector('.form-select');
select.addEventListener('change', (event) => {
    const selectedObject = event.target.value;  // Получаем выбранный объект
    filterRoadsByObject(selectedObject);        // Вызываем функцию для фильтрации маршрутов по выбранному объекту
});

// Добавим обработку события, чтобы сбросить фильтр при выборе "Основной объект"
select.addEventListener('click', (event) => {
    const selectedObject = event.target.value;  // Получаем выбранный объект
    if (selectedObject === "Основной объект") {
        const rows = document.querySelectorAll('.tour.road tbody tr');  // Получаем все строки таблицы маршрутов
        rows.forEach((row) => {
            row.style.display = '';  // Показываем все строки
        });
    }
});

function splitMainObject(value) {
    console.log(value.match(/,/g)?.length)
    if (value.match(/,/g)?.length>=value.match(/\./g)?.length && value.match(/,/g)?.length>value.match(/-/g)?.length) {
        return value.split(',');
    }
    if (value.match(/\./g)?.length>value.match(/-/g)?.length && value.match(/\./g)?.length>=value.match(/,/g)?.length) {
        return value.split('.');
    }
        return value.split('-')
}
// поиск по названию
function searchTable() {
    const input = document.getElementById('tableSearchInput');
    const filter = input.value.toUpperCase();
    const rows = tbody.getElementsByTagName('tr');
    for (let row of rows) {
        let nameColumn = row.getElementsByTagName('td')[0];
        if (nameColumn) {
            let textValue = nameColumn.textContent || nameColumn.innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}


//*** Список гидов
const tbodyguids = document.querySelector(".tbody-guids")

function guidsData(tr, event) {
    tbodyguids.innerHTML = "";
    const guidsRoad = tr.id;
    const guidesUrl = `/api/routes/${guidsRoad}/guides`;
    const xhr = new XMLHttpRequest();
    const newUrl = new URL(guidesUrl, mainUrl);
    newUrl.searchParams.set('api_key', '1ad2694f-6bd9-4ea9-a773-305f1dac2fc7');
    xhr.open("get", newUrl);
    xhr.onload = function() {
        const records = JSON.parse(xhr.response);
        console.log(guidesUrl);
        for (const record of records) {
            console.log(record);
            addDataGuids(record);
        }
    };
    xhr.send();
}//


//*** Список гидов
function addDataGuids(orders) {
    const tr = document.createElement('tr');
    tr.id = orders.id;
    const name = document.createElement('td');
    name.textContent = orders.name;
    tr.append(name);
    const language = document.createElement('td');
    language.textContent = orders.language;
    tr.append(language);
    const workExperience = document.createElement('td');
    workExperience.textContent = orders.workExperience;
    tr.append(workExperience);
    const pricePerHour = document.createElement('td');
    pricePerHour.textContent = `${orders.pricePerHour}₽`;
    tr.append(pricePerHour);
    const gidButton = document.createElement('button')
    gidButton.classList.add('gidButton')
    gidButton.textContent = "Выбрать";
    gidButton.addEventListener("click", event => modal(orders, roadName));
    gidButton.setAttribute("data-bs-toggle", "modal")
    gidButton.setAttribute("data-bs-target", "#exampleModal")
    tr.append(gidButton);
    tbodyguids.appendChild(tr)
}


const modalwindow = document.querySelector(".modal-dialog modal-dialog-centered")//

//*** Модальное окно
function modal(orders) {
    const fio = document.querySelector('.guidname');
    fio.textContent = `ФИО гида: ${orders.name}`;

    const nameRoad = document.querySelector('.roadname');
    nameRoad.textContent = `Название маршрута: ${roadName.textContent}`;

}

document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeBtn');
    const bookBtn = document.getElementById('bookBtn');
    const notification = document.getElementById('notification');

    closeBtn.addEventListener('click', function() {
        showNotification('Заявка отменена');
    });

    bookBtn.addEventListener('click', function() {
        showNotification('Заявка отправлена в личный кабинет');
    });

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(function() {
            notification.style.display = 'none';
        }, 3000);
    }
});


// Алерт и кнопка закрытия 
let closeButtonAlert = document.querySelector(".close");
let alert = document.querySelector(".alert");

closeButtonAlert.onclick = function () {
    alert.style.display = 'none';
}

let buttonCloseRoute = document.querySelector(".btn-secondary");
let inputRoute = document.querySelector(".form-control");
let selectedElement = document.querySelector(".form-select")

buttonCloseRoute.onclick = function () {
    inputRoute.value = "";
    selectedElement.selectedIndex = 0;
    getOrgers();
}

window.addEventListener('DOMContentLoaded', getOrgers);
