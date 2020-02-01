const http = require('http')

const port = process.env.PORT || 3000

const page = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>it works...</title>
</head>
<body>
  <h1>it works...</h1>
</body>
</html>
`

const server = http.createServer((req, res) => {
  const { method, url } = req
  process.stdout.write(JSON.stringify({ method, url }) + '\n')
  res.setHeader('Content-Type', 'text/html')
  res.write(page)
  res.end()
}).listen(port)

;['SIGHUP', 'SIGINT'].forEach(signal => {
  process.on(signal, () => {
    server.close()
  })
})
