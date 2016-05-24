var postcss = require('postcss');
var Profane = require('profane');
var _ = require('lodash');

module.exports = postcss.plugin('postcss-solemn', function(options) {
    var profane = new Profane();
    options = _.assignIn({
        reportViolations: true,
        callback: _.noop,
        getReportCallback: getReportCallback,
    }, options);
    if (options.dictionaries) {
        var shouldAppendWords = true;
        var shouldAppendCategoriesForWords = true;
        _.forEach(options.dictionaries, function(jsonFilePath) {
            profane.loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords);
        });
    }

    return function(css, result) {
        // Processing code will be added here
        var codeTexts = getCodeTexts(css);
        var violations = getViolations(codeTexts);
        var violationMessages = getViolationMessages(violations);
        if (options.reportViolations) {
            reportViolations(result, violationMessages);
        }
        if (options.callback) {
            options.callback(violations, violationMessages);
        }
    };

    function getViolationMessages(violations) {
        return _.map(violations, formatViolation);
    }

    function reportViolations(result, violationMessages) {
        var reportCallback = options.getReportCallback(result);
        _.forEach(violationMessages, function(m) {
            reportCallback(m);
        });
    }

    function getReportCallback(result) {
        return result.warn;
    }

    function getViolations(codeTexts) {
        var violations = [];
        _.forEach(codeTexts, function(codeText) {
            if (_.keys(profane.getWordCounts(codeText.text)).length) {
                var v = createViolationFromCodeText(codeText)
                violations.push(v);
            }
        });
        return violations;
    }

    function formatViolation(violation) {
        var issuesText = '[' + _.map(violation.issues, function(value, key) {
            return key + '=' + value;
        }).join(' ') + ']';
        var v = 'VIOLATION (issues: ' + issuesText + ', type: ' + violation.type + ', file: ' + violation.file + ', line: ' + violation.line + ', col: ' + violation.column + ') = ' + violation.text.trim();
        return v;
    }

    function getCodeTexts(css) {

        var codeTexts = [];

        css.walkComments(function(comment) {
            var codeText = {
                type: 'comment',
                pos: comment.source.start,
                text: comment.text,
                fileName: comment.source.input.file
            };
            codeTexts.push(codeText);
        });

        css.walkRules(function(rule) {

            // selector
            var codeText = {
                type: 'selector',
                pos: rule.source.start,
                text: rule.selector,
                fileName: rule.source.input.file
            };
            codeTexts.push(codeText);

            rule.walkDecls(function(decl, i) {

                var codeText;

                // property name
                codeText = {
                    type: 'property name',
                    pos: decl.source.start,
                    text: decl.prop,
                    fileName: decl.source.input.file
                };
                codeTexts.push(codeText);

                // property value
                codeText = {
                    type: 'property value',
                    pos: decl.source.start,
                    text: decl.value,
                    fileName: decl.source.input.file
                };
                codeTexts.push(codeText);

            });
        });
        return codeTexts;
    }

    function createViolationFromCodeText(codeText) {
        return createViolation(codeText.type, codeText.fileName, codeText.pos, codeText.text);
    }

    function createViolation(codeTextType, fileName, start, text) {
        text = text + '';
        var issues = profane.getCategoryCounts(text);
        var violation = {
            issues: issues,
            type: codeTextType,
            file: fileName,
            line: start.line,
            column: start.column,
            text: text,
        };
        return violation;
    }

});
