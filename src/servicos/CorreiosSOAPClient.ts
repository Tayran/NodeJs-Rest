import * as soap from 'soap';
import { ICorreiosClient } from '../interfaces/ICorreiosClient';

class CorreiosSOAPClient {
    constructor(private _url: string) {
        this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
    }

    public calculaPrazo(args, callback) {
        soap.createClient(this._url, (erro, cliente: ICorreiosClient) => {
            console.log('cliente soap criado');
            cliente.CalcPrazo(args, callback);
        });
    }
}

export = CorreiosSOAPClient;