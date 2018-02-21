import * as express from 'express';
import * as mysql from 'mysql';

export = (app: express.Application) => {
    app.post("/cartoes/autoriza", (req: express.Request, res: express.Response) => {
        console.log('processando pagamento com cartão');

          let cartao = req.body;

          req.assert("numero", "Número é obrigatório e deve ter 16 caracteres.").notEmpty().isLength({min: 16, max: 16});
          req.assert("bandeira", "Bandeira do cartão é obrigatória.").notEmpty();
          req.assert("ano_de_expiracao", "Ano de expiração é obrigatório e deve ter 4 caracteres.").notEmpty().isLength({min: 4, max: 4});
          req.assert("mes_de_expiracao", "Mês de expiração é obrigatório e deve ter 2 caracteres").notEmpty().len({min: 2, max: 2});
          req.assert("cvv", "CVV é obrigatório e deve ter 3 caracteres").notEmpty().len({min: 3, max: 3});

          const errors = req.validationErrors();

          if (errors){
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
          }
          cartao.status = 'AUTORIZADO';

          const response = {
            dados_do_cartao: cartao,
          }

          res.status(201).json(response);
          return;
      });
}
