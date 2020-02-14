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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnNjb250ZXh0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9uc2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQztBQUViO0lBR0Usd0JBQVksTUFBVztRQVF2QixvQkFBZSxHQUFHLFVBQVMsTUFBTSxFQUFFLFNBQVM7WUFDMUMsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLE9BQU8sc0NBQXNDLENBQUM7Z0JBQ2hELEtBQUssT0FBTztvQkFDVixPQUFPLCtCQUErQixDQUFDO2dCQUN6Qzs7d0JBQ00sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO29CQUNuQyxpQkFBaUI7b0JBQ2pCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTt3QkFDakIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDO3FCQUNsQjt5QkFBTSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ3BDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQzVDO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2FBQ0o7UUFDSCxDQUFDLENBQUE7UUFFRCx3QkFBbUIsR0FBRyxVQUFTLE1BQU07WUFDbkMsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLE9BQU87d0JBQ0wsR0FBRyxFQUFFLHNDQUFzQzt3QkFDM0MsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztnQkFDSixLQUFLLE9BQU87b0JBQ1YsT0FBTzt3QkFDTCxHQUFHLEVBQUUsK0JBQStCO3dCQUNwQyxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUUsSUFBSTtxQkFDZixDQUFDO2dCQUNKOzt3QkFDTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQ3JDLGlCQUFpQjtvQkFDakIsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO3dCQUNuQixPQUFPLE9BQU8sQ0FBQztxQkFDaEI7eUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUN0QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ2hEO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2FBQ0o7UUFDSCxDQUFDLENBQUE7UUFFRCxjQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUUsU0FBUztZQUNuQyxRQUFRLEtBQUssRUFBRTtnQkFDYixLQUFLLHNDQUFzQztvQkFDekMsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsS0FBSywrQkFBK0I7b0JBQ2xDLE9BQU8sT0FBTyxDQUFDO2dCQUNqQjtvQkFDRSxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQzdCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxFQUFFOzRCQUNwQyxPQUFPLENBQUMsQ0FBQzt5QkFDVjtxQkFDRjtvQkFDRCxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQzdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3JDO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2FBQ0o7UUFDSCxDQUFDLENBQUE7UUF2RUMsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLGNBQWMsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBbUVILHFCQUFDO0FBQUQsQ0FBQyxBQTVFRCxJQTRFQzs7OztJQTNFQyxnQ0FBWTs7SUFDWixvQ0FBZ0I7O0lBU2hCLHlDQWlCQzs7SUFFRCw2Q0F5QkM7O0lBRUQsbUNBa0JDOztBQUdIO0lBSUU7UUFTQSxpQkFBWSxHQUFHLFVBQVMsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTO1lBQzlDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssS0FBSyxFQUFFO2dCQUNyRCxPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDckMsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsTUFBTSxFQUFFLE1BQU07b0JBQ2QsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUM7Z0JBQ0YsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsZ0JBQVcsR0FBRzs7Z0JBQ1IsS0FBSyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUc7O2dCQUNQLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUM3QixJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFDbEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7YUFDMUI7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELG9CQUFlLEdBQUcsVUFBUyxNQUFNLEVBQUUsU0FBUztZQUMxQyxPQUFPLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQTtRQUVELGNBQVMsR0FBRyxVQUFTLEtBQUssRUFBRSxTQUFTO1lBQ25DLE9BQU8sSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUcsVUFBUyxLQUFLOztnQkFDNUIsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2xDLElBQUksTUFBTSxFQUFFO2dCQUNWLGtEQUFrRDtnQkFDbEQsT0FBTyxNQUFNLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxxQ0FBcUM7Z0JBQ3JDLE9BQU8sSUFBSSxFQUFFO29CQUNYLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQ2pDLHlCQUF5Qjt3QkFDekIsTUFBTTtxQkFDUDtpQkFDRjthQUNGO1lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHLFVBQVMsTUFBTSxFQUFFLEtBQUs7WUFDdkMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFOztvQkFDakIsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDO2dCQUMzRCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUN4RCxPQUFPLEtBQUssQ0FBQztpQkFDZDtnQkFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDckMsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsTUFBTSxFQUFFLE1BQU07b0JBQ2QsUUFBUSxFQUFFLElBQUk7aUJBQ2YsQ0FBQztnQkFDRixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUE7UUFqRkMsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLGdCQUFnQixDQUFDLEVBQUU7WUFDdkMsT0FBTyxJQUFJLGdCQUFnQixFQUFFLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQTRFSCx1QkFBQztBQUFELENBQUMsQUF2RkQsSUF1RkM7Ozs7SUF0RkMsa0NBQWM7O0lBQ2QsdUNBQW9COztJQVdwQix3Q0FhQzs7SUFFRCx1Q0FLQzs7SUFFRCxzQ0FRQzs7SUFFRCwyQ0FFQzs7SUFFRCxxQ0FFQzs7SUFFRCw2Q0FpQkM7O0lBRUQsNENBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VTY29wZSB7XG4gIHBhcmVudDogYW55O1xuICBuYW1lc3BhY2VzOiBhbnk7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogYW55KSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE5hbWVzcGFjZVNjb3BlKSkge1xuICAgICAgcmV0dXJuIG5ldyBOYW1lc3BhY2VTY29wZShwYXJlbnQpO1xuICAgIH1cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLm5hbWVzcGFjZXMgPSB7fTsgIFxuICB9XG5cbiAgZ2V0TmFtZXNwYWNlVVJJID0gZnVuY3Rpb24ocHJlZml4LCBsb2NhbE9ubHkpIHtcbiAgICBzd2l0Y2ggKHByZWZpeCkge1xuICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgcmV0dXJuICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xuICAgICAgY2FzZSAneG1sbnMnOlxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBuc1VyaSA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xuICAgICAgICAvKmpzaGludCAtVzExNiAqL1xuICAgICAgICBpZiAobnNVcmkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBuc1VyaS51cmk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VVUkkocHJlZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5hbWVzcGFjZU1hcHBpbmcgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICBzd2l0Y2ggKHByZWZpeCkge1xuICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1cmk6ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnLFxuICAgICAgICAgIHByZWZpeDogJ3htbCcsXG4gICAgICAgICAgZGVjbGFyZWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ3htbG5zJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1cmk6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycsXG4gICAgICAgICAgcHJlZml4OiAneG1sbnMnLFxuICAgICAgICAgIGRlY2xhcmVkOiB0cnVlXG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgbWFwcGluZyA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xuICAgICAgICAvKmpzaGludCAtVzExNiAqL1xuICAgICAgICBpZiAobWFwcGluZyAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcHBpbmc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TmFtZXNwYWNlTWFwcGluZyhwcmVmaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJlZml4ID0gZnVuY3Rpb24obnNVcmksIGxvY2FsT25seSkge1xuICAgIHN3aXRjaCAobnNVcmkpIHtcbiAgICAgIGNhc2UgJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc6XG4gICAgICAgIHJldHVybiAneG1sJztcbiAgICAgIGNhc2UgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJzpcbiAgICAgICAgcmV0dXJuICd4bWxucyc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBmb3IgKHZhciBwIGluIHRoaXMubmFtZXNwYWNlcykge1xuICAgICAgICAgIGlmICh0aGlzLm5hbWVzcGFjZXNbcF0udXJpID09PSBuc1VyaSkge1xuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghbG9jYWxPbmx5ICYmIHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFByZWZpeChuc1VyaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZUNvbnRleHQge1xuICBzY29wZXM6IGFueVtdO1xuICBwcmVmaXhDb3VudDogbnVtYmVyOyBcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTmFtZXNwYWNlQ29udGV4dCkpIHtcbiAgICAgIHJldHVybiBuZXcgTmFtZXNwYWNlQ29udGV4dCgpO1xuICAgIH1cbiAgICB0aGlzLnNjb3BlcyA9IFtdO1xuICAgIHRoaXMucHVzaENvbnRleHQoKTtcbiAgICB0aGlzLnByZWZpeENvdW50ID0gMDtcbiAgfVxuXG4gIGFkZE5hbWVzcGFjZSA9IGZ1bmN0aW9uKHByZWZpeCwgbnNVcmksIGxvY2FsT25seSkge1xuICAgIGlmICh0aGlzLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSkgPT09IG5zVXJpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xuICAgICAgdGhpcy5jdXJyZW50U2NvcGUubmFtZXNwYWNlc1twcmVmaXhdID0ge1xuICAgICAgICB1cmk6IG5zVXJpLFxuICAgICAgICBwcmVmaXg6IHByZWZpeCxcbiAgICAgICAgZGVjbGFyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1c2hDb250ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjb3BlID0gbmV3IE5hbWVzcGFjZVNjb3BlKHRoaXMuY3VycmVudFNjb3BlKTtcbiAgICB0aGlzLnNjb3Blcy5wdXNoKHNjb3BlKTtcbiAgICB0aGlzLmN1cnJlbnRTY29wZSA9IHNjb3BlO1xuICAgIHJldHVybiBzY29wZTtcbiAgfVxuXG4gIHBvcENvbnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NvcGUgPSB0aGlzLnNjb3Blcy5wb3AoKTtcbiAgICBpZiAoc2NvcGUpIHtcbiAgICAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGUucGFyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRTY29wZSA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzY29wZTtcbiAgfVxuXG4gIGdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSk7XG4gIH1cblxuICBnZXRQcmVmaXggPSBmdW5jdGlvbihuc1VyaSwgbG9jYWxPbmx5KSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFNjb3BlICYmIHRoaXMuY3VycmVudFNjb3BlLmdldFByZWZpeChuc1VyaSwgbG9jYWxPbmx5KTtcbiAgfVxuICBcbiAgcmVnaXN0ZXJOYW1lc3BhY2UgPSBmdW5jdGlvbihuc1VyaSkge1xuICAgIHZhciBwcmVmaXggPSB0aGlzLmdldFByZWZpeChuc1VyaSk7XG4gICAgaWYgKHByZWZpeCkge1xuICAgICAgLy8gSWYgdGhlIG5hbWVzcGFjZSBoYXMgYWxyZWFkeSBtYXBwZWQgdG8gYSBwcmVmaXhcbiAgICAgIHJldHVybiBwcmVmaXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRyeSB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBuYW1lc3BhY2VcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHByZWZpeCA9ICducycgKyAoKyt0aGlzLnByZWZpeENvdW50KTtcbiAgICAgICAgaWYgKCF0aGlzLmdldE5hbWVzcGFjZVVSSShwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVGhlIHByZWZpeCBpcyBub3QgdXNlZFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkTmFtZXNwYWNlKHByZWZpeCwgbnNVcmksIHRydWUpO1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cblxuICBkZWNsYXJlTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xuICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLmN1cnJlbnRTY29wZS5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XG4gICAgICBpZiAobWFwcGluZyAmJiBtYXBwaW5nLnVyaSA9PT0gbnNVcmkgJiYgbWFwcGluZy5kZWNsYXJlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XG4gICAgICAgIHVyaTogbnNVcmksXG4gICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICBkZWNsYXJlZDogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBTY29wZSBmb3IgWE1MIG5hbWVzcGFjZXNcbiAqIEBwYXJhbSBbcGFyZW50XSBQYXJlbnQgc2NvcGVcbiAqIFxuICovXG4vLyBleHBvcnQgZnVuY3Rpb24gTmFtZXNwYWNlU2NvcGUocGFyZW50KSB7XG4vLyAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOYW1lc3BhY2VTY29wZSkpIHtcbi8vICAgICByZXR1cm4gTmFtZXNwYWNlU2NvcGUocGFyZW50KTtcbi8vICAgfVxuLy8gICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbi8vICAgdGhpcy5uYW1lc3BhY2VzID0ge307XG4vLyB9XG5cbi8vIC8qKlxuLy8gICogTmFtZXNwYWNlIGNvbnRleHQgdGhhdCBtYW5hZ2VzIGhpZXJhcmNoaWNhbCBzY29wZXNcbi8vICAqICB7TmFtZXNwYWNlQ29udGV4dH1cbi8vICAqL1xuLy8gZXhwb3J0IGZ1bmN0aW9uIE5hbWVzcGFjZUNvbnRleHQoKSB7XG4vLyAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOYW1lc3BhY2VDb250ZXh0KSkge1xuLy8gICAgIHJldHVybiBOYW1lc3BhY2VDb250ZXh0KCk7XG4vLyAgIH1cbi8vICAgdGhpcy5zY29wZXMgPSBbXTtcbi8vICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuLy8gICB0aGlzLnByZWZpeENvdW50ID0gMDtcbi8vIH1cblxuLy8gLyoqXG4vLyAgKiBMb29rIHVwIHRoZSBuYW1lc3BhY2UgVVJJIGJ5IHByZWZpeFxuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XG4vLyAgKiAgIE5hbWVzcGFjZSBVUklcbi8vICAqL1xuLy8gTmFtZXNwYWNlU2NvcGUucHJvdG90eXBlLmdldE5hbWVzcGFjZVVSSSA9IGZ1bmN0aW9uKHByZWZpeCwgbG9jYWxPbmx5KSB7XG4vLyAgIHN3aXRjaCAocHJlZml4KSB7XG4vLyAgICAgY2FzZSAneG1sJzpcbi8vICAgICAgIHJldHVybiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcbi8vICAgICBjYXNlICd4bWxucyc6XG4vLyAgICAgICByZXR1cm4gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJztcbi8vICAgICBkZWZhdWx0OlxuLy8gICAgICAgdmFyIG5zVXJpID0gdGhpcy5uYW1lc3BhY2VzW3ByZWZpeF07XG4vLyAgICAgICAvKmpzaGludCAtVzExNiAqL1xuLy8gICAgICAgaWYgKG5zVXJpICE9IG51bGwpIHtcbi8vICAgICAgICAgcmV0dXJuIG5zVXJpLnVyaTtcbi8vICAgICAgIH0gZWxzZSBpZiAoIWxvY2FsT25seSAmJiB0aGlzLnBhcmVudCkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gbnVsbDtcbi8vICAgICAgIH1cbi8vICAgfVxuLy8gfTtcblxuLy8gTmFtZXNwYWNlU2NvcGUucHJvdG90eXBlLmdldE5hbWVzcGFjZU1hcHBpbmcgPSBmdW5jdGlvbihwcmVmaXgpIHtcbi8vICAgc3dpdGNoIChwcmVmaXgpIHtcbi8vICAgICBjYXNlICd4bWwnOlxuLy8gICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgdXJpOiAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJyxcbi8vICAgICAgICAgcHJlZml4OiAneG1sJyxcbi8vICAgICAgICAgZGVjbGFyZWQ6IHRydWVcbi8vICAgICAgIH07XG4vLyAgICAgY2FzZSAneG1sbnMnOlxuLy8gICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgdXJpOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nLFxuLy8gICAgICAgICBwcmVmaXg6ICd4bWxucycsXG4vLyAgICAgICAgIGRlY2xhcmVkOiB0cnVlXG4vLyAgICAgICB9O1xuLy8gICAgIGRlZmF1bHQ6XG4vLyAgICAgICB2YXIgbWFwcGluZyA9IHRoaXMubmFtZXNwYWNlc1twcmVmaXhdO1xuLy8gICAgICAgLypqc2hpbnQgLVcxMTYgKi9cbi8vICAgICAgIGlmIChtYXBwaW5nICE9IG51bGwpIHtcbi8vICAgICAgICAgcmV0dXJuIG1hcHBpbmc7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50KSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXROYW1lc3BhY2VNYXBwaW5nKHByZWZpeCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gbnVsbDtcbi8vICAgICAgIH1cbi8vICAgfVxuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBMb29rIHVwIHRoZSBuYW1lc3BhY2UgcHJlZml4IGJ5IFVSSVxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcbi8vICAqICAgTmFtZXNwYWNlIHByZWZpeFxuLy8gICovXG4vLyBOYW1lc3BhY2VTY29wZS5wcm90b3R5cGUuZ2V0UHJlZml4ID0gZnVuY3Rpb24obnNVcmksIGxvY2FsT25seSkge1xuLy8gICBzd2l0Y2ggKG5zVXJpKSB7XG4vLyAgICAgY2FzZSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJzpcbi8vICAgICAgIHJldHVybiAneG1sJztcbi8vICAgICBjYXNlICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc6XG4vLyAgICAgICByZXR1cm4gJ3htbG5zJztcbi8vICAgICBkZWZhdWx0OlxuLy8gICAgICAgZm9yICh2YXIgcCBpbiB0aGlzLm5hbWVzcGFjZXMpIHtcbi8vICAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlc1twXS51cmkgPT09IG5zVXJpKSB7XG4vLyAgICAgICAgICAgcmV0dXJuIHA7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIGlmICghbG9jYWxPbmx5ICYmIHRoaXMucGFyZW50KSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRQcmVmaXgobnNVcmkpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgcmV0dXJuIG51bGw7XG4vLyAgICAgICB9XG4vLyAgIH1cbi8vIH07XG5cbi8vIC8qKlxuLy8gICogQWRkIGEgcHJlZml4L1VSSSBuYW1lc3BhY2UgbWFwcGluZ1xuLy8gICogQHBhcmFtICBwcmVmaXggTmFtZXNwYWNlIHByZWZpeFxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcbi8vICAqICB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgbWFwcGluZyBpcyBhZGRlZCBvciBmYWxzZSBpZiB0aGUgbWFwcGluZ1xuLy8gICogYWxyZWFkeSBleGlzdHNcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUuYWRkTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSwgbG9jYWxPbmx5KSB7XG4vLyAgIGlmICh0aGlzLmdldE5hbWVzcGFjZVVSSShwcmVmaXgsIGxvY2FsT25seSkgPT09IG5zVXJpKSB7XG4vLyAgICAgcmV0dXJuIGZhbHNlO1xuLy8gICB9XG4vLyAgIGlmICh0aGlzLmN1cnJlbnRTY29wZSkge1xuLy8gICAgIHRoaXMuY3VycmVudFNjb3BlLm5hbWVzcGFjZXNbcHJlZml4XSA9IHtcbi8vICAgICAgIHVyaTogbnNVcmksXG4vLyAgICAgICBwcmVmaXg6IHByZWZpeCxcbi8vICAgICAgIGRlY2xhcmVkOiBmYWxzZVxuLy8gICAgIH07XG4vLyAgICAgcmV0dXJuIHRydWU7XG4vLyAgIH1cbi8vICAgcmV0dXJuIGZhbHNlO1xuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBQdXNoIGEgc2NvcGUgaW50byB0aGUgY29udGV4dFxuLy8gICogIFRoZSBjdXJyZW50IHNjb3BlXG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLnB1c2hDb250ZXh0ID0gZnVuY3Rpb24oKSB7XG4vLyAgIHZhciBzY29wZSA9IE5hbWVzcGFjZVNjb3BlKHRoaXMuY3VycmVudFNjb3BlKTtcbi8vICAgdGhpcy5zY29wZXMucHVzaChzY29wZSk7XG4vLyAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGU7XG4vLyAgIHJldHVybiBzY29wZTtcbi8vIH07XG5cbi8vIC8qKlxuLy8gICogUG9wIGEgc2NvcGUgb3V0IG9mIHRoZSBjb250ZXh0XG4vLyAgKiAgIFRoZSByZW1vdmVkIHNjb3BlXG4vLyAgKi9cbi8vIE5hbWVzcGFjZUNvbnRleHQucHJvdG90eXBlLnBvcENvbnRleHQgPSBmdW5jdGlvbigpIHtcbi8vICAgdmFyIHNjb3BlID0gdGhpcy5zY29wZXMucG9wKCk7XG4vLyAgIGlmIChzY29wZSkge1xuLy8gICAgIHRoaXMuY3VycmVudFNjb3BlID0gc2NvcGUucGFyZW50O1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIHRoaXMuY3VycmVudFNjb3BlID0gbnVsbDtcbi8vICAgfVxuLy8gICByZXR1cm4gc2NvcGU7XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIExvb2sgdXAgdGhlIG5hbWVzcGFjZSBVUkkgYnkgcHJlZml4XG4vLyAgKiBAcGFyYW0gIHByZWZpeCBOYW1lc3BhY2UgcHJlZml4XG4vLyAgKiBAcGFyYW0gIFtsb2NhbE9ubHldIFNlYXJjaCBjdXJyZW50IHNjb3BlIG9ubHlcbi8vICAqICAgTmFtZXNwYWNlIFVSSVxuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5nZXROYW1lc3BhY2VVUkkgPSBmdW5jdGlvbihwcmVmaXgsIGxvY2FsT25seSkge1xuLy8gICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCwgbG9jYWxPbmx5KTtcbi8vIH07XG5cbi8vIC8qKlxuLy8gICogTG9vayB1cCB0aGUgbmFtZXNwYWNlIHByZWZpeCBieSBVUklcbi8vICAqIEBwYXJhbSAgbnNVUkkgTmFtZXNwYWNlIFVSSVxuLy8gICogQHBhcmFtICBbbG9jYWxPbmx5XSBTZWFyY2ggY3VycmVudCBzY29wZSBvbmx5XG4vLyAgKiAgIE5hbWVzcGFjZSBwcmVmaXhcbi8vICAqL1xuLy8gTmFtZXNwYWNlQ29udGV4dC5wcm90b3R5cGUuZ2V0UHJlZml4ID0gZnVuY3Rpb24obnNVcmksIGxvY2FsT25seSkge1xuLy8gICByZXR1cm4gdGhpcy5jdXJyZW50U2NvcGUgJiYgdGhpcy5jdXJyZW50U2NvcGUuZ2V0UHJlZml4KG5zVXJpLCBsb2NhbE9ubHkpO1xuLy8gfTtcblxuLy8gLyoqXG4vLyAgKiBSZWdpc3RlciBhIG5hbWVzcGFjZVxuLy8gICogQHBhcmFtICBuc1VyaSBOYW1lc3BhY2UgVVJJXG4vLyAgKiAgIFRoZSBtYXRjaGluZyBvciBnZW5lcmF0ZWQgbmFtZXNwYWNlIHByZWZpeFxuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5yZWdpc3Rlck5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5zVXJpKSB7XG4vLyAgIHZhciBwcmVmaXggPSB0aGlzLmdldFByZWZpeChuc1VyaSk7XG4vLyAgIGlmIChwcmVmaXgpIHtcbi8vICAgICAvLyBJZiB0aGUgbmFtZXNwYWNlIGhhcyBhbHJlYWR5IG1hcHBlZCB0byBhIHByZWZpeFxuLy8gICAgIHJldHVybiBwcmVmaXg7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgLy8gVHJ5IHRvIGdlbmVyYXRlIGEgdW5pcXVlIG5hbWVzcGFjZVxuLy8gICAgIHdoaWxlICh0cnVlKSB7XG4vLyAgICAgICBwcmVmaXggPSAnbnMnICsgKCsrdGhpcy5wcmVmaXhDb3VudCk7XG4vLyAgICAgICBpZiAoIXRoaXMuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCkpIHtcbi8vICAgICAgICAgLy8gVGhlIHByZWZpeCBpcyBub3QgdXNlZFxuLy8gICAgICAgICBicmVhaztcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cbi8vICAgdGhpcy5hZGROYW1lc3BhY2UocHJlZml4LCBuc1VyaSwgdHJ1ZSk7XG4vLyAgIHJldHVybiBwcmVmaXg7XG4vLyB9O1xuXG4vLyAvKipcbi8vICAqIERlY2xhcmUgYSBuYW1lc3BhY2UgcHJlZml4L3VyaSBtYXBwaW5nXG4vLyAgKiBAcGFyYW0gIHByZWZpeCBOYW1lc3BhY2UgcHJlZml4XG4vLyAgKiBAcGFyYW0gIG5zVXJpIE5hbWVzcGFjZSBVUklcbi8vICAqICAgdHJ1ZSBpZiB0aGUgZGVjbGFyYXRpb24gaXMgY3JlYXRlZFxuLy8gICovXG4vLyBOYW1lc3BhY2VDb250ZXh0LnByb3RvdHlwZS5kZWNsYXJlTmFtZXNwYWNlID0gZnVuY3Rpb24ocHJlZml4LCBuc1VyaSkge1xuLy8gICBpZiAodGhpcy5jdXJyZW50U2NvcGUpIHtcbi8vICAgICB2YXIgbWFwcGluZyA9IHRoaXMuY3VycmVudFNjb3BlLmdldE5hbWVzcGFjZU1hcHBpbmcocHJlZml4KTtcbi8vICAgICBpZiAobWFwcGluZyAmJiBtYXBwaW5nLnVyaSA9PT0gbnNVcmkgJiYgbWFwcGluZy5kZWNsYXJlZCkge1xuLy8gICAgICAgcmV0dXJuIGZhbHNlO1xuLy8gICAgIH1cbi8vICAgICB0aGlzLmN1cnJlbnRTY29wZS5uYW1lc3BhY2VzW3ByZWZpeF0gPSB7XG4vLyAgICAgICB1cmk6IG5zVXJpLFxuLy8gICAgICAgcHJlZml4OiBwcmVmaXgsXG4vLyAgICAgICBkZWNsYXJlZDogdHJ1ZVxuLy8gICAgIH07XG4vLyAgICAgcmV0dXJuIHRydWU7XG4vLyAgIH1cbi8vICAgcmV0dXJuIGZhbHNlO1xuLy8gfTtcbiJdfQ==