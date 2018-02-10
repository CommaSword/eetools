# eetools
a console for managing a running [Empty Epsilon](http://daid.github.io/EmptyEpsilon/) game / server
early WIP
contributions (feedback, code, tests, issues) are welcomed!


## how to install 
 - make sure you have [node.js](https://nodejs.org/) installed, version 8 and above.
 - in the command prompt, run `npm i -g eetools` (requires an internet connection)
    - after a few seconds, the installation is done and a message will appear:
```commandline
+ eetools@x.y.z
updated 1 package in 8.69s
```
(the latest version is now installed in your machine)


#how to use

## running the tools
start an empty epsilon server with `httpserver` option turned on (warning - this is an experimental feature). for example:
```commandline
my-machine$ EmptyEpsilon httpserver=8081
```

run eetools from the command line, followed by host name and HTTP port number of the empty epsilon server.
you will then enter the eetools prompt:
```commandline
my-machine$ eetools localhost 8081

eetools:localhost:8081$ 
```
type `help` to get a list of current capabilities, `exit` to exit.

## lua mode
Lua mode allows you access to the running game's scripts API (the same capabilities as when writing a scenarios).
warning - if you don't know how to read and write scripts, you would probably have a hard time getting value out of this mode.

to enter lua mode, run lua inside eetools
```commandline
eetools:localhost:8081$ lua
Entering LUA Mode. To exit, type 'exit'
eetools:localhost:8081$ lua: 
```
now type whatever lua expression you wish, and it will be executed in the game's live context.
### examples
run some basic lua expression 
```commandline
eetools:localhost:8081$ lua: 'hello' .. ' world'
hello world
```
print the player's ship hull and change it to some outrageous value

```commandline
eetools:localhost:8081$ lua: getPlayerShip(-1):getHull()
250
eetools:localhost:8081$ lua: getPlayerShip(-1):setHull(123456)
```
you will notice that the hull of the first ship is now 123456 out of 250 total. how cool is that?

## how to set up a local development environment

 - download code from github
   - either `git clone git@github.com:CommaSword/eetools.git`
   - or download [zip file](https://github.com/CommaSword/eetools/archive/master.zip) and extract files to folder `nili`
 - inside folder `eetools` run `npm install` from the comand line
 - inside folder `eetools` run `npm build` from the comand line
 - inside folder `eetools` run `npm start` from the comand line to run the tools locally. 
   - use `--` to add parameters to `npm start` like so: 
```commandline
my-machine$ npm start -- localhost 8081
```
