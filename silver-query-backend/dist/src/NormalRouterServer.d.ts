import { Server } from '@overnightjs/core';
declare class NormalRouterServer extends Server {
    private readonly FRONT_END_MSG;
    private readonly START_MSG;
    constructor();
    private setupControllers;
    start(port?: number): void;
}
export default NormalRouterServer;
