var gulp = require('gulp');
var postcss = require('gulp-postcss');
var solemn = require('postcss-solemn');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.solemncss = {
    setUp: function(done) {
        // setup here if necessary
        this.logMessages = [];
        var that = this;
        this.getReportCallback = function(result) {
            return function(t) {
                that.logMessages.push(t);
            }
        };
        done();
    },

    tearDown: function(done) {
        done();
    },

    report_violations_false: function(test) {
        test.expect(3);
        var that = this;
        var callback = function(violations, violationMessages) {
            test.ok(violations.length > 0);
            test.equals(violationMessages.length, violations.length);
            test.equals(that.logMessages.length, 0);
            test.done();
        };

        var processors = [
            solemn({
                reportViolations: false,
                callback: callback,
                getReportCallback: that.getReportCallback,
                dictionaries: ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']
            })
        ];

        gulp.src('test/fixtures/*.css')
            .pipe(postcss(processors));

    },

    report_violations_true: function(test) {
        test.expect(3);
        var that = this;
        var callback = function(violations, violationMessages) {
            test.ok(violations.length > 0);
            test.equals(violationMessages.length, violations.length);
            test.equals(that.logMessages.length, violations.length);
            test.done();
        };

        var processors = [
            solemn({
                reportViolations: true,
                callback: callback,
                getReportCallback: that.getReportCallback,
                dictionaries: ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']
            })
        ];

        gulp.src('test/fixtures/*.css')
            .pipe(postcss(processors));

    }

};
