import { SfdxCommand, flags } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonCollection } from '@salesforce/ts-types';
import { cli } from 'cli-ux';

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
    csv: flags.boolean({
      description: MESSAGES.getMessage('csvFlagDescription'),
    }),
  };

  public async run(): Promise<JsonCollection> {
    this.ux.startSpinner(MESSAGES.getMessage('commandRunningMessage'));

    const conn = this.org.getConnection();
    const record = await conn.sobject('EventLogFile').retrieve(this.flags.fileid);
    const url = `${conn.instanceUrl}${record['LogFile'] as string}`;

    // use compression for large event log files
    // JSForce uses 'request' which supports automatic decoding
    const requestInfo = record['LogFileLength'] > ONE_HUNDRED_MB ? { url, gzip: true } : url;

    const data = await conn.request(requestInfo);

    // directly use cli-ux for its recent support for csv format
    if (!this.flags.json) {
      // create columns with uppercase headers from first data row; otherwise, headers are capitalized
      const columns = Object.fromEntries(Object.entries(data[0]).map(([k]) => [k, { header: k.toUpperCase() }]));

      // see https://oclif.io/docs/table
      cli.table(data as Array<Record<string, string>>, columns, { csv: this.flags.csv as boolean });
    }

    return data;
  }
}
