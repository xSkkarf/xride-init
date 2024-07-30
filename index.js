const express = require('express');
const app = express()

const port = 3000 || process.env.PORT
let status = false

app.get('/toggle', (req, res)=>{
    status =!status
    res.send(status)
    console.log('Status changed:', status)
})

app.get('/getstatus', (req, res)=>{
    res.send(status)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})