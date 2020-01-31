import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import errorMiddleware from './middleware/error';

class NormalRouterServer extends Server {

    private readonly FRONT_END_MSG = 'OvernightJS with standard express router started.';
    private readonly START_MSG = 'OvernightJS with standard express router started on port: ';


    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.setupControllers();
        this.app.use(errorMiddleware);
    }


    private setupControllers(): void {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === 'function') {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }


    public start(port?: number): void {
        port = port || 3000;
        this.app.get('*', (req, res) => {
            res.send(this.FRONT_END_MSG);
        });
        this.app.listen(port, () => {
            Logger.Imp(this.START_MSG + port);
        });
    }
}

export default NormalRouterServer;