const emailsSelect = document.getElementById('emails');
const loadLetterButton = document.getElementById('load-letter');
let numOfAddedLetters = 0;

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
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (data.type === 'checked') {
            progressText.innerText = `Проверено писем: ${data.num_of_checked}`;
        } else {
            const letters_list = document.getElementById('letters-list');
            if (!isReceivedData) {
                letters_list.innerHTML = '';
                isReceivedData = true;
            }

            const row = document.createElement('div');
            row.classList.add('row');
            letters_list.prepend(row);

            addColumn(data.topic, row)
            addColumn(data.message, row)
            addColumn(data.date_of_send, row)
            addColumn(data.date_of_receive, row)
            addColumn(data.files, row)

            numOfAddedLetters++;
            const numOfAllLetters = data.num_of_letters;
            progressBar.style.width = `${(numOfAddedLetters / numOfAllLetters) * 100}%`;
            progressText.innerText = `Добавлено писем: ${numOfAddedLetters}. Осталось: ${numOfAllLetters - numOfAddedLetters}`;

            letters_list.prepend(document.createElement('hr'));
        }
    }
});

function addColumn(innerText, parentElement) {
    const childElement = document.createElement('div');
    childElement.classList.add('col');
    childElement.classList.add('text-truncate');
    childElement.innerText = innerText;
    parentElement.append(childElement);
}
