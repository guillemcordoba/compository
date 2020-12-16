import { withContext } from 'wc-context';
export const withMembraneContext = (baseClass) => class extends withContext(baseClass) {
    static get observedContexts() {
        return ['membrane'];
    }
};
//# sourceMappingURL=with-membrane-context.js.map