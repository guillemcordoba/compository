import './decorators-47203ba8.js';
import './lit-element-6dc8ff87.js';
import './base-element-9dfa4130.js';
import './foundation-9806e19c.js';
import './mwc-ripple-css-c770044e.js';
import './class-map-322d8040.js';
import './style-map-1dd13c69.js';
import './mwc-ripple-bc76fb3c.js';
import './ripple-handlers-a617bd83.js';
import { S as Scoped } from './ScopedElementMixin-161556eb.js';
import { Ripple } from './mwc-ripple.js';
import './observer-c2e992b9.js';
import { L as ListItemBase, s as style } from './mwc-list-item-css-b2fd91d6.js';

class ListItem extends Scoped(ListItemBase) {
    static get scopedElements() {
        return {
            'mwc-ripple': Ripple,
        };
    }
}
ListItem.styles = style;

export { ListItem };
//# sourceMappingURL=mwc-list-item.js.map
