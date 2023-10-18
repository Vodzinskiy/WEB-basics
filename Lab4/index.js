const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

const names = [];

io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
        if (names.includes(name)) {
            socket.emit('already-taken');
        } else {
            names.push(name);
            socket.emit('successes')
            io.emit('join', name);
        }
    });
    socket.on('exit', (name) => {
        socket.broadcast.emit('left', name);
        const index = names.indexOf(name);
        if (index !== -1) {
            names.splice(index, 1);
        }
    });
    socket.on('message', (message, name) => {
        socket.broadcast.emit('message', message, name);
        socket.emit('my-message', message)
    });
    socket.on('disconnect', () => {
        if (socket.username != null) {
            socket.broadcast.emit('left', socket.username);
            const index = names.indexOf(socket.username);
            if (index !== -1) {
                names.splice(index, 1);
            }
        }
    })
    socket.on('set-username', (username) => {
        socket.username = username;
    });
});

http.listen(3000, () => {
    console.log('Server started on port 3000');
});