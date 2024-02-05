import { Plugin } from 'vite';
import { Options } from '@vuetify/loader-shared';

declare module 'vite-plugin/src' {
    function vuetify(options?: Options): Plugin[];
    export default vuetify;
}