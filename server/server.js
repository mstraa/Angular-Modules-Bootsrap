"use strict"

process.env.NODE_ENV = "development" // "production"

// ========== Require dependencies

var express      = require('express')
  , https        = require("https")
  , fs           = require("fs")
  , exphbs       = require('express-handlebars')
  , app          = express()
  , Static       = express()
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , morgan       = require("morgan")
  , i18n         = require('i18n')
  , configI18n   = require('./config/lang')
  , session      = require('express-session')
  , expressJWT   = require("express-jwt")
  , jwt          = require("jsonwebtoken")
  , path         = require('path')
  , devMode      = (app.get('env') === "development" ? true : false)


module.exports = function(rootpath, port, api_port, secure_port, secure_api_port, welcome, welcomeAPI, db, parent, APIPathRoute) {

// ========== Configuration Server & connect to MongoDB
  rootpath = path.resolve("./public")
  port = 8080
  secure_port = 4443

  welcome = ["The APP is hosted on : ",port," port"].join("")
  welcomeAPI = ["The API is started on : ",api_port," port"].join("")

  // configure Express
  app.use(morgan('dev'))
  app.use(cookieParser())

  // app.use(bodyParser())
  i18n.configure(configI18n)

  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  //app.use(i18n.init)
  app.use(bodyParser.json())

  // statics file (SPA)
  app.use(express.static(rootpath))

  // Auth routes api
  APIPathRoute = [
      /^\/api\/auth/
    , /^\/api\/user\/setadmin\/.*/
    , /^\/api\/user\/.*/
    , /^\/api\/users/
    , /^\/api\/verify\/email/
  ]

  if (devMode)
    APIPathRoute = [/^\/api/ , /^\/api\/.*/]

  // API secured
  app.all("/api", expressJWT({secret:"ilovecats"}).unless({path:APIPathRoute}))
  //app.use(expressJWT({secret:"ilovecats"}).unless({path:APIPathRoute}))
  app.use("/api", require('./routes'))

  app.get('*', function (req, res) {
    var p = [rootpath, '/' ,'index.html'].join("")
    res.sendFile(p)
  })

  // ========== Create & Start Https Server
  https.createServer({
    key: fs.readFileSync(path.resolve('./config/key.pem')),
    cert: fs.readFileSync(path.resolve('./config/cert.pem'))
  }, app).listen(secure_port)

  console.log(welcome)


}
