
import EventEmitter from 'events';
import menu from './menu.js';
import utils from './utils.js';

export default class DeckClient extends EventEmitter {
    constructor(socket, config) {
        super();

        this.config = config;
        this.socket = socket;
        this.socket.on('message', (msg)=>this.message(msg));
        this.socket.on('close', (msg)=>this.close(msg));

        
    }

    message(msg) {
        // Handle incoming messages from the client
        const data = JSON.parse(msg.toString());
        console.log('Received message from client:', data);

        // if(data.cmd === 'refreshList') {
        //     this.emit('refreshList')
        // }
        // if(data.cmd === 'add') {
        //     this.emit('add',data)
        // }
        this.emit(data.cmd, data)

    }

    close() {
        // Handle client disconnection
        console.log('ulanzideck Client disconnected');
        this.socket.close();

    }

    listUpdated(data) {
        this.send('listUpdated', {
            data
        })
        this.log('加载插件列表成功！')
    }

    send(cmd, data) {
        this.socket.send(JSON.stringify({
            cmd: cmd,
            ...data
        }))
    }

    log(msg, code) {
        this.send('log', {
            time: utils.time(),
            msg: msg,
            code: code || null
        })
    }


}