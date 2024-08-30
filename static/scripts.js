const emailsSelect = document.getElementById('emails');
const loadLetterButton = document.getElementById('load-letter');

function updateEmailsSelect(data) {
    emailsSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.innerHTML = 'Выберите адрес электронной почты';
    defaultOption.selected = true;
    emailsSelect.appendChild(defaultOption);

    data.forEach((email) => {
        const option = document.createElement('option');
        option.value = email.email;
        option.innerHTML = email.email;
        emailsSelect.appendChild(option);
    });

    emailsSelect.disabled = false;
    loadLetterButton.disabled = false;
}

let response = fetch('/api/emails', {
    method: 'GET'
})
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then((data) => {
        updateEmailsSelect(data);
    });

loadLetterButton.addEventListener('click', () => {
    let socket = new WebSocket('ws://localhost:8000/ws/letters');
    let isReceivedData = false;

    // Отправляем в сокет адрес электронной почты, по которому нужно получить список писем
    socket.onopen = () => {
        socket.send(emailsSelect.value);
    }

    // Обрабатываем полученные данные
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const letters_list = document.getElementById('letters-list');
        if (!isReceivedData) {
            letters_list.innerHTML = '';
            isReceivedData = true;
        }

        const row = document.createElement('div');
        row.classList.add('row');
        letters_list.appendChild(row);

        const topicCol = document.createElement('div');
        topicCol.classList.add('col-auto');
        topicCol.innerText = data.topic;
        row.appendChild(topicCol);

        const topicMessage = document.createElement('div');
        topicMessage.classList.add('col-auto');
        topicMessage.classList.add('text-truncate');
        topicMessage.innerText = data.message;
        row.appendChild(topicMessage);

        const topicDateOfSend = document.createElement('div');
        topicDateOfSend.classList.add('col-auto');
        topicDateOfSend.innerText = data.date_of_send;
        row.appendChild(topicDateOfSend);

        const topicOfRecieve = document.createElement('div');
        topicOfRecieve.classList.add('col-auto');
        topicOfRecieve.innerText = data.date_of_receive;
        row.appendChild(topicOfRecieve);

        const topicFiles = document.createElement('div');
        topicFiles.classList.add('col-auto');
        topicFiles.innerText = data.files;
        row.appendChild(topicFiles);
    }
});
