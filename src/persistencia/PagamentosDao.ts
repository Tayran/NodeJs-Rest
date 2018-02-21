import * as mysql from 'mysql';
import { IPagamento } from '../interfaces/IPagamento';

export default class PagamentosDao {
    constructor(private connection: mysql.Connection) {
        this.connection = connection;
    }

    public salva(pagamento: IPagamento, callback: mysql.queryCallback) {
        this.connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
    }

    public atualiza(pagamento: IPagamento, callback: mysql.queryCallback) {
        this.connection.query('UPDATE pagamentos SET status = ? where id = ?', [pagamento.status, pagamento.id], callback);
    }

    public lista(callback: mysql.queryCallback) {
        this.connection.query('select * from pagamentos',callback);
    }

    public buscaPorId(id: number, callback: mysql.queryCallback) {
        this.connection.query("select * from pagamentos where id = ?",[id],callback);
    }
}
