const socket= io()

// Elements
const chatForm = document.querySelector('#message-form')
const chatFormInput= chatForm.querySelector('input')
const chatFormButton= chatForm.querySelector('button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

// Tamplets
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = ()=>{
    // New message element
    const newMessage = messages.lastElementChild
    // Height of the new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin =parseInt(newMessageStyles.marginBottom)
    const newMessagHeight = newMessage.offsetHeight + newMessageMargin
    // Visible height
    const visibleHeight = messages.offsetHeight
    // Heigth of messages container
    const containerHeight = messages.scrollHeight
    // How far have i scrolled?
    const scrollofset = messages.scrollTop +visibleHeight
    if(containerHeight - newMessagHeight <= scrollofset){
        messages.scrollTop= messages.scrollHeight
    }

}

socket.on('message',(message)=>{
    console.log(message)
    const html= Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('LT')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(location)=>{
    console.log(location)
    const html= Mustache.render(locationTemplate,{
        username:location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('LT')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({ room , users })=>{
   const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const messageText = e.target.elements.message.value

    //disable
    chatFormButton.setAttribute('disabled','disabled')

    socket.emit('sendMessage',messageText,(error)=>{
        //enable 
        chatFormButton.removeAttribute('disabled')
        chatFormInput.value= ''
        chatFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Delevird!')
    })
    })

locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    // navigator.geolocation.getCurrentPosition((position)=>{
    //     console.log(position)
    // })
    locationButton.setAttribute('disabled','disabled')

    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(error)=>{
            if(error)
            {
                return console.log(error)
            }
            locationButton.removeAttribute('disabled')
            console.log('location shared')
        })
      }, error, options);
})

socket.emit('join', { username , room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'

    }
})