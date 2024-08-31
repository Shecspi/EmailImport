const emailsSelect = document.getElementById('emails');
const loadLetterButton = document.getElementById('load-letter');
let numOfAddedLetters = 0;

function addColumn(innerText, parentElement, size) {
    const childElement = document.createElement('div');
    childElement.classList.add(`col-${size}`);
    childElement.innerText = innerText;
    parentElement.append(childElement);
}

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

// Загрузка списка адресов электронной почты
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
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (data.type === 'error') {
            alert(data.message);
        } else if (data.type === 'checked') {
            progressText.innerText = `Проверено писем: ${data.num_of_checked}`;
        } else if (data.type === 'new') {
            // Обновляем список писем
            const letters_list = document.getElementById('letters-list');
            if (!isReceivedData) {
                letters_list.innerHTML = '';
                isReceivedData = true;
            }

            const row = document.createElement('div');
            row.classList.add('row');
            letters_list.prepend(row);

            addColumn(data.uid, row, 1)
            addColumn(data.topic, row, 3)
            addColumn(data.message.trim().slice(0, 200), row, 4)
            addColumn(data.date_of_send, row, 1)
            addColumn(data.date_of_receive, row, 1)
            addColumn(data.files, row, 2)

            // Изменяем количество добавленных писем и прогресс-бар
            numOfAddedLetters++;
            const numOfAllLetters = data.num_of_letters;
            progressText.innerText = `Добавлено писем: ${numOfAddedLetters}. Осталось: ${numOfAllLetters - numOfAddedLetters}`;
            progressBar.style.width = `${(numOfAddedLetters / numOfAllLetters) * 100}%`;

            letters_list.prepend(document.createElement('hr'));
        } else {
            console.log(data);
            alert('Неизвестная ошибка');
        }
    }
});
