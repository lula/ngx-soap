/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class Multipart {
    constructor() {
        this.preambleCRLF = true;
        this.postambleCRLF = true;
    }
    /**
     * @param {?} parts
     * @param {?} boundary
     * @return {?}
     */
    build(parts, boundary) {
        /** @type {?} */
        const body = [];
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
            let preamble = '--' + boundary + '\r\n';
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
        const size = body.map((part) => {
            if (typeof part === 'string') {
                return part.length;
            }
            else {
                return part.byteLength;
            }
        }).reduce((a, b) => a + b, 0);
        /** @type {?} */
        let uint8array = new Uint8Array(size);
        /** @type {?} */
        let i = 0;
        body.forEach((part) => {
            if (typeof part === 'string') {
                for (let j = 0; j < part.length; i++, j++) {
                    uint8array[i] = part.charCodeAt(j) & 0xff;
                }
            }
            else {
                for (let j = 0; j < part.byteLength; i++, j++) {
                    uint8array[i] = part[j];
                }
            }
        });
        return uint8array.buffer;
    }
}
if (false) {
    /** @type {?} */
    Multipart.prototype.preambleCRLF;
    /** @type {?} */
    Multipart.prototype.postambleCRLF;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwYXJ0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9tdWx0aXBhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQXRCO1FBQ0UsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsa0JBQWEsR0FBRyxJQUFJLENBQUM7SUF5RHZCLENBQUM7Ozs7OztJQXZEQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVE7O2NBQ2IsSUFBSSxHQUFHLEVBQUU7Ozs7O1FBRWYsU0FBUyxHQUFHLENBQUUsSUFBSTtZQUNoQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUN4QjtZQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4QixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNaO1FBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7O2dCQUN0QixRQUFRLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxNQUFNO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRztnQkFDckMsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO29CQUFFLE9BQU07aUJBQUU7Z0JBQzlCLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUE7WUFDN0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxRQUFRLElBQUksTUFBTSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDYjs7Y0FFSyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzdCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7YUFDbkI7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7O1lBRXpCLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUM7O1lBQ2pDLENBQUMsR0FBRyxDQUFDO1FBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3BCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUMzQzthQUNGO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3QyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDM0IsQ0FBQztDQUVGOzs7SUExREMsaUNBQW9COztJQUNwQixrQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgTXVsdGlwYXJ0ICB7XG4gIHByZWFtYmxlQ1JMRiA9IHRydWU7XG4gIHBvc3RhbWJsZUNSTEYgPSB0cnVlO1xuXG4gIGJ1aWxkKHBhcnRzLCBib3VuZGFyeSkge1xuICAgIGNvbnN0IGJvZHkgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGFkZCAocGFydCkge1xuICAgICAgaWYgKHR5cGVvZiBwYXJ0ID09PSAnbnVtYmVyJykge1xuICAgICAgICBwYXJ0ID0gcGFydC50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJvZHkucHVzaChwYXJ0KVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByZWFtYmxlQ1JMRikge1xuICAgICAgYWRkKCdcXHJcXG4nKVxuICAgIH1cblxuICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgIGxldCBwcmVhbWJsZSA9ICctLScgKyBib3VuZGFyeSArICdcXHJcXG4nO1xuICAgICAgT2JqZWN0LmtleXMocGFydCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdib2R5JykgeyByZXR1cm4gfVxuICAgICAgICBwcmVhbWJsZSArPSBrZXkgKyAnOiAnICsgcGFydFtrZXldICsgJ1xcclxcbidcbiAgICAgIH0pO1xuICAgICAgcHJlYW1ibGUgKz0gJ1xcclxcbic7XG4gICAgICBhZGQocHJlYW1ibGUpO1xuICAgICAgYWRkKHBhcnQuYm9keSk7XG4gICAgICBhZGQoJ1xcclxcbicpO1xuICAgIH0pO1xuICAgIGFkZCgnLS0nICsgYm91bmRhcnkgKyAnLS0nKTtcblxuICAgIGlmICh0aGlzLnBvc3RhbWJsZUNSTEYpIHtcbiAgICAgIGFkZCgnXFxyXFxuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZSA9IGJvZHkubWFwKChwYXJ0KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHBhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJ0Lmxlbmd0aFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnQuYnl0ZUxlbmd0aDtcbiAgICAgIH1cbiAgICB9KS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcblxuICAgIGxldCB1aW50OGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgbGV0IGkgPSAwO1xuICAgIGJvZHkuZm9yRWFjaCgocGFydCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBwYXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnQubGVuZ3RoOyBpKyssIGorKykge1xuICAgICAgICAgIHVpbnQ4YXJyYXlbaV0gPSBwYXJ0LmNoYXJDb2RlQXQoaikgJiAweGZmO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnQuYnl0ZUxlbmd0aDsgaSsrLCBqKyspIHtcbiAgICAgICAgICB1aW50OGFycmF5W2ldID0gcGFydFtqXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1aW50OGFycmF5LmJ1ZmZlcjtcbiAgfVxuXG59XG4iXX0=