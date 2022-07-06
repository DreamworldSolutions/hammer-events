# hammer-events
A LitElement Mixin used to listen for the hammer events
[hammerjs](https://hammerjs.github.io/).

## Usage
> Note: Use hammer events only when it's required actually. Instead use browser's default events like. `click`, `dblclick`, `pointerdown` etc...
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
    this.hammerLocalEvents = {'tap': {'selectors': ['.loading']}, 'options': {}};
  }

  //Called super class connectedCallback method because `hammerevents` is bind `connectedCallback` method.
  connectedCallback() {
    super.connectedCallback && super.connectedCallback();

    this.addEventListener('tap', function(e){
      console.log("tap event triggered");
    });
  }

  render() {
    return html`
      <div class="loading" @tap=${this.__onLoadingTap}>
        <div class="test">Loading..</div>
      </div>
    `;
  }

  __onLoadingTap() {
    console.log("tap on loading...");
  }
}
customElements.define('sample-element', SampleElement);
```

### Methods
| Name | Description |  
| :------- | ----: |
| hammerRefresh() |  Re-bind local element events. It's mainly used If after randered the local dom you can simpy call this method. |
| hammerDestroy() | Destroy hammer events for local eleemnt and also host events. |
