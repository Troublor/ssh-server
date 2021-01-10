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
* [`ssh-server hello [FILE]`](#ssh-server-hello-file)
* [`ssh-server help [COMMAND]`](#ssh-server-help-command)

## `ssh-server hello [FILE]`

describe the command here

```
USAGE
  $ ssh-server hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ssh-server hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Troublor/ssh-server/blob/v1.0.0/src/commands/hello.ts)_

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
<!-- commandsstop -->
