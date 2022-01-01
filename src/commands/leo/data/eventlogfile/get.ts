import { SfdxCommand, flags } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

Messages.importMessagesDirectory(__dirname);

const MESSAGES = Messages.loadMessages('@leostewart/sfdx-plugin', 'eventlogfile.get');

const ONE_HUNDRED_MB = 1000 * 1024; // sufficiently large to warrant compression

export default class Get extends SfdxCommand {
  public static description = MESSAGES.getMessage('commandDescription');

  protected static requiresUsername = true;

  protected static flagsConfig = {
    fileid: flags.string({
      char: 'i',
      description: MESSAGES.getMessage('fileidFlagDescription'),
      required: true,
    }),
  };

  public async run(): Promise<AnyJson> {
    this.ux.startSpinner(MESSAGES.getMessage('commandRunningMessage'));

    const conn = this.org.getConnection();
    const record = await conn.sobject('EventLogFile').retrieve(this.flags.fileid);
    const url = `${conn.instanceUrl}${record['LogFile'] as string}`;

    // use compression for large event log files
    // JSForce uses 'request' which supports automatic decoding
    const requestInfo = record['LogFileLength'] > ONE_HUNDRED_MB ? { url, gzip: true } : url;

    const responseType = 'text'; // prevent JSForce from parsing response
    const data: string = await conn.request(requestInfo, { responseType });
    this.ux.log(data);
    return { data };
  }
}
