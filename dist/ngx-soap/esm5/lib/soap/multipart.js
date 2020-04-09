/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var Multipart = /** @class */ (function () {
    function Multipart() {
        this.preambleCRLF = true;
        this.postambleCRLF = true;
    }
    /**
     * @param {?} parts
     * @param {?} boundary
     * @return {?}
     */
    Multipart.prototype.build = /**
     * @param {?} parts
     * @param {?} boundary
     * @return {?}
     */
    function (parts, boundary) {
        /** @type {?} */
        var body = [];
        /**
         * @param {?} part
         * @return {?}
         */
        function add(part) {
            if (typeof part === 'number') {
                part = part.toString();
            }
            return body.push(part);
        }
        if (this.preambleCRLF) {
            add('\r\n');
        }
        parts.forEach(function (part) {
            /** @type {?} */
            var preamble = '--' + boundary + '\r\n';
            Object.keys(part).forEach(function (key) {
                if (key === 'body') {
                    return;
                }
                preamble += key + ': ' + part[key] + '\r\n';
            });
            preamble += '\r\n';
            add(preamble);
            add(part.body);
            add('\r\n');
        });
        add('--' + boundary + '--');
        if (this.postambleCRLF) {
            add('\r\n');
        }
        /** @type {?} */
        var size = body.map(function (part) {
            if (typeof part === 'string') {
                return part.length;
            }
            else {
                return part.byteLength;
            }
        }).reduce(function (a, b) { return a + b; }, 0);
        /** @type {?} */
        var uint8array = new Uint8Array(size);
        /** @type {?} */
        var i = 0;
        body.forEach(function (part) {
            if (typeof part === 'string') {
                for (var j = 0; j < part.length; i++, j++) {
                    uint8array[i] = part.charCodeAt(j) & 0xff;
                }
            }
            else {
                for (var j = 0; j < part.byteLength; i++, j++) {
                    uint8array[i] = part[j];
                }
            }
        });
        return uint8array.buffer;
    };
    return Multipart;
}());
export { Multipart };
if (false) {
    /** @type {?} */
    Multipart.prototype.preambleCRLF;
    /** @type {?} */
    Multipart.prototype.postambleCRLF;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwYXJ0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9tdWx0aXBhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0lBQUE7UUFDRSxpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixrQkFBYSxHQUFHLElBQUksQ0FBQztJQXlEdkIsQ0FBQzs7Ozs7O0lBdkRDLHlCQUFLOzs7OztJQUFMLFVBQU0sS0FBSyxFQUFFLFFBQVE7O1lBQ2IsSUFBSSxHQUFHLEVBQUU7Ozs7O1FBRWYsU0FBUyxHQUFHLENBQUUsSUFBSTtZQUNoQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUN4QjtZQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4QixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNaO1FBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7O2dCQUN0QixRQUFRLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxNQUFNO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRztnQkFDckMsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO29CQUFFLE9BQU07aUJBQUU7Z0JBQzlCLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUE7WUFDN0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxRQUFRLElBQUksTUFBTSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDYjs7WUFFSyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7WUFDekIsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTthQUNuQjtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDeEI7UUFDSCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxHQUFHLENBQUMsRUFBTCxDQUFLLEVBQUUsQ0FBQyxDQUFDOztZQUV6QixVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDOztZQUNqQyxDQUFDLEdBQUcsQ0FBQztRQUNULElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2hCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUMzQzthQUNGO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3QyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDM0IsQ0FBQztJQUVILGdCQUFDO0FBQUQsQ0FBQyxBQTNERCxJQTJEQzs7OztJQTFEQyxpQ0FBb0I7O0lBQ3BCLGtDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBNdWx0aXBhcnQgIHtcclxuICBwcmVhbWJsZUNSTEYgPSB0cnVlO1xyXG4gIHBvc3RhbWJsZUNSTEYgPSB0cnVlO1xyXG5cclxuICBidWlsZChwYXJ0cywgYm91bmRhcnkpIHtcclxuICAgIGNvbnN0IGJvZHkgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGQgKHBhcnQpIHtcclxuICAgICAgaWYgKHR5cGVvZiBwYXJ0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHBhcnQgPSBwYXJ0LnRvU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJvZHkucHVzaChwYXJ0KVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnByZWFtYmxlQ1JMRikge1xyXG4gICAgICBhZGQoJ1xcclxcbicpXHJcbiAgICB9XHJcblxyXG4gICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xyXG4gICAgICBsZXQgcHJlYW1ibGUgPSAnLS0nICsgYm91bmRhcnkgKyAnXFxyXFxuJztcclxuICAgICAgT2JqZWN0LmtleXMocGFydCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgaWYgKGtleSA9PT0gJ2JvZHknKSB7IHJldHVybiB9XHJcbiAgICAgICAgcHJlYW1ibGUgKz0ga2V5ICsgJzogJyArIHBhcnRba2V5XSArICdcXHJcXG4nXHJcbiAgICAgIH0pO1xyXG4gICAgICBwcmVhbWJsZSArPSAnXFxyXFxuJztcclxuICAgICAgYWRkKHByZWFtYmxlKTtcclxuICAgICAgYWRkKHBhcnQuYm9keSk7XHJcbiAgICAgIGFkZCgnXFxyXFxuJyk7XHJcbiAgICB9KTtcclxuICAgIGFkZCgnLS0nICsgYm91bmRhcnkgKyAnLS0nKTtcclxuXHJcbiAgICBpZiAodGhpcy5wb3N0YW1ibGVDUkxGKSB7XHJcbiAgICAgIGFkZCgnXFxyXFxuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2l6ZSA9IGJvZHkubWFwKChwYXJ0KSA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgcGFydCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gcGFydC5sZW5ndGhcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gcGFydC5ieXRlTGVuZ3RoO1xyXG4gICAgICB9XHJcbiAgICB9KS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuXHJcbiAgICBsZXQgdWludDhhcnJheSA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgYm9keS5mb3JFYWNoKChwYXJ0KSA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgcGFydCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnQubGVuZ3RoOyBpKyssIGorKykge1xyXG4gICAgICAgICAgdWludDhhcnJheVtpXSA9IHBhcnQuY2hhckNvZGVBdChqKSAmIDB4ZmY7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydC5ieXRlTGVuZ3RoOyBpKyssIGorKykge1xyXG4gICAgICAgICAgdWludDhhcnJheVtpXSA9IHBhcnRbal07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB1aW50OGFycmF5LmJ1ZmZlcjtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==