/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
'use strict';
export class NamespaceScope {
    /**
     * @param {?} parent
     */
    constructor(parent) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnNjb250ZXh0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9uc2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQztBQUViLE1BQU0sT0FBTyxjQUFjOzs7O0lBR3pCLFlBQVksTUFBVztRQVF2QixvQkFBZTs7Ozs7UUFBRyxVQUFTLE1BQU0sRUFBRSxTQUFTO1lBQzFDLFFBQVEsTUFBTSxFQUFFO2dCQUNkLEtBQUssS0FBSztvQkFDUixPQUFPLHNDQUFzQyxDQUFDO2dCQUNoRCxLQUFLLE9BQU87b0JBQ1YsT0FBTywrQkFBK0IsQ0FBQztnQkFDekM7O3dCQUNNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztvQkFDbkMsaUJBQWlCO29CQUNqQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7d0JBQ2pCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQztxQkFDbEI7eUJBQU0sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNwQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUM1Qzt5QkFBTTt3QkFDTCxPQUFPLElBQUksQ0FBQztxQkFDYjthQUNKO1FBQ0gsQ0FBQyxFQUFBO1FBRUQsd0JBQW1COzs7O1FBQUcsVUFBUyxNQUFNO1lBQ25DLFFBQVEsTUFBTSxFQUFFO2dCQUNkLEtBQUssS0FBSztvQkFDUixPQUFPO3dCQUNMLEdBQUcsRUFBRSxzQ0FBc0M7d0JBQzNDLE1BQU0sRUFBRSxLQUFLO3dCQUNiLFFBQVEsRUFBRSxJQUFJO3FCQUNmLENBQUM7Z0JBQ0osS0FBSyxPQUFPO29CQUNWLE9BQU87d0JBQ0wsR0FBRyxFQUFFLCtCQUErQjt3QkFDcEMsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztnQkFDSjs7d0JBQ00sT0FB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QUFPLEtBQUssQ0FBQztpQkFDZDtnQkFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDckMsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsTUFBTSxFQUFFLE1BQU07b0JBQ2QsUUFBUSxFQUFFLElBQUk7aUJBQ2YsQ0FBQztnQkFDRixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLEVBQUE7UUFqRkMsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLGdCQUFnQixDQUFDLEVBQUU7WUFDdkMsT0FBTyxJQUFJLGdCQUFnQixFQUFFLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQTRFRjs7O0lBdEZDLGtDQUFjOztJQUNkLHVDQUFvQjs7SUFXcEIsd0NBYUM7O0lBRUQsdUNBS0M7O0lBRUQsc0NBUUM7O0lBRUQsMkNBRUM7O0lBRUQscUNBRUM7O0lBRUQsNkNBaUJDOztJQUVELDRDQWNDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlU2NvcGUge1xuICBwYXJlbnQ6IGFueTtcbiAgbmFtZXNwYWNlczogYW55O1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGFueSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOYW1lc3BhY2VTY29wZSkpIHtcbiAgICAgIHJldHVybiBuZXcgTmFtZXNwYWNlU2NvcGUocGFyZW50KTtcbiAgICB9XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5uYW1lc3BhY2VzID0ge307ICBcbiAgfVxuXG4gIGdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XG4gICAgc3dpdGNoIChwcmVmaXgpIHtcbiAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcbiAgICAgIGNhc2UgJ3htbG5zJzpcbiAgICAgICAgcmV0dXJuICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgbnNVcmkgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcbiAgICAgICAgLypqc2hpbnQgLVcxMTYgKi9cbiAgICAgICAgaWYgKG5zVXJpICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnNVcmkudXJpO1xuICAgICAgICB9IGVsc2UgaWYgKCFsb2NhbE9ubHkgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROYW1lc3BhY2VNYXBwaW5nID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgc3dpdGNoIChwcmVmaXgpIHtcbiAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXJpOiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJyxcbiAgICAgICAgICBwcmVmaXg6ICd4bWwnLFxuICAgICAgICAgIGRlY2xhcmVkOiB0cnVlXG4gICAgICAgIH07XG4gICAgICBjYXNlICd4bWxucyc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXJpOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nLFxuICAgICAgICAgIHByZWZpeDogJ3htbG5zJyxcbiAgICAgICAgICBkZWNsYXJlZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcbiAgICAgICAgLypqc2hpbnQgLVcxMTYgKi9cbiAgICAgICAgaWYgKG1hcHBpbmcgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBtYXBwaW5nO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcbiAgICBzd2l0Y2ggKG5zVXJpKSB7XG4gICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnOlxuICAgICAgICByZXR1cm4gJ3htbCc7XG4gICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc6XG4gICAgICAgIHJldHVybiAneG1sbnMnO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZm9yICh2YXIgcCBpbiB0aGlzLm5hbWVzcGFjZXMpIHtcbiAgICAgICAgICBpZiAodGhpcy5uYW1lc3BhY2VzW3BdLnVyaSA9PT0gbnNVcmkpIHtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRQcmVmaXgobnNVcmkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VDb250ZXh0IHtcbiAgc2NvcGVzOiBhbnlbXTtcbiAgcHJlZml4Q291bnQ6IG51bWJlcjsgXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZUNvbnRleHQpKSB7XG4gICAgICByZXR1cm4gbmV3IE5hbWVzcGFjZUNvbnRleHQoKTtcbiAgICB9XG4gICAgdGhpcy5zY29wZXMgPSBbXTtcbiAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG4gICAgdGhpcy5wcmVmaXhDb3VudCA9IDA7XG4gIH1cblxuICBhZGROYW1lc3BhY2UgPSBmdW5jdGlvbihwcmVmaXgsIG5zVXJpLCBsb2NhbE9ubHkpIHtcbiAgICBpZiAodGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4LCBsb2NhbE9ubHkpID09PSBuc1VyaSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5jdXJyZW50U2NvcGUpIHtcbiAgICAgIHRoaXMuY3VycmVudFNjb3BlLm5hbWVzcGFjZXNbcHJlZml4XSA9IHtcbiAgICAgICAgdXJpOiBuc1VyaSxcbiAgICAgICAgcHJlZml4OiBwcmVmaXgsXG4gICAgICAgIGRlY2xhcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdXNoQ29udGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY29wZSA9IG5ldyBOYW1lc3BhY2VTY29wZSh0aGlzLmN1cnJlbnRTY29wZSk7XG4gICAgdGhpcy5zY29wZXMucHVzaChzY29wZSk7XG4gICAgdGhpcy5jdXJyZW50U2NvcGUgPSBzY29wZTtcbiAgICByZXR1cm4gc2NvcGU7XG4gIH1cblxuICBwb3BDb250ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjb3BlID0gdGhpcy5zY29wZXMucG9wKCk7XG4gICAgaWYgKHNjb3BlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlLnBhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U2NvcGUgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gc2NvcGU7XG4gIH1cblxuICBnZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY29wZSAmJiB0aGlzLmN1cnJlbnRTY29wZS5nZXROYW1lc3BhY2VVUkkocHJlZml4LCBsb2NhbE9ubHkpO1xuICB9XG5cbiAgZ2V0UHJlZml4ID0gZnVuY3Rpb24obnNVcmksIGxvY2FsT25seSkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY29wZSAmJiB0aGlzLmN1cnJlbnRTY29wZS5nZXRQcmVmaXgobnNVcmksIGxvY2FsT25seSk7XG4gIH1cbiAgXG4gIHJlZ2lzdGVyTmFtZXNwYWNlID0gZnVuY3Rpb24obnNVcmkpIHtcbiAgICB2YXIgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgobnNVcmkpO1xuICAgIGlmIChwcmVmaXgpIHtcbiAgICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaGFzIGFscmVhZHkgbWFwcGVkIHRvIGEgcHJlZml4XG4gICAgICByZXR1cm4gcHJlZml4O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcnkgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgbmFtZXNwYWNlXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBwcmVmaXggPSAnbnMnICsgKCsrdGhpcy5wcmVmaXhDb3VudCk7XG4gICAgICAgIGlmICghdGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4KSkge1xuICAgICAgICAgIC8vIFRoZSBwcmVmaXggaXMgbm90IHVzZWRcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFkZE5hbWVzcGFjZShwcmVmaXgsIG5zVXJpLCB0cnVlKTtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG5cbiAgZGVjbGFyZU5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmkpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50U2NvcGUpIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlTWFwcGluZyhwcmVmaXgpO1xuICAgICAgaWYgKG1hcHBpbmcgJiYgbWFwcGluZy51cmkgPT09IG5zVXJpICYmIG1hcHBpbmcuZGVjbGFyZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xuICAgICAgICB1cmk6IG5zVXJpLFxuICAgICAgICBwcmVmaXg6IHByZWZpeCxcbiAgICAgICAgZGVjbGFyZWQ6IHRydWVcbiAgICAgIH07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogU2NvcGUgZm9yIFhNTCBuYW1lc3BhY2VzXG4gKiBAcGFyYW0gW3BhcmVudF0gUGFyZW50IHNjb3BlXG4gKiBcbiAqL1xuLy8gZXhwb3J0IGZ1bmN0aW9uIE5hbWVzcGFjZVNjb3BlKHBhcmVudCkge1xuLy8gICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlU2NvcGUpKSB7XG4vLyAgICAgcmV0dXJuIE5hbWVzcGFjZVNjb3BlKHBhcmVudCk7XG4vLyAgIH1cbi8vICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4vLyAgIHRoaXMubmFtZXNwYWNlcyA9IHt9O1xuLy8gfVxuXG4vLyAvKipcbi8vICAqIE5hbWVzcGFjZSBjb250ZXh0IHRoYXQgbWFuYWdlcyBoaWVyYXJjaGljYWwgc2NvcGVzXG4vLyAgKiAge05hbWVzcGFjZUNvbnRleHR9XG4vLyAgKi9cbi8vIGV4cG9ydCBmdW5jdGlvbiBOYW1lc3BhY2VDb250ZXh0KCkge1xuLy8gICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlQ29udGV4dCkpIHtcbi8vICAgICByZXR1cm4gTmFtZXNwYWNlQ29udGV4dCgpO1xuLy8gICB9XG4vLyAgIHRoaXMuc2NvcGVzID0gW107XG4vLyAgIHRoaXMucHVzaENvbnRleHQoKTtcbi8vICAgdGhpcy5wcmVmaXhDb3VudCA9IDA7XG4vLyB9XG5cbi8vIC8qKlxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIFVSSSBieSBwcmVmaXhcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxuLy8gICogICBOYW1lc3BhY2UgVVJJXG4vLyAgKi9cbi8vIE5hbWVzcGFjZVNjb3BlLnByb3RvdHlwZS5nZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xuLy8gICBzd2l0Y2ggKHByZWZpeCkge1xuLy8gICAgIGNhc2UgJ3htbCc6XG4vLyAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XG4vLyAgICAgY2FzZSAneG1sbnMnOlxuLy8gICAgICAgcmV0dXJuICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc7XG4vLyAgICAgZGVmYXVsdDpcbi8vICAgICAgIHZhciBuc1VyaSA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xuLy8gICAgICAgLypqc2hpbnQgLVcxMTYgKi9cbi8vICAgICAgIGlmIChuc1VyaSAhPSBudWxsKSB7XG4vLyAgICAgICAgIHJldHVybiBuc1VyaS51cmk7XG4vLyAgICAgICB9IGVsc2UgaWYgKCFsb2NhbE9ubHkgJiYgdGhpcy5wYXJlbnQpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE5hbWVzcGFjZVVSSShwcmVmaXgpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgcmV0dXJuIG51bGw7XG4vLyAgICAgICB9XG4vLyAgIH1cbi8vIH07XG5cbi8vIE5hbWVzcGFjZVNjb3BlLnByb3RvdHlwZS5nZXROYW1lc3BhY2VNYXBwaW5nID0gZnVuY3Rpb24ocHJlZml4KSB7XG4vLyAgIHN3aXRjaCAocHJlZml4KSB7XG4vLyAgICAgY2FzZSAneG1sJzpcbi8vICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZScsXG4vLyAgICAgICAgIHByZWZpeDogJ3htbCcsXG4vLyAgICAgICAgIGRlY2xhcmVkOiB0cnVlXG4vLyAgICAgICB9O1xuLy8gICAgIGNhc2UgJ3htbG5zJzpcbi8vICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgIHVyaTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyxcbi8vICAgICAgICAgcHJlZml4OiAneG1sbnMnLFxuLy8gICAgICAgICBkZWNsYXJlZDogdHJ1ZVxuLy8gICAgICAgfTtcbi8vICAgICBkZWZhdWx0OlxuLy8gICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLm5hbWVzcGFjZXNbcHJlZml4XTtcbi8vICAgICAgIC8qanNoaW50IC1XMTE2ICovXG4vLyAgICAgICBpZiAobWFwcGluZyAhPSBudWxsKSB7XG4vLyAgICAgICAgIHJldHVybiBtYXBwaW5nO1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TmFtZXNwYWNlTWFwcGluZyhwcmVmaXgpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgcmV0dXJuIG51bGw7XG4vLyAgICAgICB9XG4vLyAgIH1cbi8vIH07XG5cbi8vIC8qKlxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIHByZWZpeCBieSBVUklcbi8vICAqIEBwYXJhbSAgbnNVcmkgTmFtZXNwYWNlIFVSSVxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XG4vLyAgKiAgIE5hbWVzcGFjZSBwcmVmaXhcbi8vICAqL1xuLy8gTmFtZXNwYWNlU2NvcGUucHJvdG90eXBlLmdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcbi8vICAgc3dpdGNoIChuc1VyaSkge1xuLy8gICAgIGNhc2UgJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc6XG4vLyAgICAgICByZXR1cm4gJ3htbCc7XG4vLyAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nOlxuLy8gICAgICAgcmV0dXJuICd4bWxucyc7XG4vLyAgICAgZGVmYXVsdDpcbi8vICAgICAgIGZvciAodmFyIHAgaW4gdGhpcy5uYW1lc3BhY2VzKSB7XG4vLyAgICAgICAgIGlmICh0aGlzLm5hbWVzcGFjZXNbcF0udXJpID09PSBuc1VyaSkge1xuLy8gICAgICAgICAgIHJldHVybiBwO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgICBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0UHJlZml4KG5zVXJpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiBudWxsO1xuLy8gICAgICAgfVxuLy8gICB9XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIEFkZCBhIHByZWZpeC9VUkkgbmFtZXNwYWNlIG1hcHBpbmdcbi8vICAqIEBwYXJhbSAgcHJlZml4IE5hbWVzcGFjZSBwcmVmaXhcbi8vICAqIEBwYXJhbSAgbnNVcmkgTmFtZXNwYWNlIFVSSVxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XG4vLyAgKiAge2Jvb2xlYW59IHRydWUgaWYgdGhlIG1hcHBpbmcgaXMgYWRkZWQgb3IgZmFsc2UgaWYgdGhlIG1hcHBpbmdcbi8vICAqIGFscmVhZHkgZXhpc3RzXG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmFkZE5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmksIGxvY2FsT25seSkge1xuLy8gICBpZiAodGhpcy5nZXROYW1lc3BhY2VVUkkocHJlZml4LCBsb2NhbE9ubHkpID09PSBuc1VyaSkge1xuLy8gICAgIHJldHVybiBmYWxzZTtcbi8vICAgfVxuLy8gICBpZiAodGhpcy5jdXJyZW50U2NvcGUpIHtcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XG4vLyAgICAgICB1cmk6IG5zVXJpLFxuLy8gICAgICAgcHJlZml4OiBwcmVmaXgsXG4vLyAgICAgICBkZWNsYXJlZDogZmFsc2Vcbi8vICAgICB9O1xuLy8gICAgIHJldHVybiB0cnVlO1xuLy8gICB9XG4vLyAgIHJldHVybiBmYWxzZTtcbi8vIH07XG5cbi8vIC8qKlxuLy8gICogUHVzaCBhIHNjb3BlIGludG8gdGhlIGNvbnRleHRcbi8vICAqICBUaGUgY3VycmVudCBzY29wZVxuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5wdXNoQ29udGV4dCA9IGZ1bmN0aW9uKCkge1xuLy8gICB2YXIgc2NvcGUgPSBOYW1lc3BhY2VTY29wZSh0aGlzLmN1cnJlbnRTY29wZSk7XG4vLyAgIHRoaXMuc2NvcGVzLnB1c2goc2NvcGUpO1xuLy8gICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlO1xuLy8gICByZXR1cm4gc2NvcGU7XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIFBvcCBhIHNjb3BlIG91dCBvZiB0aGUgY29udGV4dFxuLy8gICogICBUaGUgcmVtb3ZlZCBzY29wZVxuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5wb3BDb250ZXh0ID0gZnVuY3Rpb24oKSB7XG4vLyAgIHZhciBzY29wZSA9IHRoaXMuc2NvcGVzLnBvcCgpO1xuLy8gICBpZiAoc2NvcGUpIHtcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlLnBhcmVudDtcbi8vICAgfSBlbHNlIHtcbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IG51bGw7XG4vLyAgIH1cbi8vICAgcmV0dXJuIHNjb3BlO1xuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBMb29rIHVwIHRoZSBuYW1lc3BhY2UgVVJJIGJ5IHByZWZpeFxuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XG4vLyAgKiAgIE5hbWVzcGFjZSBVUklcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUuZ2V0TmFtZXNwYWNlVVJJID0gZnVuY3Rpb24ocHJlZml4LCBsb2NhbE9ubHkpIHtcbi8vICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSk7XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIExvb2sgdXAgdGhlIG5hbWVzcGFjZSBwcmVmaXggYnkgVVJJXG4vLyAgKiBAcGFyYW0gIG5zVVJJIE5hbWVzcGFjZSBVUklcbi8vICAqIEBwYXJhbSAgW2xvY2FsT25seV0gU2VhcmNoIGN1cnJlbnQgc2NvcGUgb25seVxuLy8gICogICBOYW1lc3BhY2UgcHJlZml4XG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLmdldFByZWZpeCA9IGZ1bmN0aW9uKG5zVXJpLCBsb2NhbE9ubHkpIHtcbi8vICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldFByZWZpeChuc1VyaSwgbG9jYWxPbmx5KTtcbi8vIH07XG5cbi8vIC8qKlxuLy8gICogUmVnaXN0ZXIgYSBuYW1lc3BhY2Vcbi8vICAqIEBwYXJhbSAgbnNVcmkgTmFtZXNwYWNlIFVSSVxuLy8gICogICBUaGUgbWF0Y2hpbmcgb3IgZ2VuZXJhdGVkIG5hbWVzcGFjZSBwcmVmaXhcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUucmVnaXN0ZXJOYW1lc3BhY2UgPSBmdW5jdGlvbihuc1VyaSkge1xuLy8gICB2YXIgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgobnNVcmkpO1xuLy8gICBpZiAocHJlZml4KSB7XG4vLyAgICAgLy8gSWYgdGhlIG5hbWVzcGFjZSBoYXMgYWxyZWFkeSBtYXBwZWQgdG8gYSBwcmVmaXhcbi8vICAgICByZXR1cm4gcHJlZml4O1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIC8vIFRyeSB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBuYW1lc3BhY2Vcbi8vICAgICB3aGlsZSAodHJ1ZSkge1xuLy8gICAgICAgcHJlZml4ID0gJ25zJyArICgrK3RoaXMucHJlZml4Q291bnQpO1xuLy8gICAgICAgaWYgKCF0aGlzLmdldE5hbWVzcGFjZVVSSShwcmVmaXgpKSB7XG4vLyAgICAgICAgIC8vIFRoZSBwcmVmaXggaXMgbm90IHVzZWRcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIHRoaXMuYWRkTmFtZXNwYWNlKHByZWZpeCwgbnNVcmksIHRydWUpO1xuLy8gICByZXR1cm4gcHJlZml4O1xuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBEZWNsYXJlIGEgbmFtZXNwYWNlIHByZWZpeC91cmkgbWFwcGluZ1xuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXG4vLyAgKiAgIHRydWUgaWYgdGhlIGRlY2xhcmF0aW9uIGlzIGNyZWF0ZWRcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUuZGVjbGFyZU5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmkpIHtcbi8vICAgaWYgKHRoaXMuY3VycmVudFNjb3BlKSB7XG4vLyAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLmN1cnJlbnRTY29wZS5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XG4vLyAgICAgaWYgKG1hcHBpbmcgJiYgbWFwcGluZy51cmkgPT09IG5zVXJpICYmIG1hcHBpbmcuZGVjbGFyZWQpIHtcbi8vICAgICAgIHJldHVybiBmYWxzZTtcbi8vICAgICB9XG4vLyAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xuLy8gICAgICAgdXJpOiBuc1VyaSxcbi8vICAgICAgIHByZWZpeDogcHJlZml4LFxuLy8gICAgICAgZGVjbGFyZWQ6IHRydWVcbi8vICAgICB9O1xuLy8gICAgIHJldHVybiB0cnVlO1xuLy8gICB9XG4vLyAgIHJldHVybiBmYWxzZTtcbi8vIH07XG4iXX0=