# gscms – Google Sheets CMS Binding Library

**gscms** is a lightweight JavaScript library that binds data from a public Google Sheet directly into HTML using custom attributes. It supports:

* Single cell binding (`gscms-bind`)
* Range binding (`gscms-range`)
* Attribute binding (`gscms-bind-*`)
* Repeating structures (`gscms-for`)
* Conditional class logic (`gscms-class-if`)

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
<div gscms-bind="A2"></div>
```

Bind a cell value to an attribute:

```html
<img gscms-bind-src="B4" />
```
---

## 🔗 Bind Single Cell as HTML

Bind the content of a single cell:

```html
<div gscms-hbind="A2"></div>
```
---

## 🔢 Bind a Range

Inject an entire range of values (e.g., as inner HTML):

```html
<p gscms-range="A3:B7"></p>
```

---

## 🔁 Loops with `gscms-for`

Use `gscms-for` to repeat a template over a range:

```html
<ul gscms-for="2:6 as row">
  <li>
    <strong gscms-bind="A[row]"></strong> - <span gscms-bind="B[row]"></span>
  </li>
</ul>
```

You can also use expressions:

```html
<ul gscms-for="1:10 as i">
  <li gscms-bind="A[i]"></li>
</ul>
```

Nested dynamic values are supported:

```html
<span gscms-bind="A[row+1]"></span>
```

---

## 🎨 Conditional Classes

Apply conditional classes based on spreadsheet values:

### Basic Condition:

```html
<li gscms-class-if="A[row] == 'red': text-red font-bold"></li>
```

### With Fallback (else):

```html
<li gscms-class-if="A[3] == 'success': text-green font-bold | text-red font-semibold"></li>
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
<ul gscms-for="2:4 as row">
  <li>
    <span gscms-bind="A[row]"></span>:
    <span gscms-bind="B[row]"></span> €
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
