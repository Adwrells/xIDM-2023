const express = require('express')
const app = express()
const path = require('path');
const axios = require('axios')

/* 

    Copyright Vitor Gabriel e Silva 2023
    Github: https://github.com/vitor-e-silva
    Linkedin: https://www.linkedin.com/in/vitor-silva-8a4ab8226/

*/

app.use(express.static('public'));

/* Dir do HTML*/

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
})

/* listar */

const server = app.listen(3000, function(error){
    if(error) console.log('Erro ao iniciar o servidor (Verifique a porta de serviço)')
    console.log('Servidor iniciado')
})

const ConsultarImg = async (params) => {
    return await axios.get(`https://api.pexels.com/v1/search?query=${params}&per_page=1`,{
            headers: {'Authorization': 'LmMpbsEeGoY8CnqjmYp7dTXksIpt2nl4I7YooNopzjtZVJgKNZNU3WlJ'}
    })
}

/* Bot funções */

const Bot = async (key) =>{
    let Bot = {
        author: 'bot',
        msn: ''
    }
    let keys = key.split(' ')

    switch (keys[0]) {
        case '/help':
            Bot.msn = 'Meus Comandos: ( /helloworld, /imagem [argumento] )'
        break;
        case '/helloworld':
            Bot.msn = 'Muito clichê eu dizer "Olá Mundo", digo bem vindo!.'
        break;
        case '/imagem':
            let img = await ConsultarImg(keys[1])
            if(await img.data.photos[0] === undefined)
            Bot.msn = 'Não foi possível achar a imagem' 
            else{
                Bot.msn = `<img src="${img.data.photos[0].src.small}" alt="${img.data.photos[0].alt}"/>`
            }
            
        break;
        default:
            Bot.msn = 'Desculpe, não entendi o que quiz dizer! Meus Comandos /help.'
        break;
    }
    return Bot
}

var msn = [];

const io = require('socket.io')(server);

io.on('connection', client => {
    console.log('Cliente: '+client.id+' Conectado as '+client.handshake.time)

    msn.forEach((data)=>{
        client.emit("receberMSN", data)
    })

    client.on("Geral", async (arg) => {
        msn.push(arg)
        client.broadcast.emit("receberMSN", arg)
        let botimg = await Bot(arg)
        client.emit("receberMSN", botimg.msn , botimg.author)
    });

    client.on('disconnect', () => {
        console.log('Cliente: '+client.id+' Desconectado as '+client.handshake.time)
    });
});


