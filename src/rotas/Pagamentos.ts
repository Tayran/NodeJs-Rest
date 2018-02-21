import * as express from 'express';
import { IPagamento } from '../interfaces/IPagamento';
import connectionFactory from '../persistencia/ConnectionFactory'
import * as mysql from 'mysql';
import PagamentosDao from '../persistencia/PagamentosDao';
import ClienteCartoes from '../servicos/ClienteCartoes';

export = (app: express.Application) => {
    app.get('/pagamentos', (req: express.Request, res: express.Response) => {
        console.log('Recebida requisicao de teste na porta 3000.');
        res.send('OK.');
    });
    
    app.put('/pagamentos/pagamento/:id', (req: express.Request, res: express.Response) => {
        const id:number = req.params.id;
        
        let pagamento:IPagamento = {id: id};
        
        pagamento.status = "CONFIRMADO";
        
        const connection: mysql.Connection = connectionFactory();
        const PagamentosD = new PagamentosDao(connection);
        
        PagamentosD.atualiza(pagamento, (erro) => {
            if(erro)
            {
                res.status(500).send(erro);            
            }
            console.log('Pagamento criado.');
            res.send(pagamento);          
        });
        
    });
    
    app.get('/pagamentos/pagamento/:id', (req: express.Request, res: express.Response) => {
        const id:number = req.params.id;
        console.log('consultando pagamento: ' + id);

        const connection: mysql.Connection = connectionFactory();
        const PagamentosD = new PagamentosDao(connection);
        
        PagamentosD.buscaPorId(id, (erro: mysql.MysqlError, result: mysql.Query) => {
            if(erro){
                console.log('erro ao consultar no banco: ' + erro);
                res.status(500).send(erro);
                return;
              }
              console.log('pagamento encontrado: ' + JSON.stringify(result));
              res.json(result);
              return;
        });
        
    });
    
    
    app.delete('/pagamentos/pagamento/:id', (req: express.Request, res: express.Response) => {
        const id:number = req.params.id;
        
        let pagamento:IPagamento = {id: id};
        
        pagamento.status = "CANCELADO";
        
        const connection: mysql.Connection = connectionFactory();
        const PagamentosD = new PagamentosDao(connection);
        
        PagamentosD.atualiza(pagamento, (erro) => {
            if(erro)
            {
                res.status(500).send(erro);            
            }
            console.log('Pagamento cancelado.');
            res.status(204).send(pagamento);          
        });
        
    });
    
    app.post('/pagamentos/pagamento', (req: express.Request, res: express.Response) => {
        let pagamento: IPagamento = req.body;
        
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento eh obrigatorio").notEmpty();
        req.assert("pagamento.valor", "Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().isLength({min: 3, max: 3});
        
        let errors = req.validationErrors();
        
        if (errors){
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }
        
        console.log('processando pagamento...');
        console.log(pagamento);
        const connection: mysql.Connection = connectionFactory();
        const PagamentosD = new PagamentosDao(connection);
        
        pagamento.status = "CRIADO";
        pagamento.data = new Date;
        
        PagamentosD.salva(pagamento, (err, result) => {
            if (err){
                res.status(400).send(err);
            } else {
                pagamento.id = result.insertId;
                console.log('pagamento criado');
                if (pagamento.forma_de_pagamento == 'cartao'){
                    const cartao = req.body["cartao"];
                    console.log(cartao);
                    
                    const clienteCartoes = new ClienteCartoes();
                    
                    clienteCartoes.autoriza(cartao, (exception, request, response, retorno) => {
                        if(exception){
                            console.log(exception);
                            res.status(400).send(exception);
                            return;
                        }
                        console.log(retorno);
                        
                        res.location('/pagamentos/pagamento/' + pagamento.id);
                        
                        const responseJson = {
                            dados_do_pagamanto: pagamento,
                            cartao: retorno,
                            links: [
                                {
                                    href:"http://localhost:3000/pagamentos/pagamento/"
                                    + pagamento.id,
                                    rel:"confirmar",
                                    method:"PUT"
                                },
                                {
                                    href:"http://localhost:3000/pagamentos/pagamento/"
                                    + pagamento.id,
                                    rel:"cancelar",
                                    method:"DELETE"
                                }
                            ]
                        }
                        res.status(201).json(responseJson);
                        return;
                    });
                } else {
                    res.location('/pagamentos/pagamento/' +
                    pagamento.id);
                    
                    var response = {
                        dados_do_pagamanto: pagamento,
                        links: [
                            {
                                href:"http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                                rel:"confirmar",
                                method:"PUT"
                            },
                            {
                                href:"http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                                rel:"cancelar",
                                method:"DELETE"
                            }
                        ]
                    }
                    
                    res.status(201).json(response);
                }
            }
        });
        
    });
}
