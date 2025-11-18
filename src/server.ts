import { Elysia } from 'elysia';
import { addresses } from './modules/addresses';
import { language } from './plugins/language';

const app = new Elysia().use(language).use(addresses).listen(3001);

console.log(
    `Sputnik API is running at ${app.server?.hostname}:${app.server?.port}`,
);
