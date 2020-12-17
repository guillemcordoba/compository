import { _ as __decorate, c as customElement, q as query, p as property } from './decorators-47203ba8.js';
import { h as html } from './lit-element-6dc8ff87.js';
import './base-element-9dfa4130.js';
import './foundation-9806e19c.js';
import './mwc-ripple-css-c770044e.js';
import { c as classMap } from './class-map-322d8040.js';
import './style-map-1dd13c69.js';
import './mwc-ripple-bc76fb3c.js';
import './ripple-handlers-a617bd83.js';
import { S as Scoped } from './ScopedElementMixin-161556eb.js';
import './mwc-ripple.js';
import './form-element-6746b4ce.js';
import './if-defined-2d5d1c62.js';
import { s as style, C as CheckboxBase, a as Checkbox$1 } from './mwc-checkbox-9211ecd1.js';
import './observer-c2e992b9.js';
import { L as ListItemBase, s as style$1 } from './mwc-list-item-css-b2fd91d6.js';
import { s as style$2 } from './mwc-control-list-item-css-3b4b80db.js';

/** @soyCompatible */
let Checkbox = class Checkbox extends CheckboxBase {
};
Checkbox.styles = style;
Checkbox = __decorate([
    customElement('mwc-checkbox')
], Checkbox);

/**
 @license
 Copyright 2020 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
class CheckListItemBase extends ListItemBase {
    constructor() {
        super(...arguments);
        this.left = false;
        this.graphic = 'control';
    }
    render() {
        const checkboxClasses = {
            'mdc-list-item__graphic': this.left,
            'mdc-list-item__meta': !this.left,
        };
        const text = this.renderText();
        const graphic = this.graphic && this.graphic !== 'control' && !this.left ?
            this.renderGraphic() :
            html ``;
        const meta = this.hasMeta && this.left ? this.renderMeta() : html ``;
        const ripple = this.renderRipple();
        return html `
      ${ripple}
      ${graphic}
      ${this.left ? '' : text}
      <span class=${classMap(checkboxClasses)}>
        <mwc-checkbox
            reducedTouchTarget
            tabindex=${this.tabindex}
            .checked=${this.selected}
            ?disabled=${this.disabled}
            @change=${this.onChange}>
        </mwc-checkbox>
      </span>
      ${this.left ? text : ''}
      ${meta}`;
    }
    async onChange(evt) {
        const checkbox = evt.target;
        const changeFromProp = this.selected === checkbox.checked;
        if (!changeFromProp) {
            this._skipPropRequest = true;
            this.selected = checkbox.checked;
            await this.updateComplete;
            this._skipPropRequest = false;
        }
    }
}
__decorate([
    query('slot')
], CheckListItemBase.prototype, "slotElement", void 0);
__decorate([
    query('mwc-checkbox')
], CheckListItemBase.prototype, "checkboxElement", void 0);
__decorate([
    property({ type: Boolean })
], CheckListItemBase.prototype, "left", void 0);
__decorate([
    property({ type: String, reflect: true })
], CheckListItemBase.prototype, "graphic", void 0);

class CheckListItem extends Scoped(CheckListItemBase) {
    static get scopedElements() {
        return {
            'mwc-checkbox': Checkbox$1,
        };
    }
}
CheckListItem.styles = [style$1, style$2];

export { CheckListItem };
//# sourceMappingURL=mwc-check-list-item.js.map
