import { Elysia } from 'elysia';
import { addresses } from './modules/addresses';
import { language } from './plugins/language';

new Elysia().use(language).use(addresses).listen(3001);
