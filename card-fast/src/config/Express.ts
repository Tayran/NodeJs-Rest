import * as express from 'express';
import * as consign from 'consign';
import * as bodyParser from 'body-parser';
import * as validator from 'express-validator';

class Express {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.configs();
        this.routes();
    }

    private configs(): void {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(validator());
    }
  
    private routes(): void {
        consign()
            .include('/dist/rotas')
            .into(this.app);
    }
}

export default new Express().app;