import http from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';

import utils from './server/utils.js';
import DeckClient from './server/deckClient.js';
import Clients from './server/clients.js';


const serverPort = 39069 ; //模拟器端口
const app = express();
const server = http.createServer(app);



//设置静态文件目录
app.use(express.static(utils.getRootPath()+'/static'));

const wsServer = new WebSocketServer({server:server});


let clientConfig = {
    "language": "zh_CN",
    "loadAction": "no",
    "runMain": "no",
    serverPort
}



const clients = new Clients(clientConfig)


wsServer.on('connection', (ws,msg) => {

    //当有客户端连接上服务器，将会进到connection
    console.log('=======connection========');


    //say hello
    ws.send(JSON.stringify({code:0}),function (err) {
        if(err){
            console.log('send notify error');
        }
    });

    let roomid = msg.url.split('/');
    const len = roomid.length-1;
    roomid = roomid[len];
    //deckClient 是模拟器，其他的插件不带这个字段
    if(roomid == 'deckClient'){

        clients.addClient(ws,'deckClient');

    }else{
        clients.addClient(ws);
    }




});


server.listen(serverPort,()=>{
    console.log(`server started and run http://localhost:${serverPort}`);
});


