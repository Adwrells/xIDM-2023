const input =  document.getElementById('input_text')
const socket = io("ws://localhost:3000");

    socket.on("receberMSN", (arg, user = 'default') => {
        if(user === 'bot'){
           return ListarMSN('<img src="https://cdn.pixabay.com/photo/2015/06/12/18/31/cute-807306__340.png" width="60px" /> '+arg)
        }
        return ListarMSN(arg)
    });

    input.addEventListener('keyup', (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            return Enviar(input.value)
        }
    })

    document.querySelector('#send').addEventListener('click', (e)=>{
            e.preventDefault();
             Enviar(input.value)
    })

    const Enviar = (arg) =>{
        ListarMSN(arg)
        socket.emit("Geral", arg);
        input.value = ''
    }

    const ListarMSN = (args) =>{
        const elementChat = document.createElement("div")
        elementChat.innerHTML = args
        elementChat.classList.add('col', 's12')
        return document.querySelector('.row').append(elementChat)
    }
