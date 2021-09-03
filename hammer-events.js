import Hammer from '@dreamworld/hammerjs';
import isEmpty from 'lodash-es/isEmpty';
import forEach from 'lodash-es/forEach';
export const hammerEvents = (baseElement) => class extends baseElement {
  constructor() {
    super();
    this._hammerEventsHadlers = {};
    this._hammerLocalEventsHandlers = {}
  }

  static get properties() {
    return {

      /**
       * Host element hammer events are bind.
       * Passed event has(event as a key and value as event options).
       * E.g: {'tap': {}, 'swipe': {}}
       */
      hammerEvents: {
        type: Object
      },

      /**
       * Local element hammer events are bind.
       * Passed event has(event as a key and value as a selectors and event options).
       * e.g.: {'tap': {'selectors': ['.loading', '#container', 'paper-button'], options: {}}}
       */
      hammerLocalEvents: {
        type: Object
      }
    };
  }

  /**
   * Re-bind hammer local event.
   * @public
   */
  hammerRefresh() {
    this._bindHammerLocalEvents();
  }

  /**
   * Destroy all event of hammer.
   * @public
   * @deprecated
   */
  hammerdestroy() {
    this.hammerDestroy();
  }
  
  /**
   * Destroy all event of hammer.
   * @public
   */
  hammerDestroy() {
    this._unbindHammerEvents();
    this._unbindHammerLocalEvents();
  }

  /**
   * Initially bind hammer host and local events.
   */
  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this._bindHammerEvents();
    this.updateComplete.then(()=> {
      this._bindHammerLocalEvents();
    });
  }

  disconnectedCallback() {
    this.hammerDestroy();
    super.disconnectedCallback && super.disconnectedCallback();
  }

  /**
   * @param {*} hammerInstance - Passed hammer instance
   * @param {String} event  - Passed event name. eg. `'tap'`
   * @param {Function} handler - Passed event callback handler.
   * Bind single event of hammer.
   * @protected
   */
  _bindHammerSingleEvent(hammerInstance, event, handler) {
    hammerInstance.on(event, handler);
  }

  /**
   * @param {*} hammerInstance - Passed hammer instance
   * @param {String} event  - Passed event name. eg. `'tap'`
   * @param {Function} handler - Passed event callback handler.
   * Unbind single event of hammer.
   * @protected
   */
  _unbindHammerSingleEvent(hammerInstance, event, handler) {
    hammerInstance.off(event, handler);
  }

  /**
   * Bind host hammer events.
   * @protected
   */
  _bindHammerEvents() {
    let self = this;
    self._unbindHammerEvents();
    if (isEmpty(self.hammerEvents)) {
      return;
    }

    forEach(self.hammerEvents, (options, event) => {
      options = options || {};
      let hammerInstance = new Hammer(self);
      hammerInstance.get(event);
      let handler = (e) => {
        self.dispatchEvent(new CustomEvent(event, { detail: { event: e }, bubbles: false, composed: true }));
      }

      if (!self._hammerEventsHadlers[event]) {
        self._hammerEventsHadlers[event] = [];
      }

      self._bindHammerSingleEvent(hammerInstance, event, handler);
      self._hammerEventsHadlers[event].push({ hammerInstance, handler});
    });
  }

  /**
   * Unbind host hammer events.
   */
  _unbindHammerEvents() {
    let self = this;
    if (isEmpty(self._hammerEventsHadlers)) {
      return;
    }
    forEach(self._hammerEventsHadlers, (aHammerInstance, event) => {
      aHammerInstance = aHammerInstance || [];
      forEach(aHammerInstance, (value) => {
        let hammerInstance = value && value.hammerInstance;
        let handler = value && value.handler;
        if (handler && hammerInstance && event) {
          self._unbindHammerSingleEvent(hammerInstance, event, handler);
          hammerInstance.destroy && hammerInstance.destroy();
        }
      });
    });

    self._hammerEventsHadlers = {};
  }

  /**
   * Bind local hammer events.
   * @protected
   */
  _bindHammerLocalEvents() {
    let self = this;
    self._unbindHammerLocalEvents();
    if (isEmpty(self.hammerLocalEvents)) {
      return;
    }

    forEach(self.hammerLocalEvents, (value, event) => {
      let aElements = value.selectors || [];
      let options = value.options || {};
      forEach(aElements, (selector) => {
        let aSelectorElement = self.shadowRoot.querySelectorAll(selector) || self.querySelectorAll(selector) || [];
        forEach(aSelectorElement, (element) => {
          let hammerInstance = new Hammer(element, options);
          hammerInstance.get(event);
          let handler = (e) => {
            element.dispatchEvent(new CustomEvent(event, { detail: { event: e }, bubbles: false, composed: true }));
          }

          if (!self._hammerLocalEventsHandlers[event]) {
            self._hammerLocalEventsHandlers[event] = [];
          }

          self._bindHammerSingleEvent(hammerInstance, event, handler);
          self._hammerLocalEventsHandlers[event].push({ hammerInstance, handler });
        });
      });
    });
  }

  /**
   * unbind hammer local events.
   * @protected
   */
  _unbindHammerLocalEvents() {
    let self = this;
    if (isEmpty(self._hammerLocalEventsHandlers)) {
      return;
    }
    forEach(self._hammerLocalEventsHandlers, (aHammerInstance, event) => {
      aHammerInstance = aHammerInstance || [];
      forEach(aHammerInstance, (value) => {
        let hammerInstance = value && value.hammerInstance;
        let handler = value && value.handler;
        if (handler && hammerInstance && event) {
          self._unbindHammerSingleEvent(hammerInstance, event, handler);
          hammerInstance.destroy && hammerInstance.destroy();
        }
      });
    });

    self._hammerLocalEventsHandlers = {};
  }
};