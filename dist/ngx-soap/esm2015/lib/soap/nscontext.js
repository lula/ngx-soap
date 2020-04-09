/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
'use strict';
export class NamespaceScope {
    /**
     * @param {?} parent
     */
    constructor(parent) {
        this.getNamespaceURI = function (prefix, localOnly) {
            switch (prefix) {
                case 'xml':
                    return 'http://www.w3.org/XML/1998/namespace';
                case 'xmlns':
                    return 'http://www.w3.org/2000/xmlns/';
                default:
                    /** @type {?} */
                    var nsUri = this.namespaces[prefix];
                    /*jshint -W116 */
                    if (nsUri != null) {
                        return nsUri.uri;
                    }
                    else if (!localOnly && this.parent) {
                        return this.parent.getNamespaceURI(prefix);
                    }
                    else {
                        return null;
                    }
            }
        };
        this.getNamespaceMapping = function (prefix) {
            switch (prefix) {
                case 'xml':
                    return {
                        uri: 'http://www.w3.org/XML/1998/namespace',
                        prefix: 'xml',
                        declared: true
                    };
                case 'xmlns':
                    return {
                        uri: 'http://www.w3.org/2000/xmlns/',
                        prefix: 'xmlns',
                        declared: true
                    };
                default:
                    /** @type {?} */
                    var mapping = this.namespaces[prefix];
                    /*jshint -W116 */
                    if (mapping != null) {
                        return mapping;
                    }
                    else if (this.parent) {
                        return this.parent.getNamespaceMapping(prefix);
                    }
                    else {
                        return null;
                    }
            }
        };
        this.getPrefix = function (nsUri, localOnly) {
            switch (nsUri) {
                case 'http://www.w3.org/XML/1998/namespace':
                    return 'xml';
                case 'http://www.w3.org/2000/xmlns/':
                    return 'xmlns';
                default:
                    for (var p in this.namespaces) {
                        if (this.namespaces[p].uri === nsUri) {
                            return p;
                        }
                    }
                    if (!localOnly && this.parent) {
                        return this.parent.getPrefix(nsUri);
                    }
                    else {
                        return null;
                    }
            }
        };
        if (!(this instanceof NamespaceScope)) {
            return new NamespaceScope(parent);
        }
        this.parent = parent;
        this.namespaces = {};
    }
}
if (false) {
    /** @type {?} */
    NamespaceScope.prototype.parent;
    /** @type {?} */
    NamespaceScope.prototype.namespaces;
    /** @type {?} */
    NamespaceScope.prototype.getNamespaceURI;
    /** @type {?} */
    NamespaceScope.prototype.getNamespaceMapping;
    /** @type {?} */
    NamespaceScope.prototype.getPrefix;
}
export class NamespaceContext {
    constructor() {
        this.addNamespace = function (prefix, nsUri, localOnly) {
            if (this.getNamespaceURI(prefix, localOnly) === nsUri) {
                return false;
            }
            if (this.currentScope) {
                this.currentScope.namespaces[prefix] = {
                    uri: nsUri,
                    prefix: prefix,
                    declared: false
                };
                return true;
            }
            return false;
        };
        this.pushContext = function () {
            /** @type {?} */
            var scope = new NamespaceScope(this.currentScope);
            this.scopes.push(scope);
            this.currentScope = scope;
            return scope;
        };
        this.popContext = function () {
            /** @type {?} */
            var scope = this.scopes.pop();
            if (scope) {
                this.currentScope = scope.parent;
            }
            else {
                this.currentScope = null;
            }
            return scope;
        };
        this.getNamespaceURI = function (prefix, localOnly) {
            return this.currentScope && this.currentScope.getNamespaceURI(prefix, localOnly);
        };
        this.getPrefix = function (nsUri, localOnly) {
            return this.currentScope && this.currentScope.getPrefix(nsUri, localOnly);
        };
        this.registerNamespace = function (nsUri) {
            /** @type {?} */
            var prefix = this.getPrefix(nsUri);
            if (prefix) {
                // If the namespace has already mapped to a prefix
                return prefix;
            }
            else {
                // Try to generate a unique namespace
                while (true) {
                    prefix = 'ns' + (++this.prefixCount);
                    if (!this.getNamespaceURI(prefix)) {
                        // The prefix is not used
                        break;
                    }
                }
            }
            this.addNamespace(prefix, nsUri, true);
            return prefix;
        };
        this.declareNamespace = function (prefix, nsUri) {
            if (this.currentScope) {
                /** @type {?} */
                var mapping = this.currentScope.getNamespaceMapping(prefix);
                if (mapping && mapping.uri === nsUri && mapping.declared) {
                    return false;
                }
                this.currentScope.namespaces[prefix] = {
                    uri: nsUri,
                    prefix: prefix,
                    declared: true
                };
                return true;
            }
            return false;
        };
        if (!(this instanceof NamespaceContext)) {
            return new NamespaceContext();
        }
        this.scopes = [];
        this.pushContext();
        this.prefixCount = 0;
    }
}
if (false) {
    /** @type {?} */
    NamespaceContext.prototype.scopes;
    /** @type {?} */
    NamespaceContext.prototype.prefixCount;
    /** @type {?} */
    NamespaceContext.prototype.addNamespace;
    /** @type {?} */
    NamespaceContext.prototype.pushContext;
    /** @type {?} */
    NamespaceContext.prototype.popContext;
    /** @type {?} */
    NamespaceContext.prototype.getNamespaceURI;
    /** @type {?} */
    NamespaceContext.prototype.getPrefix;
    /** @type {?} */
    NamespaceContext.prototype.registerNamespace;
    /** @type {?} */
    NamespaceContext.prototype.declareNamespace;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnNjb250ZXh0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9uc2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQztBQUViLE1BQU0sT0FBTyxjQUFjOzs7O0lBR3pCLFlBQVksTUFBVztRQVF2QixvQkFBZSxHQUFHLFVBQVMsTUFBTSxFQUFFLFNBQVM7WUFDMUMsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLE9BQU8sc0NBQXNDLENBQUM7Z0JBQ2hELEtBQUssT0FBTztvQkFDVixPQUFPLCtCQUErQixDQUFDO2dCQUN6Qzs7d0JBQ00sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO29CQUNuQyxpQkFBaUI7b0JBQ2pCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTt3QkFDakIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDO3FCQUNsQjt5QkFBTSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ3BDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQzVDO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2FBQ0o7UUFDSCxDQUFDLENBQUE7UUFFRCx3QkFBbUIsR0FBRyxVQUFTLE1BQU07WUFDbkMsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLE9BQU87d0JBQ0wsR0FBRyxFQUFFLHNDQUFzQzt3QkFDM0MsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztnQkFDSixLQUFLLE9BQU87b0JBQ1YsT0FBTzt3QkFDTCxHQUFHLEVBQUUsK0JBQStCO3dCQUNwQyxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUUsSUFBSTtxQkFDZixDQUFDO2dCQUNKOzt3QkFDTSxPQUFPLEdBQUcs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LFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUc7b0JBQ3JDLEdBQUcsRUFBRSxLQUFLO29CQUNWLE1BQU0sRUFBRSxNQUFNO29CQUNkLFFBQVEsRUFBRSxJQUFJO2lCQUNmLENBQUM7Z0JBQ0YsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBakZDLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0E0RUY7OztJQXRGQyxrQ0FBYzs7SUFDZCx1Q0FBb0I7O0lBV3BCLHdDQWFDOztJQUVELHVDQUtDOztJQUVELHNDQVFDOztJQUVELDJDQUVDOztJQUVELHFDQUVDOztJQUVELDZDQWlCQzs7SUFFRCw0Q0FjQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VTY29wZSB7XHJcbiAgcGFyZW50OiBhbnk7XHJcbiAgbmFtZXNwYWNlczogYW55O1xyXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogYW55KSB7XHJcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlU2NvcGUpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgTmFtZXNwYWNlU2NvcGUocGFyZW50KTtcclxuICAgIH1cclxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgdGhpcy5uYW1lc3BhY2VzID0ge307ICBcclxuICB9XHJcblxyXG4gIGdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XHJcbiAgICBzd2l0Y2ggKHByZWZpeCkge1xyXG4gICAgICBjYXNlICd4bWwnOlxyXG4gICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcclxuICAgICAgY2FzZSAneG1sbnMnOlxyXG4gICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHZhciBuc1VyaSA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xyXG4gICAgICAgIC8qanNoaW50IC1XMTE2ICovXHJcbiAgICAgICAgaWYgKG5zVXJpICE9IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiBuc1VyaS51cmk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghbG9jYWxPbmx5ICYmIHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldE5hbWVzcGFjZU1hcHBpbmcgPSBmdW5jdGlvbihwcmVmaXgpIHtcclxuICAgIHN3aXRjaCAocHJlZml4KSB7XHJcbiAgICAgIGNhc2UgJ3htbCc6XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZScsXHJcbiAgICAgICAgICBwcmVmaXg6ICd4bWwnLFxyXG4gICAgICAgICAgZGVjbGFyZWQ6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICBjYXNlICd4bWxucyc6XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyxcclxuICAgICAgICAgIHByZWZpeDogJ3htbG5zJyxcclxuICAgICAgICAgIGRlY2xhcmVkOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB2YXIgbWFwcGluZyA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xyXG4gICAgICAgIC8qanNoaW50IC1XMTE2ICovXHJcbiAgICAgICAgaWYgKG1hcHBpbmcgIT0gbnVsbCkge1xyXG4gICAgICAgICAgcmV0dXJuIG1hcHBpbmc7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UHJlZml4ID0gZnVuY3Rpb24obnNVcmksIGxvY2FsT25seSkge1xyXG4gICAgc3dpdGNoIChuc1VyaSkge1xyXG4gICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnOlxyXG4gICAgICAgIHJldHVybiAneG1sJztcclxuICAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nOlxyXG4gICAgICAgIHJldHVybiAneG1sbnMnO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGZvciAodmFyIHAgaW4gdGhpcy5uYW1lc3BhY2VzKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5uYW1lc3BhY2VzW3BdLnVyaSA9PT0gbnNVcmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbG9jYWxPbmx5ICYmIHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0UHJlZml4KG5zVXJpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZUNvbnRleHQge1xyXG4gIHNjb3BlczogYW55W107XHJcbiAgcHJlZml4Q291bnQ6IG51bWJlcjsgXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZUNvbnRleHQpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgTmFtZXNwYWNlQ29udGV4dCgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zY29wZXMgPSBbXTtcclxuICAgIHRoaXMucHVzaENvbnRleHQoKTtcclxuICAgIHRoaXMucHJlZml4Q291bnQgPSAwO1xyXG4gIH1cclxuXHJcbiAgYWRkTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSwgbG9jYWxPbmx5KSB7XHJcbiAgICBpZiAodGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4LCBsb2NhbE9ubHkpID09PSBuc1VyaSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jdXJyZW50U2NvcGUpIHtcclxuICAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xyXG4gICAgICAgIHVyaTogbnNVcmksXHJcbiAgICAgICAgcHJlZml4OiBwcmVmaXgsXHJcbiAgICAgICAgZGVjbGFyZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHVzaENvbnRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzY29wZSA9IG5ldyBOYW1lc3BhY2VTY29wZSh0aGlzLmN1cnJlbnRTY29wZSk7XHJcbiAgICB0aGlzLnNjb3Blcy5wdXNoKHNjb3BlKTtcclxuICAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGU7XHJcbiAgICByZXR1cm4gc2NvcGU7XHJcbiAgfVxyXG5cclxuICBwb3BDb250ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2NvcGUgPSB0aGlzLnNjb3Blcy5wb3AoKTtcclxuICAgIGlmIChzY29wZSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlLnBhcmVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFNjb3BlID0gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzY29wZTtcclxuICB9XHJcblxyXG4gIGdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KTtcclxuICB9XHJcblxyXG4gIGdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY29wZSAmJiB0aGlzLmN1cnJlbnRTY29wZS5nZXRQcmVmaXgobnNVcmksIGxvY2FsT25seSk7XHJcbiAgfVxyXG4gIFxyXG4gIHJlZ2lzdGVyTmFtZXNwYWNlID0gZnVuY3Rpb24obnNVcmkpIHtcclxuICAgIHZhciBwcmVmaXggPSB0aGlzLmdldFByZWZpeChuc1VyaSk7XHJcbiAgICBpZiAocHJlZml4KSB7XHJcbiAgICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaGFzIGFscmVhZHkgbWFwcGVkIHRvIGEgcHJlZml4XHJcbiAgICAgIHJldHVybiBwcmVmaXg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUcnkgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgbmFtZXNwYWNlXHJcbiAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcHJlZml4ID0gJ25zJyArICgrK3RoaXMucHJlZml4Q291bnQpO1xyXG4gICAgICAgIGlmICghdGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4KSkge1xyXG4gICAgICAgICAgLy8gVGhlIHByZWZpeCBpcyBub3QgdXNlZFxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmFkZE5hbWVzcGFjZShwcmVmaXgsIG5zVXJpLCB0cnVlKTtcclxuICAgIHJldHVybiBwcmVmaXg7XHJcbiAgfVxyXG5cclxuICBkZWNsYXJlTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSkge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XHJcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlTWFwcGluZyhwcmVmaXgpO1xyXG4gICAgICBpZiAobWFwcGluZyAmJiBtYXBwaW5nLnVyaSA9PT0gbnNVcmkgJiYgbWFwcGluZy5kZWNsYXJlZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XHJcbiAgICAgICAgdXJpOiBuc1VyaSxcclxuICAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuICAgICAgICBkZWNsYXJlZDogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTY29wZSBmb3IgWE1MIG5hbWVzcGFjZXNcclxuICogQHBhcmFtIFtwYXJlbnRdIFBhcmVudCBzY29wZVxyXG4gKiBcclxuICovXHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBOYW1lc3BhY2VTY29wZShwYXJlbnQpIHtcclxuLy8gICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlU2NvcGUpKSB7XHJcbi8vICAgICByZXR1cm4gTmFtZXNwYWNlU2NvcGUocGFyZW50KTtcclxuLy8gICB9XHJcbi8vICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbi8vICAgdGhpcy5uYW1lc3BhY2VzID0ge307XHJcbi8vIH1cclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBOYW1lc3BhY2UgY29udGV4dCB0aGF0IG1hbmFnZXMgaGllcmFyY2hpY2FsIHNjb3Blc1xyXG4vLyAgKiAge05hbWVzcGFjZUNvbnRleHR9XHJcbi8vICAqL1xyXG4vLyBleHBvcnQgZnVuY3Rpb24gTmFtZXNwYWNlQ29udGV4dCgpIHtcclxuLy8gICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlQ29udGV4dCkpIHtcclxuLy8gICAgIHJldHVybiBOYW1lc3BhY2VDb250ZXh0KCk7XHJcbi8vICAgfVxyXG4vLyAgIHRoaXMuc2NvcGVzID0gW107XHJcbi8vICAgdGhpcy5wdXNoQ29udGV4dCgpO1xyXG4vLyAgIHRoaXMucHJlZml4Q291bnQgPSAwO1xyXG4vLyB9XHJcblxyXG4vLyAvKipcclxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIFVSSSBieSBwcmVmaXhcclxuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxyXG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcclxuLy8gICogICBOYW1lc3BhY2UgVVJJXHJcbi8vICAqL1xyXG4vLyBOYW1lc3BhY2VTY29wZS5wcm90b3R5cGUuZ2V0TmFtZXNwYWNlVVJJID0gZnVuY3Rpb24ocHJlZml4LCBsb2NhbE9ubHkpIHtcclxuLy8gICBzd2l0Y2ggKHByZWZpeCkge1xyXG4vLyAgICAgY2FzZSAneG1sJzpcclxuLy8gICAgICAgcmV0dXJuICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xyXG4vLyAgICAgY2FzZSAneG1sbnMnOlxyXG4vLyAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJztcclxuLy8gICAgIGRlZmF1bHQ6XHJcbi8vICAgICAgIHZhciBuc1VyaSA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xyXG4vLyAgICAgICAvKmpzaGludCAtVzExNiAqL1xyXG4vLyAgICAgICBpZiAobnNVcmkgIT0gbnVsbCkge1xyXG4vLyAgICAgICAgIHJldHVybiBuc1VyaS51cmk7XHJcbi8vICAgICAgIH0gZWxzZSBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VVUkkocHJlZml4KTtcclxuLy8gICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICByZXR1cm4gbnVsbDtcclxuLy8gICAgICAgfVxyXG4vLyAgIH1cclxuLy8gfTtcclxuXHJcbi8vIE5hbWVzcGFjZVNjb3BlLnByb3RvdHlwZS5nZXROYW1lc3BhY2VNYXBwaW5nID0gZnVuY3Rpb24ocHJlZml4KSB7XHJcbi8vICAgc3dpdGNoIChwcmVmaXgpIHtcclxuLy8gICAgIGNhc2UgJ3htbCc6XHJcbi8vICAgICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgdXJpOiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJyxcclxuLy8gICAgICAgICBwcmVmaXg6ICd4bWwnLFxyXG4vLyAgICAgICAgIGRlY2xhcmVkOiB0cnVlXHJcbi8vICAgICAgIH07XHJcbi8vICAgICBjYXNlICd4bWxucyc6XHJcbi8vICAgICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgdXJpOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nLFxyXG4vLyAgICAgICAgIHByZWZpeDogJ3htbG5zJyxcclxuLy8gICAgICAgICBkZWNsYXJlZDogdHJ1ZVxyXG4vLyAgICAgICB9O1xyXG4vLyAgICAgZGVmYXVsdDpcclxuLy8gICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcclxuLy8gICAgICAgLypqc2hpbnQgLVcxMTYgKi9cclxuLy8gICAgICAgaWYgKG1hcHBpbmcgIT0gbnVsbCkge1xyXG4vLyAgICAgICAgIHJldHVybiBtYXBwaW5nO1xyXG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50KSB7XHJcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcclxuLy8gICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICByZXR1cm4gbnVsbDtcclxuLy8gICAgICAgfVxyXG4vLyAgIH1cclxuLy8gfTtcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBMb29rIHVwIHRoZSBuYW1lc3BhY2UgcHJlZml4IGJ5IFVSSVxyXG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcclxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XHJcbi8vICAqICAgTmFtZXNwYWNlIHByZWZpeFxyXG4vLyAgKi9cclxuLy8gTmFtZXNwYWNlU2NvcGUucHJvdG90eXBlLmdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcclxuLy8gICBzd2l0Y2ggKG5zVXJpKSB7XHJcbi8vICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnOlxyXG4vLyAgICAgICByZXR1cm4gJ3htbCc7XHJcbi8vICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc6XHJcbi8vICAgICAgIHJldHVybiAneG1sbnMnO1xyXG4vLyAgICAgZGVmYXVsdDpcclxuLy8gICAgICAgZm9yICh2YXIgcCBpbiB0aGlzLm5hbWVzcGFjZXMpIHtcclxuLy8gICAgICAgICBpZiAodGhpcy5uYW1lc3BhY2VzW3BdLnVyaSA9PT0gbnNVcmkpIHtcclxuLy8gICAgICAgICAgIHJldHVybiBwO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfVxyXG4vLyAgICAgICBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRQcmVmaXgobnNVcmkpO1xyXG4vLyAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgIHJldHVybiBudWxsO1xyXG4vLyAgICAgICB9XHJcbi8vICAgfVxyXG4vLyB9O1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIEFkZCBhIHByZWZpeC9VUkkgbmFtZXNwYWNlIG1hcHBpbmdcclxuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxyXG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcclxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XHJcbi8vICAqICB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgbWFwcGluZyBpcyBhZGRlZCBvciBmYWxzZSBpZiB0aGUgbWFwcGluZ1xyXG4vLyAgKiBhbHJlYWR5IGV4aXN0c1xyXG4vLyAgKi9cclxuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUuYWRkTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSwgbG9jYWxPbmx5KSB7XHJcbi8vICAgaWYgKHRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KSA9PT0gbnNVcmkpIHtcclxuLy8gICAgIHJldHVybiBmYWxzZTtcclxuLy8gICB9XHJcbi8vICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XHJcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XHJcbi8vICAgICAgIHVyaTogbnNVcmksXHJcbi8vICAgICAgIHByZWZpeDogcHJlZml4LFxyXG4vLyAgICAgICBkZWNsYXJlZDogZmFsc2VcclxuLy8gICAgIH07XHJcbi8vICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICB9XHJcbi8vICAgcmV0dXJuIGZhbHNlO1xyXG4vLyB9O1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFB1c2ggYSBzY29wZSBpbnRvIHRoZSBjb250ZXh0XHJcbi8vICAqICBUaGUgY3VycmVudCBzY29wZVxyXG4vLyAgKi9cclxuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUucHVzaENvbnRleHQgPSBmdW5jdGlvbigpIHtcclxuLy8gICB2YXIgc2NvcGUgPSBOYW1lc3BhY2VTY29wZSh0aGlzLmN1cnJlbnRTY29wZSk7XHJcbi8vICAgdGhpcy5zY29wZXMucHVzaChzY29wZSk7XHJcbi8vICAgdGhpcy5jdXJyZW50U2NvcGUgPSBzY29wZTtcclxuLy8gICByZXR1cm4gc2NvcGU7XHJcbi8vIH07XHJcblxyXG4vLyAvKipcclxuLy8gICogUG9wIGEgc2NvcGUgb3V0IG9mIHRoZSBjb250ZXh0XHJcbi8vICAqICAgVGhlIHJlbW92ZWQgc2NvcGVcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLnBvcENvbnRleHQgPSBmdW5jdGlvbigpIHtcclxuLy8gICB2YXIgc2NvcGUgPSB0aGlzLnNjb3Blcy5wb3AoKTtcclxuLy8gICBpZiAoc2NvcGUpIHtcclxuLy8gICAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGUucGFyZW50O1xyXG4vLyAgIH0gZWxzZSB7XHJcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IG51bGw7XHJcbi8vICAgfVxyXG4vLyAgIHJldHVybiBzY29wZTtcclxuLy8gfTtcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBMb29rIHVwIHRoZSBuYW1lc3BhY2UgVVJJIGJ5IHByZWZpeFxyXG4vLyAgKiBAcGFyYW0gIHByZWZpeCBOYW1lc3BhY2UgcHJlZml4XHJcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxyXG4vLyAgKiAgIE5hbWVzcGFjZSBVUklcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XHJcbi8vICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSk7XHJcbi8vIH07XHJcblxyXG4vLyAvKipcclxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIHByZWZpeCBieSBVUklcclxuLy8gICogQHBhcmFtICBuc1VSSSBOYW1lc3BhY2UgVVJJXHJcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxyXG4vLyAgKiAgIE5hbWVzcGFjZSBwcmVmaXhcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcclxuLy8gICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0UHJlZml4KG5zVXJpLCBsb2NhbE9ubHkpO1xyXG4vLyB9O1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFJlZ2lzdGVyIGEgbmFtZXNwYWNlXHJcbi8vICAqIEBwYXJhbSAgbnNVcmkgTmFtZXNwYWNlIFVSSVxyXG4vLyAgKiAgIFRoZSBtYXRjaGluZyBvciBnZW5lcmF0ZWQgbmFtZXNwYWNlIHByZWZpeFxyXG4vLyAgKi9cclxuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUucmVnaXN0ZXJOYW1lc3BhY2UgPSBmdW5jdGlvbihuc1VyaSkge1xyXG4vLyAgIHZhciBwcmVmaXggPSB0aGlzLmdldFByZWZpeChuc1VyaSk7XHJcbi8vICAgaWYgKHByZWZpeCkge1xyXG4vLyAgICAgLy8gSWYgdGhlIG5hbWVzcGFjZSBoYXMgYWxyZWFkeSBtYXBwZWQgdG8gYSBwcmVmaXhcclxuLy8gICAgIHJldHVybiBwcmVmaXg7XHJcbi8vICAgfSBlbHNlIHtcclxuLy8gICAgIC8vIFRyeSB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBuYW1lc3BhY2VcclxuLy8gICAgIHdoaWxlICh0cnVlKSB7XHJcbi8vICAgICAgIHByZWZpeCA9ICducycgKyAoKyt0aGlzLnByZWZpeENvdW50KTtcclxuLy8gICAgICAgaWYgKCF0aGlzLmdldE5hbWVzcGFjZVVSSShwcmVmaXgpKSB7XHJcbi8vICAgICAgICAgLy8gVGhlIHByZWZpeCBpcyBub3QgdXNlZFxyXG4vLyAgICAgICAgIGJyZWFrO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vICAgfVxyXG4vLyAgIHRoaXMuYWRkTmFtZXNwYWNlKHByZWZpeCwgbnNVcmksIHRydWUpO1xyXG4vLyAgIHJldHVybiBwcmVmaXg7XHJcbi8vIH07XHJcblxyXG4vLyAvKipcclxuLy8gICogRGVjbGFyZSBhIG5hbWVzcGFjZSBwcmVmaXgvdXJpIG1hcHBpbmdcclxuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxyXG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcclxuLy8gICogICB0cnVlIGlmIHRoZSBkZWNsYXJhdGlvbiBpcyBjcmVhdGVkXHJcbi8vICAqL1xyXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5kZWNsYXJlTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSkge1xyXG4vLyAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xyXG4vLyAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLmN1cnJlbnRTY29wZS5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XHJcbi8vICAgICBpZiAobWFwcGluZyAmJiBtYXBwaW5nLnVyaSA9PT0gbnNVcmkgJiYgbWFwcGluZy5kZWNsYXJlZCkge1xyXG4vLyAgICAgICByZXR1cm4gZmFsc2U7XHJcbi8vICAgICB9XHJcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XHJcbi8vICAgICAgIHVyaTogbnNVcmksXHJcbi8vICAgICAgIHByZWZpeDogcHJlZml4LFxyXG4vLyAgICAgICBkZWNsYXJlZDogdHJ1ZVxyXG4vLyAgICAgfTtcclxuLy8gICAgIHJldHVybiB0cnVlO1xyXG4vLyAgIH1cclxuLy8gICByZXR1cm4gZmFsc2U7XHJcbi8vIH07XHJcbiJdfQ==