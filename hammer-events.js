import Hammer from '@dremworld/hammerjs';
import isEmpty from 'lodash-es/isEmpty';
import isArray from 'lodash-es/isArray';
import forEach from 'lodash-es/forEach';
export const hammerEvents = (baseElement) => class extends baseElement {
  constructor() {
    super();
    this._hammerEventsHadlers = [];
    this._hammerLocalEventsHandlers = {}
    this._hammer = null;
  }

  static get properties() {
    return {

      /**
       * Host element hammer events are bind.
       * Passed event models
       * E.g: ['tap', 'swipe', 'press']
       */
      hammerEvents: {
        type: Array
      },

      /**
       * Local element hammer events are bind.
       * Passed event has(event as a key and value as a selectors).
       * e.g.: {'tap': ['.loading', '#container', 'paper-button']}
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
   */
  hammerdestroy() {
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
    this.hammerdestroy();
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
    if (!isArray(self.hammerEvents) || isEmpty(self.hammerEvents)) {
      return;
    }

    self._hammer = new Hammer(self);
    forEach(self.hammerEvents, (event) => {
      self._hammer.get(event);
      let handler = (e) => {
        self.dispatchEvent(new CustomEvent(event, { detail: { event: e }, bubbles: false, composed: true }));
      }

      if (!self._hammerEventsHadlers[event]) {
        self._hammerEventsHadlers[event] = [];
      }

      self._hammerEventsHadlers[event].push(handler);
      self._bindHammerSingleEvent(self._hammer, event, handler);
    });
  }

  /**
   * Unbind host hammer events.
   */
  _unbindHammerEvents() {
    let self = this;
    if (self._hammer) {
      forEach(self._hammerEventsHadlers, (aHandlers, event) => {
        aHandlers = aHandlers || [];
        forEach(aHandlers, (handler) => {
          self._unbindHammerSingleEvent(self._hammer, event, handler);
        });
      });
      self._hammer.destroy && self._hammer.destroy();
      self._hammer = null;
      self._hammerEventsHadlers = null;
    }
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

    forEach(self.hammerLocalEvents, (aElements, event) => {
      aElements = aElements || [];
      forEach(aElements, (selector) => {
        let aSelectorElement = self.shadowRoot.querySelectorAll(selector) || self.querySelectorAll(selector) || [];
        forEach(aSelectorElement, (element) => {
          let hammerInstance = new Hammer(element);
          hammerInstance.get(event);
          let handler = (e) => {
            element.dispatchEvent(new CustomEvent(event, { detail: { event: e }, bubbles: false, composed: true }));
          }

          if (!self._hammerLocalEventsHandlers[event]) {
            self._hammerLocalEventsHandlers[event] = [];
          }

          self._hammerLocalEventsHandlers[event].push({ hammerInstance: hammerInstance, handler: handler });

          self._bindHammerSingleEvent(hammerInstance, event, handler);
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

    self._hammerLocalEventsHandlers = null;
  }
};