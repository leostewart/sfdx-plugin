# sfdx-plugin

A plugin for the Salesforce CLI.

## Installation

The plugin can be installed with the following command:

```sh-session
$ sfdx plugins:install https://github.com/leostewart/sfdx-plugin
```

## Commands
  <!-- commands -->
* [`sfdx leo:data:eventlogfile:get`](#sfdx-leodataeventlogfileget)

## `sfdx leo:data:eventlogfile:get`

displays an EventLogFile

```
USAGE
  $ sfdx leo:data:eventlogfile:get -i <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --fileid=fileid                                                               (required) the ID of the
                                                                                    EventLogFile record

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Specify the ID of the EventLogFile.
```

_See code: [src/commands/leo/data/eventlogfile/get.ts](https://github.com/leostewart/sfdx-plugin/blob/v0.1.0/src/commands/leo/data/eventlogfile/get.ts)_
<!-- commandsstop -->
