/*!
 * gscms.js v1.0.0
 * 
 * License:
 * This software is free for personal, non-commercial use.
 * *
 * For any commercial use (including within businesses or monetized products),
 * a commercial license is required. Contact research@trendydots.com for details.
 *
 * © 2025 trendy dots
 */

const gscms = (function () {
    let sheetData = [];

    function A1toIndex(a1) {
        const colMatch = a1.match(/[A-Z]+/);
        const rowMatch = a1.match(/[0-9]+/);
        if (!colMatch || !rowMatch) return [null, null];
        const col = colMatch[0];
        const row = parseInt(rowMatch[0], 10);
        let colNum = 0;
        for (let i = 0; i < col.length; i++) {
            colNum = colNum * 26 + (col.charCodeAt(i) - 64);
        }
        return [row - 1, colNum - 1];
    }

    function getCellValue(ref, context = {}) {
        if (ref.includes("[")) {
            ref = ref.replace(/\[([^\]]+)\]/g, (_, expr) => {
                try {
                    const fn = new Function(...Object.keys(context), `return ${expr}`);
                    return fn(...Object.values(context));
                } catch {
                    return '';
                }
            });
        }
        const [r, c] = A1toIndex(ref);
        if (r === null || c === null || !sheetData[r]) return '';
        return sheetData[r][c] || '';
    }

    function processBindings(el, context = {}) {
        if (el.hasAttribute('gs-hbind')) {
            console.log('yep')
            const htmlData = getCellValue(el.getAttribute('gs-hbind'), context);
            el.innerHTML = htmlData
            console.dir(htmlData)
        }

        if (el.hasAttribute('gs-bind')) {
            el.textContent = getCellValue(el.getAttribute('gs-bind'), context);
        }

        Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('gs-bind-')) {
                const targetAttr = attr.name.replace('gs-bind-', '');
                el.setAttribute(targetAttr, getCellValue(attr.value, context));
            }
        });

        if (el.hasAttribute('gs-range')) {
            const [start, end] = el.getAttribute('gs-range').split(':');
            const [r1, c1] = A1toIndex(start);
            const [r2, c2] = A1toIndex(end);
            let html = '<table>';
            for (let r = r1; r <= r2; r++) {
                html += '<tr>';
                for (let c = c1; c <= c2; c++) {
                    html += `<td>${sheetData[r]?.[c] || ''}</td>`;
                }
                html += '</tr>';
            }
            html += '</table>';
            el.innerHTML = html;
        }

        el.querySelectorAll('[gs-class-if]').forEach(classEl => {
            const expr = classEl.getAttribute('gs-class-if');
            const [cond, thenElse] = expr.split(':').map(s => s.trim());
            const [thenClasses, elseClasses = ''] = thenElse.split('|').map(s => s.trim());

            let condition = cond.replace(/([A-Z]+\[[^\]]+\])/g, match => {
                return '`' + getCellValue(match, context) + '`';
            });

            let result = false;
            try {
                const fn = new Function(...Object.keys(context), `return ${condition}`);
                result = fn(...Object.values(context));
            } catch (e) {
                console.warn('gs-class-if error:', e);
            }

            if (result) {
                classEl.classList.add(...(thenClasses || '').split(/\s+/));
            } else if (elseClasses) {
                classEl.classList.add(...elseClasses.split(/\s+/));
            }
        });

        el.querySelectorAll('[gs-if]').forEach(element => {
            const expr = element.getAttribute('gs-if');
            const [cond, thenElse] = expr.split(':').map(s => s.trim());

            let condition = cond.replace(/([A-Z]+\[[^\]]+\])/g, match => {
                return '`' + getCellValue(match, context) + '`';
            });

            let result = false;
            try {
                const fn = new Function(...Object.keys(context), `return ${condition}`);
                result = fn(...Object.values(context));
            } catch (e) {
                console.warn('gs-if error:', e);
            }

            if (!result) {
                element.style.display = 'none';
            } 
        });
    }

    function processLoop(el, context = {}) {
        const attr = el.getAttribute('gs-for');
        const [range, varName] = attr.split(' as ').map(s => s.trim());
        const [start, end] = range.split(':').map(n => parseInt(n, 10));

        const children = Array.from(el.children);
        const parent = el;
        parent.innerHTML = '';

        for (let i = start; i <= end; i++) {
            const newContext = { ...context };
            newContext[varName] = i;
            children.forEach(child => {
                const clone = child.cloneNode(true);
                parent.appendChild(clone);
                processElement(clone, newContext);
            });
        }
    }

    function processElement(el, context = {}) {
        if (el.hasAttribute('gs-for')) {
            processLoop(el, context);
        } else {
            processBindings(el, context);
            el.querySelectorAll('*').forEach(child => processElement(child, context));
        }
    }

    async function init(sheetId) {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const cols = json.table.cols.length;

        // include header row
        sheetData = [json.table.cols.map(col => col.label || '')];
        json.table.rows.forEach(r => {
            const row = new Array(cols).fill('');
            if (r.c) {
                r.c.forEach((cell, i) => {
                    if (cell && 'v' in cell) row[i] = cell.v;
                });
            }
            sheetData.push(row);
        });

        document.querySelectorAll('[gs-for], [gs-bind], [gs-hbind], [gs-bind-src], [gs-range], [gs-if]').forEach(el => {
            processElement(el);
        });
    }

    return { init };
})();
