const socket = io();
let messages = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const nameInput = document.getElementById('name-input');
const sendButton = document.getElementById('send-button');
const appDiv = document.getElementById('app');
const modal = document.getElementById('modal');
const err = document.getElementById("submit-error")
const chatTitle = document.getElementById("chat-title")
let name;
let nameSet = false;

document.getElementById('modal').style.display = 'block';
appDiv.classList.add('blur');

function sendMessage() {
    const message = messageInput.value;
    if (message !== "") {
        socket.emit('message', message, name);
        messageInput.value = '';
    }
}

messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});
sendButton.addEventListener('click', sendMessage);
socket.on('message', (message, name) => {
    if (nameSet) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `
    <div class="chat-message message">
        <p class="name">${name}</p>
        <br>
        <p>${message}</p>
        <p class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
    </div>
    `
        messages.appendChild(messageElement);
    }
});

socket.on('my-message', (message) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
    <div class="my-message message">
        <p>${message}</p>
        <p class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
    </div>
    `
    messages.appendChild(messageElement);
});

socket.on('already-taken', () => {
    err.textContent = "Name is already taken"
});

socket.on('successes', () => {
    modal.style.display = 'none';
    appDiv.classList.remove('blur');
    err.textContent = ""
    socket.emit('set-username', name)
    nameSet = true
    chatTitle.textContent = "Login as " + name
});

socket.on('join', (leftName) => {
    if (nameSet) {
        const element = document.createElement('div');
        element.innerText = leftName + " joined the chat";
        element.classList.add("notification")
        messages.appendChild(element);
    }
});

socket.on('left', (name) => {
    if (nameSet) {
        const element = document.createElement('div');
        element.innerText = name + " left the chat";
        element.classList.add("notification")
        messages.appendChild(element);
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    modal.style.display = 'block';
    appDiv.classList.add('blur');
    messages.innerHTML = ''
    socket.emit('exit', name)
});

document.getElementById('name-submit').addEventListener('click', () => {
    name = nameInput.value
    socket.emit('new-user', name)
});