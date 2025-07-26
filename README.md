# gscms – Google Sheets CMS Binding Library

**gscms** is a lightweight JavaScript library that binds data from a public Google Sheet directly into HTML using custom attributes. It supports:

* Single cell binding (`gs-bind`)
* Range binding (`gs-range`)
* Attribute binding (`gs-bind-*`)
* Repeating structures (`gs-for`)
* Conditional class logic (`gs-class-if`)

---

## 📦 Getting Started

### 1. Include the Script

```html
<script src="gscms.js"></script>
```

### 2. Initialize

```html
<script>
  gscms.init('YOUR_GOOGLE_SHEET_ID');
</script>
```

> The Google Sheet must be shared as **"Anyone with the link can view"**.

---

## 🔗 Bind Single Cell

Bind the content of a single cell:

```html
<div gs-bind="A2"></div>
```
Also, using global variables

```html
<div gs-bind="A[globalRowValue]"></div>
...

<script> let globalRowValue = 2 </script>
```

Bind a cell value to an attribute:

```html
<img gs-bind-src="B4" />
```
---

## 🔗 Bind Single Cell as HTML

Bind the content of a single cell:

```html
<div gs-hbind="A2"></div>
```
---

## 🔢 Bind a Range

Inject an entire range of values (e.g., as inner HTML):

```html
<p gs-range="A3:B7"></p>
```

---

## 🔁 Loops with `gs-for`

Use `gs-for` to repeat a template over a range:

```html
<ul gs-for="2:6 as row">
  <li>
    <strong gs-bind="A[row]"></strong> - <span gs-bind="B[row]"></span>
  </li>
</ul>
```

You can also use expressions:

```html
<ul gs-for="1:10 as i">
  <li gs-bind="A[i]"></li>
</ul>
```

Nested dynamic values are supported:

```html
<span gs-bind="A[row+1]"></span>
```

---

## 🎨 Conditional Classes

Apply conditional classes based on spreadsheet values:

### Basic Condition:

```html
<li gs-class-if="A[1] == 'red': text-red font-bold"></li>
```

### With Fallback (else):

```html
<li gs-class-if="A[3] == 'success': text-green font-bold | text-red font-semibold"></li>
```

---

## 🧠 Expression Interpolation

You can use expressions inside `[]`, e.g.:

```html
A[row+1], B[i-1], C[row*2]
```

These are dynamically evaluated with the loop context.

---

## 📋 Example Sheet

Imagine this Google Sheet:

```
| A       | B        |
|---------|----------|
| Product | Price    |
| Apple   | 1.20     |
| Banana  | 0.80     |
| Cherry  | 2.50     |
```

Then:

```html
<ul gs-for="2:4 as row">
  <li>
    <span gs-bind="A[row]"></span>:  <span gs-bind="B[row]"></span> €
  </li>
</ul>
```

Will render:

```html
<li>Apple: 1.20 €</li>
<li>Banana: 0.80 €</li>
<li>Cherry: 2.50 €</li>
```

---

## ✅ Best Practices

* Always ensure the sheet is public for reading.
* Avoid complex logic in HTML — keep expressions simple.
* Use meaningful column headers and consistent rows.

---

## 🧪 Testing and Debugging

* Open browser console to see any warnings.
* Use `console.log(sheet)` inside the script to inspect the fetched data.

---

## 📃 License

This software is free to use for personal, non-commercial projects.
For any commercial use (including within companies or monetized products), a commercial license must be purchased.
Contact research [at] trendydots.com for licensing options.

---

## ✨ Credits

Created to simplify no-code-like CMS functionality for static websites using Google Sheets as a backend.

By trendy dots https://github.com/trendydots
