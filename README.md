# postcss-solemn
A PostCSS plugin that detects inappropriate language in your CSS code.

# Usage
```js

var processors = [
    solemn({
        reportViolations: false,
        callback: function(violations, violationMessages) {
            console.log(violations);
            console.log(violationMessages);
        },
        dictionaries: ['dictionary1.json', 'dictionary2.json']
    })
];

gulp.src('styles/*.css')
    .pipe(postcss(processors));

```

# Options

## reportViolations
If true, it prints violation messages to the screen.

## callback (optional)
A callback to receive two arrays - an array of violations and an array of corresponding violationMessages.
The callback must be in the following form:
```js

function(violations, violationMessages) {
  // do something
}

```

## dictionaries
An array of dictionary files to use for detecting inappropriate language.

Each custom dictionary is a JSON file with the following format:

```js
{
  "word1": ["category1", "category3"],
  "word2": ["category2"],
  "word3": ["category1"]
  "word4": ["category2", "category3", "category4"]
}
```

Every word must have at least one violation category.  If multiple dictionaries are specified, words and their categories are merged.

## Test
To test the module, run the follow from the command line:
```js

npm test

```
