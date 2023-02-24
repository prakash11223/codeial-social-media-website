class ChatEngine {
    constructor(chatBoxId, username) {
        this.chatBox = $(`#${chatBoxId}`);
        this.username = username;

        this.socket = io.connect('http://localhost:5000');
        if (this.username) {
            this.connectionHandler();
        }
        //for sending a connection
    }
    connectionHandler() {
        let self = this;

        this.socket.on('connect', function() {
            console.log('connection establised using sockets...');



            self.socket.emit('join_room', {
                user_name: self.username,
                chatroom: 'codeial'
            });
            self.socket.on('user_joined', function(data) {
                console.log('a user joined', data);
            });

        });
        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function() {
            let msg = $('#chat-message-input').val();

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_name: self.username,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function(data) {
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_name == self.username) {
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<div>', {
                'html': data.user_name
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })


    }

}