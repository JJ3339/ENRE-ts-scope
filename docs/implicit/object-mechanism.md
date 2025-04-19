## Object Mechanism

The fundamental structure of JavaScript objects.

### Supported Patterns

```yaml
name: Implicit object mechanism
```

<!--pycg:dicts/update unsupported-->
<!--pycg:lists/comprehension_if explicit-->
<!--pycg:lists/comprehension_val explicit-->
<!--pycg:lists/nested_comprehension explicit-->
<!--pycg:lists/slice unsupported-->

#### Semantic: Callables

##### Examples

###### Function replacement

```js
function foo() {
    /* Empty */
}

foo.bar = () => {
    /* Empty */
}

foo();
foo.bar();

foo = function () {
    /* Empty */
}

foo();
foo.bar();          // JSError: foo.bar is not a function.
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'foo'
            loc: 9:1
        -   from: file:'<File file0.js>'
            to: function:'<Anon ArrowFunction>'[@loc=5]
            loc: 10:5:3
            by: ~
        -   from: file:'<File file0.js>'
            to: function:'<Anon Function>'[@loc=12]
            loc: 16:1:3
            # FIXME: Should call to original entity exist?
            by: function:'foo'
        -   from: file:'<File file0.js>'
            to: function:'<Anon Function>'[@loc=5]
            loc: 17:5:3
            by: ~
            negative: true
```

###### Function object

```js
function bar() {
    /* Empty */
}

function foo() {
    /* Empty */
}

foo.a = bar;

const {a} = foo;

a();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'bar'
            loc: 13:1:1
            by: variable:'a'
```

#### Semantic: Object Literal

##### Examples

###### Add property

<!--pycg:dicts/add_key-->

```js
function func() {
    /* Empty */
}

const d = {};

d["b"] = func;
d["b"]();
d.b();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func'
            loc: 8:1:6
            by: ~
        -   from: file:'<File file0.js>'
            to: function:'func'
            loc: 9:3:1
            by: ~
```

###### Assign

<!--pycg:dicts/assign-->
<!--pycg:dicts/call-->

```js
function func1() {
    /* Empty */
}

function func2() {
    /* Empty */
}

const d = {
    a: func1,
};

d.a();

d.a = func2;

d.a();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 13:3:1
            by: ~
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 13:3:1
            # Flow sensitive
            negative: true
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 17:3:1
            # Flow sensitive
            negative: true
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 17:3:1
            by: ~
```

###### Dynamic property

<!--pycg:dicts/ext_key-->

```js
export const prop = "a";  
```

```js
import {prop} from "./file0";

function func() {
    /* Empty */
}

const d = {
    a: func,
};

d[prop]();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file1.js>'
            to: function:'func'
            loc: file1:11:1:7
            by: ~
```

###### Nested

<!--pycg:dicts/nested-->

```ts
function func1() {
    /* Empty */
}

function func2() {
    /* Empty */
}

const d = {
    a: {
        b: func1,
    },
};

d.a.b = func2;
d.a.b();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.ts>'
            to: function:'func2'
            loc: 16:1:5
            by: ~
```

###### Param + New key param

<!--pycg:dicts/param-->
<!--pycg:dicts/new_key_param-->
<!--pycg:dicts/param_key-->

```js
function func2() {
    /* Empty */
}

function func(d, key = 'a') {
    d[key] = func2;
}

const d = {};

func(d);
d.a();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func'
            loc: 11:1
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 12:1:3
            by: ~
```

###### Return object

<!--pycg:dicts/return-->

```js
function func2() {
    /* Empty */
}

function func1() {
    const d = {a: func2}
    return d;
}

const b = func1();
b.a();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 10:11
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 11:3:1
            by: ~
```

###### Return assign

<!--pycg:dicts/return_assign-->

```js
function func2() {
    /* Empty */
}

function func1() {
    return func2;
}

const d = {
    a: func1(),
};

d.a();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 10:8
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 13:1:3
            by: ~       
```

###### Type Coercion

<!--pycg:dicts/type_coercion-->

```js
function func1() {
    /* Empty */
}

function func2() {
    /* Empty */
}

const d = {
    "1": func1,
    1: func2,           // Numeric key is firstly evaluated to string, thus override the previous line
};

d[1]();                 // func2
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 14:1:4
            by: ~
```

#### Semantic: Array Literal

##### Examples

###### Basic

<!--pycg:lists/simple-->

```js
function func1() {
    /* Empty */
}

function func2() {
    /* Empty */
}

function func3() {
    /* Empty */
}

const a = [func1, func2];

a[0]();
a[1]();

const b = [];
b[0] = func3;

b[0]();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 15:1:4
            by: ~
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 16:1:4
            by: ~
        -   from: file:'<File file0.js>'
            to: function:'func3'
            loc: 21:1:4
            by: ~
```

###### Dynamic key

<!--pycg:lists/ext_index-->

```js
export const key = 1;
```

```js
import {key} from 'file0.js';

function func1() {
    /* Empty */
}

function func2() {
    /* Empty */
}

const arr = [func1, func2];

arr[key]();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file1.js>'
            to: function:'func2'
            loc: file1:13:1:8
            by: ~
```

###### Nested arrays

<!--pycg:lists/nested-->

```js
function func1() {
    /* Empty */
}

function func2() {
    /* Empty */
}

const arr = [[func1], func2]

arr[0][0]();
```

```yaml
relation:
    type: call
    extra: false
    items:
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 11:1:9
            by: ~
```

###### Constant parameter

<!--pycg:lists/param_index-->

```js
function func2() {
    /* Empty */
}

function func1(key) {
    arr[key]();
}

const arr = [func1, func2];

func1(1);
```

```yaml
relation:
    type: call
    items:
        -   from: file:'<File file0.js>'
            to: function:'func1'
            loc: 11:1
        -   from: function:'func1'
            to: function:'func2'
            loc: 6:5:8
            by: ~
```
