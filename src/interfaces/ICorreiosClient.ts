import * as soap from 'soap';

export interface ICorreiosClient extends soap.Client {
    CalcPrazo(args, callback);
}