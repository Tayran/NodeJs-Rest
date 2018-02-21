import * as restify from 'restify-clients';

export default class ClienteCartoes {
    private _cliente;
    
    constructor() {
        this._cliente = restify.createJsonClient({
            url:'http://localhost:3001'
          });
    }

    public autoriza(cartao, callback) {
        this._cliente.post('/cartoes/autoriza', cartao , callback);
    }
}
