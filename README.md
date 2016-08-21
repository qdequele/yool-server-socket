# YOOL - Socket [![Build Status](https://travis-ci.org/getyool/yool-server-socket.svg?branch=master)](https://travis-ci.org/getyool/yool-server-socket)

This is the socket service of yool server

Install nodemon for start server with 'Forever' :

`npm install -g nodemon`

You must have rethinkdb, install with :

`brew update && brew install rethinkdb`

Start the rethinkdb server with :

`rethinkdb`

You must have RabbitMQ, install with :

`brew update && brew install rabbitmq`

The RabbitMQ server scripts are installed into `/usr/local/sbin`. This is not automatically added to your path, so you may wish to add `PATH=$PATH:/usr/local/sbin` to your `.bash_profile`, `.zshrc` or `.profile`.

Start the RabbitMQ server with :

`rabbitmq-server`

Watch your rethinkdb server status online `http://localhost:8080`
Watch your RabbitMQ server status online `http://localhost:15672`

Install all npm packages :

`npm install`

Launch the server :

`nodemon index.js`
