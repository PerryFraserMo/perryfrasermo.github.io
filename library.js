eventListeners = {};
[HTMLDocument, Document, HTMLElement].forEach(
	(cls) => {
		if (typeof cls === 'undefined') return;

		Object.defineProperty(
			cls.prototype,
			'getElement',
			{
				'value': function(tagValue) {
					return this.querySelector(tagValue);
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'getElements',
			{
				'value': function(tagValue) {
					return Array.from(this.querySelectorAll(tagValue));
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'addEventListeners',
			{
				'value': function(events, fn, opts) {
          var elementEvents = eventListeners[this] || { };
          events
            .split(' ')
            .forEach((key) => {
              var elementListenerEvents = elementEvents[key] || [ ];
              this.addEventListener(key, fn, opts);
              elementListenerEvents.push(fn);
              elementEvents[key] = elementListenerEvents;
            });

          eventListeners[this] = elementEvents;

          return this;
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'removeEventListeners',
			{
				'value': function(events) {
          var elementEvents = eventListeners[this] || { };
          events
            .split(' ')
            .forEach((key) => {
              var elementListenerEvents = elementEvents[key] || [ ];

              elementListenerEvents.forEach((callback) => {
                this.removeEventListener(key, callback);
              });

              eventListeners[key] = [];
            });

          return this;
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'remove',
			{
				'value': function(attributeKey) {
					if (this.parentNode) this.parentNode.removeChild(this);

          			return this;
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'empty',
			{
				'value': function(attributeKey) {
          while (this.firstChild) this.removeChild(this.firstChild);

          return this;
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'clone',
			{
				'value': function(deep=true) {
          return this.cloneNode(deep);
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'offset',
			{
				'value': function() {
          return this.getBoundingClientRect();
				},
				'enumerable': false
			});


		Object.defineProperty(
			cls.prototype,
			'toggleAttribute',
			{
				'value': function(attributeKey) {
          var attributeState = this.getAttribute(attributeKey);

          this.setAttribute(attributeKey, !attributeState);

          return this;
				},
				'enumerable': false
			});

		Object.defineProperty(
			cls.prototype,
			'velocity',
			{
				'value': function(properties, options) {
					return animate(this, properties, options);
				},
				'enumerable': false
			});


		Object.defineProperty(
			cls.prototype,
			'onPan',
			{
				'value': function(options) {
					this.addEventListeners('mousedown touchstart dragstart', function(e) {
						var windowEle = document;
						var bodyEle = document.body;
						var handleEle = this;

						if (options['onStart']) {
							var returnValue = options['onStart'].call(handleEle, e);
							
							if (!returnValue) {
								return;
							}
						}
						e.preventDefault();

						handleEle.classList.add('isPanning');

						var handleRemoval = function() {
							windowEle.removeEventListeners('mousemove touchmove');
							windowEle.removeEventListeners('mouseup touchend');

							window.requestAnimationFrame(() => {
								bodyEle.classList.remove('isPanning');							
							});

							bodyEle.style['-webkit-touch-callout'] = '';
							bodyEle.style['user-select'] = '';

							handleEle.classList.remove('isPanning');
						};

            bodyEle.style['-webkit-touch-callout'] = 'none';
            bodyEle.style['user-select'] = 'none';

						var originTime = Date.now();

						var originClientX = e.clientX;
						var originClientY = e.clientY;

						windowEle.addEventListeners('mousemove touchmove', function(e) {
							var timeDif = Date.now() - originTime;

							var touch = (e.touches && e.touches[0]) || {};

							var currentClientX = e.clientX || touch.clientX;
							var currentClientY = e.clientY || touch.clientY;

							e['ox'] = originClientX;
							e['oy'] = originClientY;

							e['x'] = currentClientX;
							e['y'] = currentClientY;

							e['dx'] = currentClientX - originClientX;
							e['dy'] = currentClientY - originClientY;

							if ((timeDif > 100) || (Math.abs(e['dx']) > 5) || (Math.abs(e['dy']) > 5)) {
								bodyEle.classList.add('isDragging');
							}

							if (options['onMove']) {
								var returnValue = options['onMove'].call(handleEle, e);
								
								if (!returnValue) {
									if (options['onEnd']) options['onEnd'].call(handleEle, e);

									handleRemoval();
								}
							}

							e.preventDefault();
							return false;
						}, {passive: false});

						windowEle.addEventListeners('mouseup touchend', function(e) {
							if (options['onEnd']) options['onEnd'].call(handleEle, e);

							handleRemoval();
							
							e.preventDefault();
						}, {passive: false});
						
						return false;
					}, {passive: false});

          return this;
				},
				'enumerable': false
			});
  });