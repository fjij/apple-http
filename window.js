const http = require('http')
const fs = require ('fs')
const path = require('path')
const isElevated = require('is-elevated')

const defaultPort = 3000
const elevatedPort = 80
const errorFile = path.join(__dirname, "404.html")

let port

var directory = path.join(__dirname, "directory")


const server = http.createServer((req, res) => {
  const { headers, method, url } = req
  let body = [];
  req.on('error', (err) => {
    console.error(err)
  }).on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()

    res.on('error', (err) => {
      console.error(err)
    })

    const responseBody = { headers, method, url, body }

    // Headers
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    // Path
    var filename = path.join(directory, req.url)
    filename.replace('..', '')

    // Check if requested file is present
    var stream = fs.createReadStream(filename)
    // on stream error
    stream.on('error', (err) => {
      console.error(err)
      stream.unpipe(res)
      stream.destroy()

      // Check if index.html is present
      filename = path.join(directory, req.url, 'index.html')
      filename.replace('..', '')
      var indexStream = fs.createReadStream(filename)
      // on indexStream error
      indexStream.on('error', (err) => {
        console.error(err)
        indexStream.unpipe(res)
        indexStream.destroy()

        res.statusCode = 404
        var errorStream = fs.createReadStream(errorFile)
        errorStream.pipe(res)
      })
      indexStream.pipe(res)
    })
    stream.pipe(res)
  })
})

$(() => {
  isElevated().then(elevated => {
    if (elevated) {
      port = elevatedPort
      $('#portText').text(port)
      $('#notElevatedText').text('')
    } else {
      port = defaultPort
    }
    $('#directoryText').text(directory)
    $('#portText').text(port)

    $('#directoryButton').on('click', () => {
      $('#directoryInput').click()
    })

    $('#directoryInput').on('change', () => {
      directory = document.getElementById('directoryInput').files[0].path
      $('#directoryText').text(directory)
    })
    server.listen(port)
  })
})
