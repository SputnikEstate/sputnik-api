import { Elysia } from 'elysia';
import { address } from './modules/address';

const app = new Elysia().use(address).listen(3000);

console.log(
    `Sputnik API is running at ${app.server?.hostname}:${app.server?.port}`,
);
