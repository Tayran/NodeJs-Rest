import * as express from 'express';
import { IPagamento } from '../interfaces/IPagamento';
import connectionFactory from '../persistencia/ConnectionFactory'
import * as mysql from 'mysql';
import PagamentosDao from '../persistencia/PagamentosDao';
import ClienteCartoes from '../servicos/ClienteCartoes';
import * as fs from 'fs';

export = (app: express.Application) => {
    app.post('/upload/imagem', (req: express.Request, res: express.Response) => {
        const arquivo = req.headers.filename;
        console.log('arquivo recebido: ' + arquivo);
        
        req.pipe(fs.createWriteStream("files/" + arquivo))       
        .on('finish', () => {
            console.log('arquivo escrito');
            res.status(201).send('ok'); 
        });
    });
}
