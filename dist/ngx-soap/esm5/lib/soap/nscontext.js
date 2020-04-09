/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
'use strict';
var NamespaceScope = /** @class */ (function () {
    function NamespaceScope(parent) {
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
    return NamespaceScope;
}());
export { NamespaceScope };
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
var NamespaceContext = /** @class */ (function () {
    function NamespaceContext() {
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
    return NamespaceContext;
}());
export { NamespaceContext };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnNjb250ZXh0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9uc2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQztBQUViO0lBR0Usd0JBQVksTUFBVztRQVF2QixvQkFBZSxHQUFHLFVBQVMsTUFBTSxFQUFFLFNBQVM7WUFDMUMsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLE9BQU8sc0NBQXNDLENBQUM7Z0JBQ2hELEtBQUssT0FBTztvQkFDVixPQUFPLCtCQUErQixDQUFDO2dCQUN6Qzs7d0JBQ00sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO29CQUNuQyxpQkFBaUI7b0JBQ2pCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTt3QkFDakIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDO3FCQUNsQjt5QkFBTSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ3BDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQzVDO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2FBQ0o7UUFDSCxDQUFDLENBQUE7UUFFRCx3QkFBbUIsR0FBRyxVQUFTLE1BQU07WUFDbkMsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLE9BQU87d0JBQ0wsR0FBRyxFQUFFLHNDQUFzQzt3QkFDM0MsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztnQkFDSixLQUFLLE9BQU87b0JBQ1YsT0FBTzt3QkFDTCxHQUFHLEVBQUUsK0JBQStCO3dCQUNwQyxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUUsSUFBSTtxQkFDZixDQUFDO2dCQUNKOzt3QkFDTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FB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QUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDckMsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsTUFBTSxFQUFFLE1BQU07b0JBQ2QsUUFBUSxFQUFFLElBQUk7aUJBQ2YsQ0FBQztnQkFDRixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUE7UUFqRkMsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLGdCQUFnQixDQUFDLEVBQUU7WUFDdkMsT0FBTyxJQUFJLGdCQUFnQixFQUFFLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQTRFSCx1QkFBQztBQUFELENBQUMsQUF2RkQsSUF1RkM7Ozs7SUF0RkMsa0NBQWM7O0lBQ2QsdUNBQW9COztJQVdwQix3Q0FhQzs7SUFFRCx1Q0FLQzs7SUFFRCxzQ0FRQzs7SUFFRCwyQ0FFQzs7SUFFRCxxQ0FFQzs7SUFFRCw2Q0FpQkM7O0lBRUQsNENBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlU2NvcGUge1xyXG4gIHBhcmVudDogYW55O1xyXG4gIG5hbWVzcGFjZXM6IGFueTtcclxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGFueSkge1xyXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZVNjb3BlKSkge1xyXG4gICAgICByZXR1cm4gbmV3IE5hbWVzcGFjZVNjb3BlKHBhcmVudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgIHRoaXMubmFtZXNwYWNlcyA9IHt9OyAgXHJcbiAgfVxyXG5cclxuICBnZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xyXG4gICAgc3dpdGNoIChwcmVmaXgpIHtcclxuICAgICAgY2FzZSAneG1sJzpcclxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XHJcbiAgICAgIGNhc2UgJ3htbG5zJzpcclxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB2YXIgbnNVcmkgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcclxuICAgICAgICAvKmpzaGludCAtVzExNiAqL1xyXG4gICAgICAgIGlmIChuc1VyaSAhPSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnNVcmkudXJpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZVVSSShwcmVmaXgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXROYW1lc3BhY2VNYXBwaW5nID0gZnVuY3Rpb24ocHJlZml4KSB7XHJcbiAgICBzd2l0Y2ggKHByZWZpeCkge1xyXG4gICAgICBjYXNlICd4bWwnOlxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB1cmk6ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnLFxyXG4gICAgICAgICAgcHJlZml4OiAneG1sJyxcclxuICAgICAgICAgIGRlY2xhcmVkOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgY2FzZSAneG1sbnMnOlxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB1cmk6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycsXHJcbiAgICAgICAgICBwcmVmaXg6ICd4bWxucycsXHJcbiAgICAgICAgICBkZWNsYXJlZDogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcclxuICAgICAgICAvKmpzaGludCAtVzExNiAqL1xyXG4gICAgICAgIGlmIChtYXBwaW5nICE9IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiBtYXBwaW5nO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcclxuICAgIHN3aXRjaCAobnNVcmkpIHtcclxuICAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJzpcclxuICAgICAgICByZXR1cm4gJ3htbCc7XHJcbiAgICAgIGNhc2UgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJzpcclxuICAgICAgICByZXR1cm4gJ3htbG5zJztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBmb3IgKHZhciBwIGluIHRoaXMubmFtZXNwYWNlcykge1xyXG4gICAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlc1twXS51cmkgPT09IG5zVXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFByZWZpeChuc1VyaSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VDb250ZXh0IHtcclxuICBzY29wZXM6IGFueVtdO1xyXG4gIHByZWZpeENvdW50OiBudW1iZXI7IFxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOYW1lc3BhY2VDb250ZXh0KSkge1xyXG4gICAgICByZXR1cm4gbmV3IE5hbWVzcGFjZUNvbnRleHQoKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2NvcGVzID0gW107XHJcbiAgICB0aGlzLnB1c2hDb250ZXh0KCk7XHJcbiAgICB0aGlzLnByZWZpeENvdW50ID0gMDtcclxuICB9XHJcblxyXG4gIGFkZE5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmksIGxvY2FsT25seSkge1xyXG4gICAgaWYgKHRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KSA9PT0gbnNVcmkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFNjb3BlLm5hbWVzcGFjZXNbcHJlZml4XSA9IHtcclxuICAgICAgICB1cmk6IG5zVXJpLFxyXG4gICAgICAgIHByZWZpeDogcHJlZml4LFxyXG4gICAgICAgIGRlY2xhcmVkOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHB1c2hDb250ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2NvcGUgPSBuZXcgTmFtZXNwYWNlU2NvcGUodGhpcy5jdXJyZW50U2NvcGUpO1xyXG4gICAgdGhpcy5zY29wZXMucHVzaChzY29wZSk7XHJcbiAgICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlO1xyXG4gICAgcmV0dXJuIHNjb3BlO1xyXG4gIH1cclxuXHJcbiAgcG9wQ29udGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNjb3BlID0gdGhpcy5zY29wZXMucG9wKCk7XHJcbiAgICBpZiAoc2NvcGUpIHtcclxuICAgICAgdGhpcy5jdXJyZW50U2NvcGUgPSBzY29wZS5wYXJlbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2NvcGU7XHJcbiAgfVxyXG5cclxuICBnZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0UHJlZml4KG5zVXJpLCBsb2NhbE9ubHkpO1xyXG4gIH1cclxuICBcclxuICByZWdpc3Rlck5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5zVXJpKSB7XHJcbiAgICB2YXIgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgobnNVcmkpO1xyXG4gICAgaWYgKHByZWZpeCkge1xyXG4gICAgICAvLyBJZiB0aGUgbmFtZXNwYWNlIGhhcyBhbHJlYWR5IG1hcHBlZCB0byBhIHByZWZpeFxyXG4gICAgICByZXR1cm4gcHJlZml4O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gVHJ5IHRvIGdlbmVyYXRlIGEgdW5pcXVlIG5hbWVzcGFjZVxyXG4gICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHByZWZpeCA9ICducycgKyAoKyt0aGlzLnByZWZpeENvdW50KTtcclxuICAgICAgICBpZiAoIXRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCkpIHtcclxuICAgICAgICAgIC8vIFRoZSBwcmVmaXggaXMgbm90IHVzZWRcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5hZGROYW1lc3BhY2UocHJlZml4LCBuc1VyaSwgdHJ1ZSk7XHJcbiAgICByZXR1cm4gcHJlZml4O1xyXG4gIH1cclxuXHJcbiAgZGVjbGFyZU5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmkpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xyXG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcclxuICAgICAgaWYgKG1hcHBpbmcgJiYgbWFwcGluZy51cmkgPT09IG5zVXJpICYmIG1hcHBpbmcuZGVjbGFyZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xyXG4gICAgICAgIHVyaTogbnNVcmksXHJcbiAgICAgICAgcHJlZml4OiBwcmVmaXgsXHJcbiAgICAgICAgZGVjbGFyZWQ6IHRydWVcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2NvcGUgZm9yIFhNTCBuYW1lc3BhY2VzXHJcbiAqIEBwYXJhbSBbcGFyZW50XSBQYXJlbnQgc2NvcGVcclxuICogXHJcbiAqL1xyXG4vLyBleHBvcnQgZnVuY3Rpb24gTmFtZXNwYWNlU2NvcGUocGFyZW50KSB7XHJcbi8vICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZVNjb3BlKSkge1xyXG4vLyAgICAgcmV0dXJuIE5hbWVzcGFjZVNjb3BlKHBhcmVudCk7XHJcbi8vICAgfVxyXG4vLyAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4vLyAgIHRoaXMubmFtZXNwYWNlcyA9IHt9O1xyXG4vLyB9XHJcblxyXG4vLyAvKipcclxuLy8gICogTmFtZXNwYWNlIGNvbnRleHQgdGhhdCBtYW5hZ2VzIGhpZXJhcmNoaWNhbCBzY29wZXNcclxuLy8gICogIHtOYW1lc3BhY2VDb250ZXh0fVxyXG4vLyAgKi9cclxuLy8gZXhwb3J0IGZ1bmN0aW9uIE5hbWVzcGFjZUNvbnRleHQoKSB7XHJcbi8vICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZUNvbnRleHQpKSB7XHJcbi8vICAgICByZXR1cm4gTmFtZXNwYWNlQ29udGV4dCgpO1xyXG4vLyAgIH1cclxuLy8gICB0aGlzLnNjb3BlcyA9IFtdO1xyXG4vLyAgIHRoaXMucHVzaENvbnRleHQoKTtcclxuLy8gICB0aGlzLnByZWZpeENvdW50ID0gMDtcclxuLy8gfVxyXG5cclxuLy8gLyoqXHJcbi8vICAqIExvb2sgdXAgdGhlIG5hbWVzcGFjZSBVUkkgYnkgcHJlZml4XHJcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcclxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XHJcbi8vICAqICAgTmFtZXNwYWNlIFVSSVxyXG4vLyAgKi9cclxuLy8gTmFtZXNwYWNlU2NvcGUucHJvdG90eXBlLmdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XHJcbi8vICAgc3dpdGNoIChwcmVmaXgpIHtcclxuLy8gICAgIGNhc2UgJ3htbCc6XHJcbi8vICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcclxuLy8gICAgIGNhc2UgJ3htbG5zJzpcclxuLy8gICAgICAgcmV0dXJuICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc7XHJcbi8vICAgICBkZWZhdWx0OlxyXG4vLyAgICAgICB2YXIgbnNVcmkgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcclxuLy8gICAgICAgLypqc2hpbnQgLVcxMTYgKi9cclxuLy8gICAgICAgaWYgKG5zVXJpICE9IG51bGwpIHtcclxuLy8gICAgICAgICByZXR1cm4gbnNVcmkudXJpO1xyXG4vLyAgICAgICB9IGVsc2UgaWYgKCFsb2NhbE9ubHkgJiYgdGhpcy5wYXJlbnQpIHtcclxuLy8gICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCk7XHJcbi8vICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIG51bGw7XHJcbi8vICAgICAgIH1cclxuLy8gICB9XHJcbi8vIH07XHJcblxyXG4vLyBOYW1lc3BhY2VTY29wZS5wcm90b3R5cGUuZ2V0TmFtZXNwYWNlTWFwcGluZyA9IGZ1bmN0aW9uKHByZWZpeCkge1xyXG4vLyAgIHN3aXRjaCAocHJlZml4KSB7XHJcbi8vICAgICBjYXNlICd4bWwnOlxyXG4vLyAgICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZScsXHJcbi8vICAgICAgICAgcHJlZml4OiAneG1sJyxcclxuLy8gICAgICAgICBkZWNsYXJlZDogdHJ1ZVxyXG4vLyAgICAgICB9O1xyXG4vLyAgICAgY2FzZSAneG1sbnMnOlxyXG4vLyAgICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyxcclxuLy8gICAgICAgICBwcmVmaXg6ICd4bWxucycsXHJcbi8vICAgICAgICAgZGVjbGFyZWQ6IHRydWVcclxuLy8gICAgICAgfTtcclxuLy8gICAgIGRlZmF1bHQ6XHJcbi8vICAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5uYW1lc3BhY2VzW3ByZWZpeF07XHJcbi8vICAgICAgIC8qanNoaW50IC1XMTE2ICovXHJcbi8vICAgICAgIGlmIChtYXBwaW5nICE9IG51bGwpIHtcclxuLy8gICAgICAgICByZXR1cm4gbWFwcGluZztcclxuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCkge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XHJcbi8vICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIG51bGw7XHJcbi8vICAgICAgIH1cclxuLy8gICB9XHJcbi8vIH07XHJcblxyXG4vLyAvKipcclxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIHByZWZpeCBieSBVUklcclxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXHJcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxyXG4vLyAgKiAgIE5hbWVzcGFjZSBwcmVmaXhcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZVNjb3BlLnByb3RvdHlwZS5nZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XHJcbi8vICAgc3dpdGNoIChuc1VyaSkge1xyXG4vLyAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJzpcclxuLy8gICAgICAgcmV0dXJuICd4bWwnO1xyXG4vLyAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nOlxyXG4vLyAgICAgICByZXR1cm4gJ3htbG5zJztcclxuLy8gICAgIGRlZmF1bHQ6XHJcbi8vICAgICAgIGZvciAodmFyIHAgaW4gdGhpcy5uYW1lc3BhY2VzKSB7XHJcbi8vICAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlc1twXS51cmkgPT09IG5zVXJpKSB7XHJcbi8vICAgICAgICAgICByZXR1cm4gcDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgIH1cclxuLy8gICAgICAgaWYgKCFsb2NhbE9ubHkgJiYgdGhpcy5wYXJlbnQpIHtcclxuLy8gICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0UHJlZml4KG5zVXJpKTtcclxuLy8gICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICByZXR1cm4gbnVsbDtcclxuLy8gICAgICAgfVxyXG4vLyAgIH1cclxuLy8gfTtcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBBZGQgYSBwcmVmaXgvVVJJIG5hbWVzcGFjZSBtYXBwaW5nXHJcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcclxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXHJcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxyXG4vLyAgKiAge2Jvb2xlYW59IHRydWUgaWYgdGhlIG1hcHBpbmcgaXMgYWRkZWQgb3IgZmFsc2UgaWYgdGhlIG1hcHBpbmdcclxuLy8gICogYWxyZWFkeSBleGlzdHNcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmFkZE5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmksIGxvY2FsT25seSkge1xyXG4vLyAgIGlmICh0aGlzLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSkgPT09IG5zVXJpKSB7XHJcbi8vICAgICByZXR1cm4gZmFsc2U7XHJcbi8vICAgfVxyXG4vLyAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xyXG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xyXG4vLyAgICAgICB1cmk6IG5zVXJpLFxyXG4vLyAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuLy8gICAgICAgZGVjbGFyZWQ6IGZhbHNlXHJcbi8vICAgICB9O1xyXG4vLyAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgfVxyXG4vLyAgIHJldHVybiBmYWxzZTtcclxuLy8gfTtcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBQdXNoIGEgc2NvcGUgaW50byB0aGUgY29udGV4dFxyXG4vLyAgKiAgVGhlIGN1cnJlbnQgc2NvcGVcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLnB1c2hDb250ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgdmFyIHNjb3BlID0gTmFtZXNwYWNlU2NvcGUodGhpcy5jdXJyZW50U2NvcGUpO1xyXG4vLyAgIHRoaXMuc2NvcGVzLnB1c2goc2NvcGUpO1xyXG4vLyAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGU7XHJcbi8vICAgcmV0dXJuIHNjb3BlO1xyXG4vLyB9O1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFBvcCBhIHNjb3BlIG91dCBvZiB0aGUgY29udGV4dFxyXG4vLyAgKiAgIFRoZSByZW1vdmVkIHNjb3BlXHJcbi8vICAqL1xyXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5wb3BDb250ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgdmFyIHNjb3BlID0gdGhpcy5zY29wZXMucG9wKCk7XHJcbi8vICAgaWYgKHNjb3BlKSB7XHJcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlLnBhcmVudDtcclxuLy8gICB9IGVsc2Uge1xyXG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUgPSBudWxsO1xyXG4vLyAgIH1cclxuLy8gICByZXR1cm4gc2NvcGU7XHJcbi8vIH07XHJcblxyXG4vLyAvKipcclxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIFVSSSBieSBwcmVmaXhcclxuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxyXG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcclxuLy8gICogICBOYW1lc3BhY2UgVVJJXHJcbi8vICAqL1xyXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5nZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xyXG4vLyAgIHJldHVybiB0aGlzLmN1cnJlbnRTY29wZSAmJiB0aGlzLmN1cnJlbnRTY29wZS5nZXROYW1lc3BhY2VVUkkocHJlZml4LCBsb2NhbE9ubHkpO1xyXG4vLyB9O1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIExvb2sgdXAgdGhlIG5hbWVzcGFjZSBwcmVmaXggYnkgVVJJXHJcbi8vICAqIEBwYXJhbSAgbnNVUkkgTmFtZXNwYWNlIFVSSVxyXG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcclxuLy8gICogICBOYW1lc3BhY2UgcHJlZml4XHJcbi8vICAqL1xyXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5nZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XHJcbi8vICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldFByZWZpeChuc1VyaSwgbG9jYWxPbmx5KTtcclxuLy8gfTtcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBSZWdpc3RlciBhIG5hbWVzcGFjZVxyXG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcclxuLy8gICogICBUaGUgbWF0Y2hpbmcgb3IgZ2VuZXJhdGVkIG5hbWVzcGFjZSBwcmVmaXhcclxuLy8gICovXHJcbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLnJlZ2lzdGVyTmFtZXNwYWNlID0gZnVuY3Rpb24obnNVcmkpIHtcclxuLy8gICB2YXIgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgobnNVcmkpO1xyXG4vLyAgIGlmIChwcmVmaXgpIHtcclxuLy8gICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaGFzIGFscmVhZHkgbWFwcGVkIHRvIGEgcHJlZml4XHJcbi8vICAgICByZXR1cm4gcHJlZml4O1xyXG4vLyAgIH0gZWxzZSB7XHJcbi8vICAgICAvLyBUcnkgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgbmFtZXNwYWNlXHJcbi8vICAgICB3aGlsZSAodHJ1ZSkge1xyXG4vLyAgICAgICBwcmVmaXggPSAnbnMnICsgKCsrdGhpcy5wcmVmaXhDb3VudCk7XHJcbi8vICAgICAgIGlmICghdGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4KSkge1xyXG4vLyAgICAgICAgIC8vIFRoZSBwcmVmaXggaXMgbm90IHVzZWRcclxuLy8gICAgICAgICBicmVhaztcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyAgIH1cclxuLy8gICB0aGlzLmFkZE5hbWVzcGFjZShwcmVmaXgsIG5zVXJpLCB0cnVlKTtcclxuLy8gICByZXR1cm4gcHJlZml4O1xyXG4vLyB9O1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIERlY2xhcmUgYSBuYW1lc3BhY2UgcHJlZml4L3VyaSBtYXBwaW5nXHJcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcclxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXHJcbi8vICAqICAgdHJ1ZSBpZiB0aGUgZGVjbGFyYXRpb24gaXMgY3JlYXRlZFxyXG4vLyAgKi9cclxuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUuZGVjbGFyZU5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmkpIHtcclxuLy8gICBpZiAodGhpcy5jdXJyZW50U2NvcGUpIHtcclxuLy8gICAgIHZhciBtYXBwaW5nID0gdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlTWFwcGluZyhwcmVmaXgpO1xyXG4vLyAgICAgaWYgKG1hcHBpbmcgJiYgbWFwcGluZy51cmkgPT09IG5zVXJpICYmIG1hcHBpbmcuZGVjbGFyZWQpIHtcclxuLy8gICAgICAgcmV0dXJuIGZhbHNlO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xyXG4vLyAgICAgICB1cmk6IG5zVXJpLFxyXG4vLyAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuLy8gICAgICAgZGVjbGFyZWQ6IHRydWVcclxuLy8gICAgIH07XHJcbi8vICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICB9XHJcbi8vICAgcmV0dXJuIGZhbHNlO1xyXG4vLyB9O1xyXG4iXX0=