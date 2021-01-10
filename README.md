ssh-server
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ssh-server.svg)](https://npmjs.org/package/ssh-server)
[![Downloads/week](https://img.shields.io/npm/dw/ssh-server.svg)](https://npmjs.org/package/ssh-server)
[![License](https://img.shields.io/npm/l/ssh-server.svg)](https://github.com/Troublor/ssh-server/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ssh-server
$ ssh-server COMMAND
running command...
$ ssh-server (-v|--version|version)
ssh-server/1.0.0 darwin-x64 node-v14.15.3
$ ssh-server --help [COMMAND]
USAGE
  $ ssh-server COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ssh-server help [COMMAND]`](#ssh-server-help-command)
* [`ssh-server shell [SERVER]`](#ssh-server-shell-server)

## `ssh-server help [COMMAND]`

display help for ssh-server

```
USAGE
  $ ssh-server help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `ssh-server shell [SERVER]`

open server shell

```
USAGE
  $ ssh-server shell [SERVER]

ARGUMENTS
  SERVER  name of server predefined in config file

OPTIONS
  -H, --home=home          home path on the server
  -h, --help               show CLI help
  -h, --host=host          host of the server
  -k, --keyFile=keyFile    path to ssh key file to logon server
  -p, --password=password  password to logon server
  -u, --username=username  username used to logon server

EXAMPLE
  $ ssh-server shell
```

_See code: [src/commands/shell.ts](https://github.com/Troublor/ssh-server/blob/v1.0.0/src/commands/shell.ts)_
<!-- commandsstop -->
