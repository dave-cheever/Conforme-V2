import { Context } from "@azure/functions";

import IConfig from "../interfaces/IConfig";

export class LoggingService {

    private _context: Context;
    private _config: IConfig;
    private _logs: string[];

    public constructor(context: Context, functionName: string, config: IConfig) {

        this._context = context;
        this._config = config;
        this._logs = [];
        this.Write(`***Start ${functionName}****`);

    }

    public async Write(message: string) {

        this._context.log(message)
        const time = new Date().toISOString();
        this._logs.push(`[${time}]: ${message}`);

    }

    public async Debug(message: string) {

        if (this._config.DebugMode) {
            await this.Write(message);
        }

    }

    public async GetLogs(asHTML = false): Promise<string> {

        let logs = "";

        for (const log of this._logs) {
            if (asHTML) {
                // process log entry for html
                let htmlLog = "";
                if (log.indexOf('ERROR') >= 0) {
                    // process log as error
                    htmlLog += `<div style="color:red; font-weight: bold">`
                    htmlLog += `${log.split(' ').join('&nbsp;')} <br />`;
                    htmlLog += `</div>`
                } else {
                    // process normal log
                    htmlLog += `${log.split(' ').join('&nbsp;')} <br />`;
                }

                logs += htmlLog;

            } else {
                // add simple log (not html)
                logs += log;
            }
        }

        return logs;

    }

}