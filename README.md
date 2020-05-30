# hammer-events
A LitElement Mixin used to listen for the hammer events
[hammerjs](https://hammerjs.github.io/),

## Usage

### Installation
```
  npm install @dremworld/hammer-events;

  OR

  yarn add @dremworld/hammer-events;
```

### In a lit element
```js
import { hammerEvents } from '@dremworld/hammer-events';

class SampleElement extends hammerEvents(LitElement) {
  render() {
    return html`
      <div class="loading">
        <div class="test">horizontal layout center alignment</div>
      </div>
    `;
  }

  constructor() {
    super();

    /**
     * Host element hammer events are bind.
     * Passed event has(event as a key and value as event options).
     * E.g: {'tap': {}, 'swipe': {}}
     */
    this.hammerEvents = {'tap': {}, 'swipe': {}};

    /**
     * Local element hammer events are bind.
     * Passed event has(event as a key and value as a selectors and event options).
     * e.g.: {'tap': {'selectors': ['.loading', '#container', 'paper-button'], options: {}}}
     */
    this.hammerLocalEvents = {'swipe': {'selectors': ['.loading']}, 'options': {}};
  }

  //Called super class connectedCallback method because `hammerevents` is bind `connectedCallback` method.
  connectedCallback() {
    super.connectedCallback && super.connectedCallback();

    this.addEventListener('tap', function(e){
      console.log("tap event triggered");
    });
  }
}
customElements.define('sample-element', SampleElement);
```

### Methods
| Name | Description |  
| :------- | ----: |
| hammerRefresh() |  Re-bind local element events. It's mainly used If after randered the local dom you can simpy call this method. |
| hammerdestroy() | Destroy hammer events for local eleemnt and also host events. |