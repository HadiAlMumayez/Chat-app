const users = []
// add, remove, getuser, getusers
const addUser = ({ id, username, room})=>{
    // Clean the data
    username = username.trim().toLowerCase()
    room.trim().toLowerCase()

    // Validat the data
    if(!username || !room){
        return {
            error:'Username and room are requierd!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = {id,username,room}
    users.push(user)
    return { user}
}

const removeUser =(id) =>{
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=>{
    return user = users.find((user)=> user.id ===id)
}

const getUsersInRoom = (room)=>{
    return userss = users.filter((user) => user.room === room) 
}


module.exports= {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}