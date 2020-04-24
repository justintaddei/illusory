(function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var BORDER_RADIUS_REGEX = /^(\d+(?:\.\d+)?)([^\d\s.]+)(?:\s+(\d+(?:\.\d+)?)([^\d\s.]+))?$/;
    function parseBorderRadius(borderRadius) {
        var _a, _b, _c, _d;
        var parsedBorderRadius = BORDER_RADIUS_REGEX.exec(borderRadius);
        var x;
        var y;
        x = {
            value: +((_a = parsedBorderRadius === null || parsedBorderRadius === void 0 ? void 0 : parsedBorderRadius[1]) !== null && _a !== void 0 ? _a : 0),
            unit: (_b = parsedBorderRadius === null || parsedBorderRadius === void 0 ? void 0 : parsedBorderRadius[2]) !== null && _b !== void 0 ? _b : 'px'
        };
        if (parsedBorderRadius === null || parsedBorderRadius === void 0 ? void 0 : parsedBorderRadius[3])
            y = {
                value: +((_c = parsedBorderRadius === null || parsedBorderRadius === void 0 ? void 0 : parsedBorderRadius[3]) !== null && _c !== void 0 ? _c : 0),
                unit: (_d = parsedBorderRadius === null || parsedBorderRadius === void 0 ? void 0 : parsedBorderRadius[4]) !== null && _d !== void 0 ? _d : 'px'
            };
        else
            y = __assign({}, x);
        return {
            x: x,
            y: y
        };
    }
    function stringifyBorderRadius(radii) {
        return "" + radii.x.value + radii.x.unit + " " + radii.y.value + radii.y.unit;
    }

    function borderRadiusHandler(delta, borderRadius) {
        var radii = parseBorderRadius(borderRadius);
        if (radii.x.unit !== '%')
            radii.x.value = radii.x.value * delta.inverseScaleX;
        if (radii.y.unit !== '%')
            radii.y.value = radii.y.value * delta.inverseScaleY;
        return stringifyBorderRadius(radii);
    }

    var DELTA_PASS_THROUGH_HANDLER = function (_, __, thisStyle) { return thisStyle; };
    function getDelta(from, to) {
        return {
            x: to.rect.left - from.rect.left,
            y: to.rect.top - from.rect.top,
            scaleX: to.rect.width / from.rect.width,
            scaleY: to.rect.height / from.rect.height,
            inverseScaleX: from.rect.width / to.rect.width,
            inverseScaleY: from.rect.height / to.rect.height
        };
    }

    function transformHandler(delta) {
        return "translate3d(" + delta.x + "px," + delta.y + "px, 0) scale(" + delta.scaleX + ", " + delta.scaleY + ")";
    }

    var DEFAULT_OPTIONS = {
        includeChildren: true,
        duration: '300ms',
        easing: 'ease',
        zIndex: 1,
        compositeOnly: false
    };

    var RGBA_REGEX = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([01](?:\.\d+)?)\)$/i;
    var isHex = function (hex) { return /^#([a-f0-9]{4}){1,2}$/i.test(hex); };
    var hexChunkSize = function (hex) { return Math.floor((hex.length - 1) / 3); };
    var seperateHex = function (hex) { return hex.match(new RegExp(".{" + hexChunkSize(hex) + "}", 'g')); };
    var hexToDec = function (hex) { return parseInt(hex.repeat(2 / hex.length), 16); };
    var getAlphaFloat = function (a) { return +(a / 256).toFixed(2); };
    var hexToRGBA = function (hexArr) {
        var _a = hexArr.map(hexToDec), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
        return [r, g, b, getAlphaFloat(a)];
    };
    function parseRGBA(color) {
        var _a, _b;
        var rgba = RGBA_REGEX.exec(color);
        var r;
        var g;
        var b;
        var a;
        if (rgba) {
            _a = rgba.slice(1, 5).map(parseFloat), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
        }
        else if (isHex(color)) {
            var hexArray = seperateHex(color.slice(1));
            if (!hexArray)
                return false;
            _b = hexToRGBA(hexArray), r = _b[0], g = _b[1], b = _b[2], a = _b[3];
        }
        else
            return false;
        return { r: r, g: g, b: b, a: a };
    }

    function toKebab(str) {
        return str
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase();
    }
    function cleanAttributes(element) {
        Object.keys(element.dataset).forEach(function (key) { return element.removeAttribute("data-" + toKebab(key)); });
        element.removeAttribute('class');
        element.removeAttribute('id');
    }
    function copyStyles(source, target) {
        var styles = window.getComputedStyle(source);
        if (styles.cssText !== '')
            target.style.cssText = styles.cssText;
        else {
            var mockCssText = '';
            for (var i = 0; i < styles.length; i++) {
                mockCssText += styles[i] + ": " + styles.getPropertyValue(styles[i]) + "; ";
            }
            target.style.cssText = mockCssText;
        }
    }
    function duplicateNode(node, includeChildren) {
        if (includeChildren === void 0) { includeChildren = false; }
        var clone = node.cloneNode(false);
        if (clone.nodeType === Node.ELEMENT_NODE) {
            if (includeChildren)
                node.childNodes.forEach(function (child) { return clone.appendChild(duplicateNode(child, true)); });
            copyStyles(node, clone);
            cleanAttributes(clone);
        }
        return clone;
    }

    function flushCSSUpdates(el1, el2) {
        el1.clone.offsetHeight;
        el2 === null || el2 === void 0 ? void 0 : el2.clone.offsetHeight;
    }

    function buildTransitionString(options) {
        if (options.compositeOnly)
            return "transform " + options.duration + " " + options.easing + " 0s, opacity " + options.duration + " " + options.easing + " 0s";
        else
            return "all " + options.duration + " " + options.easing + " 0s";
    }

    var IllusoryElement = (function () {
        function IllusoryElement(el, options) {
            var _a, _b;
            this.orignalStyle = {};
            this.deltaHandlers = {
                transform: transformHandler,
                borderTopLeftRadius: borderRadiusHandler,
                borderTopRightRadius: borderRadiusHandler,
                borderBottomRightRadius: borderRadiusHandler,
                borderBottomLeftRadius: borderRadiusHandler
            };
            if (options === null || options === void 0 ? void 0 : options.deltaHandlers) {
                for (var prop in options.deltaHandlers) {
                    var handler = options.deltaHandlers[prop];
                    this.deltaHandlers[prop] = typeof handler === 'function' ? handler : DELTA_PASS_THROUGH_HANDLER;
                }
            }
            this.natural = el;
            this.initalStyleAttributeValue = this.natural.getAttribute('style');
            this.rect = this.natural.getBoundingClientRect();
            console.log('constructor');
            this.clone = duplicateNode(this.natural, (_a = options === null || options === void 0 ? void 0 : options.includeChildren) !== null && _a !== void 0 ? _a : DEFAULT_OPTIONS.includeChildren);
            this.setStyle('zIndex', (_b = options === null || options === void 0 ? void 0 : options.zIndex) !== null && _b !== void 0 ? _b : DEFAULT_OPTIONS.zIndex);
            this.setStyle('opacity', '1');
            this.setStyle('left', 'auto');
            this.setStyle('right', 'auto');
            this.setStyle('top', 'auto');
            this.setStyle('bottom', 'auto');
            this.setStyle('margin', '0 0 0 0');
            this.setStyle('transformOrigin', '0 0');
            this.setStyle('transform', 'none');
            this.setStyle('transition', 'none');
            this.setStyle('animation', 'none');
            this.setStyle('pointerEvents', 'none');
            this.setStyle('position', 'fixed');
            this.setStyle('left', this.rect.left + "px");
            this.setStyle('top', this.rect.top + "px");
            this.setStyle('width', this.rect.width + "px");
            this.setStyle('height', this.rect.height + "px");
            this.natural.style.transition = 'none';
            this.natural.style.animation = 'none';
            console.log('this.clone :', this.clone);
        }
        IllusoryElement.prototype._hasTransparentBackground = function () {
            var rgba = parseRGBA(this.getStyle('backgroundColor'));
            if (!rgba)
                return false;
            return rgba.a !== 1;
        };
        IllusoryElement.prototype._to = function (element) {
            var _this = this;
            var delta = getDelta(this, element);
            Object.keys(this.deltaHandlers).forEach(function (key) {
                _this.setStyle(key, _this.deltaHandlers[key](delta, element.getStyle(key), _this.getStyle(key)));
            });
        };
        IllusoryElement.prototype._enableTransitions = function (options) {
            this.setStyle('transition', buildTransitionString(options));
        };
        IllusoryElement.prototype._disableTransitions = function () {
            this.setStyle('transition', 'none');
        };
        IllusoryElement.prototype._setParent = function (element) {
            this.hideNatural();
            element.appendChild(this.clone);
        };
        IllusoryElement.prototype.getStyle = function (property) {
            var _a;
            return (_a = this.orignalStyle[property]) !== null && _a !== void 0 ? _a : this.clone.style[property];
        };
        IllusoryElement.prototype.setStyle = function (property, value) {
            this.orignalStyle[property] = this.getStyle(property);
            this.clone.style[property] = value;
        };
        IllusoryElement.prototype.waitFor = function (property) {
            var _this = this;
            return new Promise(function (resolve) {
                var cb = function (e) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (property !== 'any' && e.propertyName !== property)
                                    return [2];
                                if (!(property === 'any')) return [3, 2];
                                return [4, new Promise(function (resolve) { return requestAnimationFrame(resolve); })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                this.clone.removeEventListener('transitionend', cb);
                                resolve();
                                return [2];
                        }
                    });
                }); };
                _this.clone.addEventListener('transitionend', cb);
            });
        };
        IllusoryElement.prototype.hide = function () {
            this.setStyle('opacity', '0');
        };
        IllusoryElement.prototype.show = function () {
            this.setStyle('opacity', '1');
        };
        IllusoryElement.prototype.hideNatural = function () {
            this.natural.style.opacity = '0';
        };
        IllusoryElement.prototype.showNatural = function () {
            this.natural.style.opacity = '1';
        };
        IllusoryElement.prototype.flushCSS = function () {
            flushCSSUpdates(this);
        };
        IllusoryElement.prototype.detach = function () {
            this.showNatural();
            this.flushCSS();
            if (!this.initalStyleAttributeValue)
                this.natural.removeAttribute('style');
            else
                this.natural.setAttribute('style', this.initalStyleAttributeValue);
            this.clone.remove();
        };
        return IllusoryElement;
    }());

    function createOpacityWrapper(startOpacity, options) {
        var wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.zIndex = options.zIndex.toString();
        wrapper.style.opacity = startOpacity;
        wrapper.style.transition = "opacity " + options.duration + " " + options.easing + " 0s";
        document.body.appendChild(wrapper);
        return wrapper;
    }

    (function (arr) {
        arr.forEach(function (item) {
            if (item.hasOwnProperty('remove')) {
                return;
            }
            Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                    if (this.parentNode === null) {
                        return;
                    }
                    this.parentNode.removeChild(this);
                }
            });
        });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    function createIllusoryElement(element, options) {
        return element instanceof IllusoryElement ? element : new IllusoryElement(element, options);
    }
    function illusory(from, to, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var completeOptions, nonCompositeProperties, _i, nonCompositeProperties_1, prop, start, end, startOpacity, endOpacity, needsWrapperElement, parent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        completeOptions = __assign(__assign({}, DEFAULT_OPTIONS), options);
                        console.log('illusory called');
                        if (completeOptions.compositeOnly) {
                            if (!completeOptions.deltaHandlers)
                                completeOptions.deltaHandlers = {};
                            nonCompositeProperties = [
                                'borderTopLeftRadius',
                                'borderTopRightRadius',
                                'borderBottomLeftRadius',
                                'borderBottomRightRadius'
                            ];
                            for (_i = 0, nonCompositeProperties_1 = nonCompositeProperties; _i < nonCompositeProperties_1.length; _i++) {
                                prop = nonCompositeProperties_1[_i];
                                if (!((_a = completeOptions.deltaHandlers) === null || _a === void 0 ? void 0 : _a[prop]))
                                    completeOptions.deltaHandlers[prop] = false;
                            }
                        }
                        console.log('before create element');
                        start = createIllusoryElement(from, completeOptions);
                        console.log('bwtween create element');
                        end = createIllusoryElement(to, completeOptions);
                        console.log('after create element');
                        startOpacity = start.getStyle('opacity');
                        endOpacity = end.getStyle('opacity');
                        needsWrapperElement = startOpacity !== '1' || endOpacity !== '1';
                        console.log('before create wrapper');
                        parent = needsWrapperElement ? createOpacityWrapper(startOpacity, completeOptions) : document.body;
                        console.log('beforeAttach');
                        if (!(typeof (options === null || options === void 0 ? void 0 : options.beforeAttach) === 'function')) return [3, 2];
                        return [4, Promise.resolve(options.beforeAttach(start, end))];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        console.log('before setParent');
                        start._setParent(parent);
                        end._setParent(parent);
                        end.hide();
                        end._to(start);
                        console.log('beforeAnimate');
                        if (!(typeof (options === null || options === void 0 ? void 0 : options.beforeAnimate) === 'function')) return [3, 4];
                        return [4, Promise.resolve(options.beforeAnimate(start, end))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        start._enableTransitions(completeOptions);
                        end._enableTransitions(completeOptions);
                        flushCSSUpdates(start, end);
                        start._to(end);
                        end._to(end);
                        if (end._hasTransparentBackground() || completeOptions.compositeOnly)
                            start.hide();
                        end.show();
                        if (needsWrapperElement)
                            parent.style.opacity = endOpacity;
                        console.log('before waitFor any');
                        return [4, end.waitFor('any')];
                    case 5:
                        _b.sent();
                        console.log('beforeDetach');
                        if (!(typeof (options === null || options === void 0 ? void 0 : options.beforeDetach) === 'function')) return [3, 7];
                        start._disableTransitions();
                        end._disableTransitions();
                        start.hide();
                        return [4, Promise.resolve(options.beforeDetach(start, end))];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        start.detach();
                        end.detach();
                        if (needsWrapperElement)
                            parent.remove();
                        return [2];
                }
            });
        });
    }

    exports.IllusoryElement = IllusoryElement;
    exports.illusory = illusory;

}(this.window = this.window || {}));
