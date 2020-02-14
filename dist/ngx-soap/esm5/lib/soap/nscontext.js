/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
'use strict';
var NamespaceScope = /** @class */ (function () {
    function NamespaceScope(parent) {
        this.getNamespaceURI = (/**
         * @param {?} prefix
         * @param {?} localOnly
         * @return {?}
         */
        function (prefix, localOnly) {
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
        });
        this.getNamespaceMapping = (/**
         * @param {?} prefix
         * @return {?}
         */
        function (prefix) {
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
        });
        this.getPrefix = (/**
         * @param {?} nsUri
         * @param {?} localOnly
         * @return {?}
         */
        function (nsUri, localOnly) {
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
        });
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
        this.addNamespace = (/**
         * @param {?} prefix
         * @param {?} nsUri
         * @param {?} localOnly
         * @return {?}
         */
        function (prefix, nsUri, localOnly) {
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
        });
        this.pushContext = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var scope = new NamespaceScope(this.currentScope);
            this.scopes.push(scope);
            this.currentScope = scope;
            return scope;
        });
        this.popContext = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var scope = this.scopes.pop();
            if (scope) {
                this.currentScope = scope.parent;
            }
            else {
                this.currentScope = null;
            }
            return scope;
        });
        this.getNamespaceURI = (/**
         * @param {?} prefix
         * @param {?} localOnly
         * @return {?}
         */
        function (prefix, localOnly) {
            return this.currentScope && this.currentScope.getNamespaceURI(prefix, localOnly);
        });
        this.getPrefix = (/**
         * @param {?} nsUri
         * @param {?} localOnly
         * @return {?}
         */
        function (nsUri, localOnly) {
            return this.currentScope && this.currentScope.getPrefix(nsUri, localOnly);
        });
        this.registerNamespace = (/**
         * @param {?} nsUri
         * @return {?}
         */
        function (nsUri) {
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
        });
        this.declareNamespace = (/**
         * @param {?} prefix
         * @param {?} nsUri
         * @return {?}
         */
        function (prefix, nsUri) {
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
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnNjb250ZXh0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9uc2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQztBQUViO0lBR0Usd0JBQVksTUFBVztRQVF2QixvQkFBZTs7Ozs7UUFBRyxVQUFTLE1BQU0sRUFBRSxTQUFTO1lBQzFDLFFBQVEsTUFBTSxFQUFFO2dCQUNkLEtBQUssS0FBSztvQkFDUixPQUFPLHNDQUFzQyxDQUFDO2dCQUNoRCxLQUFLLE9BQU87b0JBQ1YsT0FBTywrQkFBK0IsQ0FBQztnQkFDekM7O3dCQUNNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztvQkFDbkMsaUJBQWlCO29CQUNqQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7d0JBQ2pCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQztxQkFDbEI7eUJBQU0sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNwQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUM1Qzt5QkFBTTt3QkFDTCxPQUFPLElBQUksQ0FBQztxQkFDYjthQUNKO1FBQ0gsQ0FBQyxFQUFBO1FBRUQsd0JBQW1COzs7O1FBQUcsVUFBUyxNQUFNO1lBQ25DLFFBQVEsTUFBTSxFQUFFO2dCQUNkLEtBQUssS0FBSztvQkFDUixPQUFPO3dCQUNMLEdBQUcsRUFBRSxzQ0FBc0M7d0JBQzNDLE1BQU0sRUFBRSxLQUFLO3dCQUNiLFFBQVEsRUFBRSxJQUFJO3FCQUNmLENBQUM7Z0JBQ0osS0FBSyxPQUFPO29CQUNWLE9BQU87d0JBQ0wsR0FBRyxFQUFFLCtCQUErQjt3QkFDcEMsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztnQkFDSjs7d0JBQ00sT0FBTyxHQUFHLElBQUksQ0FBQyxV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SyxDQUFDO2lCQUNkO2dCQUNELElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHO29CQUNyQyxHQUFHLEVBQUUsS0FBSztvQkFDVixNQUFNLEVBQUUsTUFBTTtvQkFDZCxRQUFRLEVBQUUsSUFBSTtpQkFDZixDQUFDO2dCQUNGLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsRUFBQTtRQWpGQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksZ0JBQWdCLENBQUMsRUFBRTtZQUN2QyxPQUFPLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztTQUMvQjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBNEVILHVCQUFDO0FBQUQsQ0FBQyxBQXZGRCxJQXVGQzs7OztJQXRGQyxrQ0FBYzs7SUFDZCx1Q0FBb0I7O0lBV3BCLHdDQWFDOztJQUVELHVDQUtDOztJQUVELHNDQVFDOztJQUVELDJDQUVDOztJQUVELHFDQUVDOztJQUVELDZDQWlCQzs7SUFFRCw0Q0FjQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZVNjb3BlIHtcbiAgcGFyZW50OiBhbnk7XG4gIG5hbWVzcGFjZXM6IGFueTtcbiAgY29uc3RydWN0b3IocGFyZW50OiBhbnkpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlU2NvcGUpKSB7XG4gICAgICByZXR1cm4gbmV3IE5hbWVzcGFjZVNjb3BlKHBhcmVudCk7XG4gICAgfVxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMubmFtZXNwYWNlcyA9IHt9OyAgXG4gIH1cblxuICBnZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xuICAgIHN3aXRjaCAocHJlZml4KSB7XG4gICAgICBjYXNlICd4bWwnOlxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XG4gICAgICBjYXNlICd4bWxucyc6XG4gICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIG5zVXJpID0gdGhpcy5uYW1lc3BhY2VzW3ByZWZpeF07XG4gICAgICAgIC8qanNoaW50IC1XMTE2ICovXG4gICAgICAgIGlmIChuc1VyaSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG5zVXJpLnVyaTtcbiAgICAgICAgfSBlbHNlIGlmICghbG9jYWxPbmx5ICYmIHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZVVSSShwcmVmaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TmFtZXNwYWNlTWFwcGluZyA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHN3aXRjaCAocHJlZml4KSB7XG4gICAgICBjYXNlICd4bWwnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZScsXG4gICAgICAgICAgcHJlZml4OiAneG1sJyxcbiAgICAgICAgICBkZWNsYXJlZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgY2FzZSAneG1sbnMnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyxcbiAgICAgICAgICBwcmVmaXg6ICd4bWxucycsXG4gICAgICAgICAgZGVjbGFyZWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5uYW1lc3BhY2VzW3ByZWZpeF07XG4gICAgICAgIC8qanNoaW50IC1XMTE2ICovXG4gICAgICAgIGlmIChtYXBwaW5nICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbWFwcGluZztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XG4gICAgc3dpdGNoIChuc1VyaSkge1xuICAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJzpcbiAgICAgICAgcmV0dXJuICd4bWwnO1xuICAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nOlxuICAgICAgICByZXR1cm4gJ3htbG5zJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGZvciAodmFyIHAgaW4gdGhpcy5uYW1lc3BhY2VzKSB7XG4gICAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlc1twXS51cmkgPT09IG5zVXJpKSB7XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsb2NhbE9ubHkgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0UHJlZml4KG5zVXJpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlQ29udGV4dCB7XG4gIHNjb3BlczogYW55W107XG4gIHByZWZpeENvdW50OiBudW1iZXI7IFxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOYW1lc3BhY2VDb250ZXh0KSkge1xuICAgICAgcmV0dXJuIG5ldyBOYW1lc3BhY2VDb250ZXh0KCk7XG4gICAgfVxuICAgIHRoaXMuc2NvcGVzID0gW107XG4gICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuICAgIHRoaXMucHJlZml4Q291bnQgPSAwO1xuICB9XG5cbiAgYWRkTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSwgbG9jYWxPbmx5KSB7XG4gICAgaWYgKHRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KSA9PT0gbnNVcmkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XG4gICAgICAgIHVyaTogbnNVcmksXG4gICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICBkZWNsYXJlZDogZmFsc2VcbiAgICAgIH07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVzaENvbnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NvcGUgPSBuZXcgTmFtZXNwYWNlU2NvcGUodGhpcy5jdXJyZW50U2NvcGUpO1xuICAgIHRoaXMuc2NvcGVzLnB1c2goc2NvcGUpO1xuICAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGU7XG4gICAgcmV0dXJuIHNjb3BlO1xuICB9XG5cbiAgcG9wQ29udGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY29wZSA9IHRoaXMuc2NvcGVzLnBvcCgpO1xuICAgIGlmIChzY29wZSkge1xuICAgICAgdGhpcy5jdXJyZW50U2NvcGUgPSBzY29wZS5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3BlO1xuICB9XG5cbiAgZ2V0TmFtZXNwYWNlVVJJID0gZnVuY3Rpb24ocHJlZml4LCBsb2NhbE9ubHkpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KTtcbiAgfVxuXG4gIGdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0UHJlZml4KG5zVXJpLCBsb2NhbE9ubHkpO1xuICB9XG4gIFxuICByZWdpc3Rlck5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5zVXJpKSB7XG4gICAgdmFyIHByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KG5zVXJpKTtcbiAgICBpZiAocHJlZml4KSB7XG4gICAgICAvLyBJZiB0aGUgbmFtZXNwYWNlIGhhcyBhbHJlYWR5IG1hcHBlZCB0byBhIHByZWZpeFxuICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVHJ5IHRvIGdlbmVyYXRlIGEgdW5pcXVlIG5hbWVzcGFjZVxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgcHJlZml4ID0gJ25zJyArICgrK3RoaXMucHJlZml4Q291bnQpO1xuICAgICAgICBpZiAoIXRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCkpIHtcbiAgICAgICAgICAvLyBUaGUgcHJlZml4IGlzIG5vdCB1c2VkXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGROYW1lc3BhY2UocHJlZml4LCBuc1VyaSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxuXG4gIGRlY2xhcmVOYW1lc3BhY2UgPSBmdW5jdGlvbihwcmVmaXgsIG5zVXJpKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcbiAgICAgIGlmIChtYXBwaW5nICYmIG1hcHBpbmcudXJpID09PSBuc1VyaSAmJiBtYXBwaW5nLmRlY2xhcmVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNjb3BlLm5hbWVzcGFjZXNbcHJlZml4XSA9IHtcbiAgICAgICAgdXJpOiBuc1VyaSxcbiAgICAgICAgcHJlZml4OiBwcmVmaXgsXG4gICAgICAgIGRlY2xhcmVkOiB0cnVlXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFNjb3BlIGZvciBYTUwgbmFtZXNwYWNlc1xuICogQHBhcmFtIFtwYXJlbnRdIFBhcmVudCBzY29wZVxuICogXG4gKi9cbi8vIGV4cG9ydCBmdW5jdGlvbiBOYW1lc3BhY2VTY29wZShwYXJlbnQpIHtcbi8vICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZVNjb3BlKSkge1xuLy8gICAgIHJldHVybiBOYW1lc3BhY2VTY29wZShwYXJlbnQpO1xuLy8gICB9XG4vLyAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuLy8gICB0aGlzLm5hbWVzcGFjZXMgPSB7fTtcbi8vIH1cblxuLy8gLyoqXG4vLyAgKiBOYW1lc3BhY2UgY29udGV4dCB0aGF0IG1hbmFnZXMgaGllcmFyY2hpY2FsIHNjb3Blc1xuLy8gICogIHtOYW1lc3BhY2VDb250ZXh0fVxuLy8gICovXG4vLyBleHBvcnQgZnVuY3Rpb24gTmFtZXNwYWNlQ29udGV4dCgpIHtcbi8vICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZUNvbnRleHQpKSB7XG4vLyAgICAgcmV0dXJuIE5hbWVzcGFjZUNvbnRleHQoKTtcbi8vICAgfVxuLy8gICB0aGlzLnNjb3BlcyA9IFtdO1xuLy8gICB0aGlzLnB1c2hDb250ZXh0KCk7XG4vLyAgIHRoaXMucHJlZml4Q291bnQgPSAwO1xuLy8gfVxuXG4vLyAvKipcbi8vICAqIExvb2sgdXAgdGhlIG5hbWVzcGFjZSBVUkkgYnkgcHJlZml4XG4vLyAgKiBAcGFyYW0gIHByZWZpeCBOYW1lc3BhY2UgcHJlZml4XG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcbi8vICAqICAgTmFtZXNwYWNlIFVSSVxuLy8gICovXG4vLyBOYW1lc3BhY2VTY29wZS5wcm90b3R5cGUuZ2V0TmFtZXNwYWNlVVJJID0gZnVuY3Rpb24ocHJlZml4LCBsb2NhbE9ubHkpIHtcbi8vICAgc3dpdGNoIChwcmVmaXgpIHtcbi8vICAgICBjYXNlICd4bWwnOlxuLy8gICAgICAgcmV0dXJuICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xuLy8gICAgIGNhc2UgJ3htbG5zJzpcbi8vICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nO1xuLy8gICAgIGRlZmF1bHQ6XG4vLyAgICAgICB2YXIgbnNVcmkgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcbi8vICAgICAgIC8qanNoaW50IC1XMTE2ICovXG4vLyAgICAgICBpZiAobnNVcmkgIT0gbnVsbCkge1xuLy8gICAgICAgICByZXR1cm4gbnNVcmkudXJpO1xuLy8gICAgICAgfSBlbHNlIGlmICghbG9jYWxPbmx5ICYmIHRoaXMucGFyZW50KSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VVUkkocHJlZml4KTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiBudWxsO1xuLy8gICAgICAgfVxuLy8gICB9XG4vLyB9O1xuXG4vLyBOYW1lc3BhY2VTY29wZS5wcm90b3R5cGUuZ2V0TmFtZXNwYWNlTWFwcGluZyA9IGZ1bmN0aW9uKHByZWZpeCkge1xuLy8gICBzd2l0Y2ggKHByZWZpeCkge1xuLy8gICAgIGNhc2UgJ3htbCc6XG4vLyAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICB1cmk6ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnLFxuLy8gICAgICAgICBwcmVmaXg6ICd4bWwnLFxuLy8gICAgICAgICBkZWNsYXJlZDogdHJ1ZVxuLy8gICAgICAgfTtcbi8vICAgICBjYXNlICd4bWxucyc6XG4vLyAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICB1cmk6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycsXG4vLyAgICAgICAgIHByZWZpeDogJ3htbG5zJyxcbi8vICAgICAgICAgZGVjbGFyZWQ6IHRydWVcbi8vICAgICAgIH07XG4vLyAgICAgZGVmYXVsdDpcbi8vICAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5uYW1lc3BhY2VzW3ByZWZpeF07XG4vLyAgICAgICAvKmpzaGludCAtVzExNiAqL1xuLy8gICAgICAgaWYgKG1hcHBpbmcgIT0gbnVsbCkge1xuLy8gICAgICAgICByZXR1cm4gbWFwcGluZztcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiBudWxsO1xuLy8gICAgICAgfVxuLy8gICB9XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIExvb2sgdXAgdGhlIG5hbWVzcGFjZSBwcmVmaXggYnkgVVJJXG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxuLy8gICogICBOYW1lc3BhY2UgcHJlZml4XG4vLyAgKi9cbi8vIE5hbWVzcGFjZVNjb3BlLnByb3RvdHlwZS5nZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XG4vLyAgIHN3aXRjaCAobnNVcmkpIHtcbi8vICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnOlxuLy8gICAgICAgcmV0dXJuICd4bWwnO1xuLy8gICAgIGNhc2UgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJzpcbi8vICAgICAgIHJldHVybiAneG1sbnMnO1xuLy8gICAgIGRlZmF1bHQ6XG4vLyAgICAgICBmb3IgKHZhciBwIGluIHRoaXMubmFtZXNwYWNlcykge1xuLy8gICAgICAgICBpZiAodGhpcy5uYW1lc3BhY2VzW3BdLnVyaSA9PT0gbnNVcmkpIHtcbi8vICAgICAgICAgICByZXR1cm4gcDtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgICAgaWYgKCFsb2NhbE9ubHkgJiYgdGhpcy5wYXJlbnQpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFByZWZpeChuc1VyaSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gbnVsbDtcbi8vICAgICAgIH1cbi8vICAgfVxuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBBZGQgYSBwcmVmaXgvVVJJIG5hbWVzcGFjZSBtYXBwaW5nXG4vLyAgKiBAcGFyYW0gIHByZWZpeCBOYW1lc3BhY2UgcHJlZml4XG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxuLy8gICogIHtib29sZWFufSB0cnVlIGlmIHRoZSBtYXBwaW5nIGlzIGFkZGVkIG9yIGZhbHNlIGlmIHRoZSBtYXBwaW5nXG4vLyAgKiBhbHJlYWR5IGV4aXN0c1xuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5hZGROYW1lc3BhY2UgPSBmdW5jdGlvbihwcmVmaXgsIG5zVXJpLCBsb2NhbE9ubHkpIHtcbi8vICAgaWYgKHRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KSA9PT0gbnNVcmkpIHtcbi8vICAgICByZXR1cm4gZmFsc2U7XG4vLyAgIH1cbi8vICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xuLy8gICAgICAgdXJpOiBuc1VyaSxcbi8vICAgICAgIHByZWZpeDogcHJlZml4LFxuLy8gICAgICAgZGVjbGFyZWQ6IGZhbHNlXG4vLyAgICAgfTtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfVxuLy8gICByZXR1cm4gZmFsc2U7XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIFB1c2ggYSBzY29wZSBpbnRvIHRoZSBjb250ZXh0XG4vLyAgKiAgVGhlIGN1cnJlbnQgc2NvcGVcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUucHVzaENvbnRleHQgPSBmdW5jdGlvbigpIHtcbi8vICAgdmFyIHNjb3BlID0gTmFtZXNwYWNlU2NvcGUodGhpcy5jdXJyZW50U2NvcGUpO1xuLy8gICB0aGlzLnNjb3Blcy5wdXNoKHNjb3BlKTtcbi8vICAgdGhpcy5jdXJyZW50U2NvcGUgPSBzY29wZTtcbi8vICAgcmV0dXJuIHNjb3BlO1xuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBQb3AgYSBzY29wZSBvdXQgb2YgdGhlIGNvbnRleHRcbi8vICAqICAgVGhlIHJlbW92ZWQgc2NvcGVcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUucG9wQ29udGV4dCA9IGZ1bmN0aW9uKCkge1xuLy8gICB2YXIgc2NvcGUgPSB0aGlzLnNjb3Blcy5wb3AoKTtcbi8vICAgaWYgKHNjb3BlKSB7XG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUgPSBzY29wZS5wYXJlbnQ7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUgPSBudWxsO1xuLy8gICB9XG4vLyAgIHJldHVybiBzY29wZTtcbi8vIH07XG5cbi8vIC8qKlxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIFVSSSBieSBwcmVmaXhcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxuLy8gICogICBOYW1lc3BhY2UgVVJJXG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XG4vLyAgIHJldHVybiB0aGlzLmN1cnJlbnRTY29wZSAmJiB0aGlzLmN1cnJlbnRTY29wZS5nZXROYW1lc3BhY2VVUkkocHJlZml4LCBsb2NhbE9ubHkpO1xuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBMb29rIHVwIHRoZSBuYW1lc3BhY2UgcHJlZml4IGJ5IFVSSVxuLy8gICogQHBhcmFtICBuc1VSSSBOYW1lc3BhY2UgVVJJXG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcbi8vICAqICAgTmFtZXNwYWNlIHByZWZpeFxuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5nZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XG4vLyAgIHJldHVybiB0aGlzLmN1cnJlbnRTY29wZSAmJiB0aGlzLmN1cnJlbnRTY29wZS5nZXRQcmVmaXgobnNVcmksIGxvY2FsT25seSk7XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIFJlZ2lzdGVyIGEgbmFtZXNwYWNlXG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcbi8vICAqICAgVGhlIG1hdGNoaW5nIG9yIGdlbmVyYXRlZCBuYW1lc3BhY2UgcHJlZml4XG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLnJlZ2lzdGVyTmFtZXNwYWNlID0gZnVuY3Rpb24obnNVcmkpIHtcbi8vICAgdmFyIHByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KG5zVXJpKTtcbi8vICAgaWYgKHByZWZpeCkge1xuLy8gICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaGFzIGFscmVhZHkgbWFwcGVkIHRvIGEgcHJlZml4XG4vLyAgICAgcmV0dXJuIHByZWZpeDtcbi8vICAgfSBlbHNlIHtcbi8vICAgICAvLyBUcnkgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgbmFtZXNwYWNlXG4vLyAgICAgd2hpbGUgKHRydWUpIHtcbi8vICAgICAgIHByZWZpeCA9ICducycgKyAoKyt0aGlzLnByZWZpeENvdW50KTtcbi8vICAgICAgIGlmICghdGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4KSkge1xuLy8gICAgICAgICAvLyBUaGUgcHJlZml4IGlzIG5vdCB1c2VkXG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuLy8gICB0aGlzLmFkZE5hbWVzcGFjZShwcmVmaXgsIG5zVXJpLCB0cnVlKTtcbi8vICAgcmV0dXJuIHByZWZpeDtcbi8vIH07XG5cbi8vIC8qKlxuLy8gICogRGVjbGFyZSBhIG5hbWVzcGFjZSBwcmVmaXgvdXJpIG1hcHBpbmdcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcbi8vICAqIEBwYXJhbSAgbnNVcmkgTmFtZXNwYWNlIFVSSVxuLy8gICogICB0cnVlIGlmIHRoZSBkZWNsYXJhdGlvbiBpcyBjcmVhdGVkXG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmRlY2xhcmVOYW1lc3BhY2UgPSBmdW5jdGlvbihwcmVmaXgsIG5zVXJpKSB7XG4vLyAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xuLy8gICAgIHZhciBtYXBwaW5nID0gdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlTWFwcGluZyhwcmVmaXgpO1xuLy8gICAgIGlmIChtYXBwaW5nICYmIG1hcHBpbmcudXJpID09PSBuc1VyaSAmJiBtYXBwaW5nLmRlY2xhcmVkKSB7XG4vLyAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgICAgfVxuLy8gICAgIHRoaXMuY3VycmVudFNjb3BlLm5hbWVzcGFjZXNbcHJlZml4XSA9IHtcbi8vICAgICAgIHVyaTogbnNVcmksXG4vLyAgICAgICBwcmVmaXg6IHByZWZpeCxcbi8vICAgICAgIGRlY2xhcmVkOiB0cnVlXG4vLyAgICAgfTtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfVxuLy8gICByZXR1cm4gZmFsc2U7XG4vLyB9O1xuIl19