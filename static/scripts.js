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
    const email = emailsSelect.value;
    if (email === 'default') {
        alert('Выберите адрес электронной почты');
        return;
    }

    fetch('/api/letters?email=' + email, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
});
