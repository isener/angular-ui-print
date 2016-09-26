'use strict';
(function () {
    var lowercase = function (string) { return (typeof string === 'string') ? string.toLowerCase() : string; };
    function toBoolean(value) {
        if (typeof value === 'function') {
            value = true;
        } else if (value && value.length !== 0) {
            var v = lowercase('' + value);
            value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
        } else {
            value = false;
        }
        return value;
    }
    var AngularPrint = angular.module('AngularPrint', []);
    AngularPrint.directive('printHide', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element[0].classList.add('printHide');
            }
        };
    });
    AngularPrint.directive('printRemove', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element[0].classList.add('printRemove');
            }
        };
    });
    AngularPrint.directive('printOnly', function () {
        return {
            restrict: 'A',
            link: {
                post: function (scope, element) {
                    element[0].classList.add('printOnly');
                }
            }
        };
    });
    AngularPrint.directive('printAvoidBreak', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element[0].classList.add('avoidPageBreak');
            }
        };
    });
    AngularPrint.directive('printBtn', ['$window', 'printService', function ($window, printService) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    var elements = document.getElementsByClassName('printSection');
                    while (elements.length > 0) {
                        elements[0].classList.remove('printSection');
                    }
                    var printingArea = attr.printBtn;
                    document.querySelector('[print-section=' + printingArea + ']').className += " printSection";
                    var isLandscape = element[0].getAttribute('landscape');
                    if (isLandscape !== null) printService.printLandscape();
                    else printService.printPortrait();
                    $window.print();
                });
            }
        };
    }]);
    AngularPrint.service('printService', function () {
        var _removePreviousStyle = function () {
            var style = document.getElementById("print-style");
            if (style) style.parentNode.removeChild(style);
        }

        var printLandscape = function () {
            _removePreviousStyle();
            var sheet = (function () {
                var style = document.createElement('style');
                style.appendChild(document.createTextNode(''));
                style.id = "print-style"
                document.head.appendChild(style);
                return style.sheet;
            })();
            sheet.insertRule('@page{size:landscape;}', 0);
        }

        var printPortrait = function () {
            _removePreviousStyle();
        }

        return {
            printLandscape: printLandscape,
            printPortrait: printPortrait
        }
    });
    AngularPrint.directive('printIf', ['$animate', function ($animate) {
        return function (scope, element, attr) {
            scope.$watch(attr.printIf, function applyPrint(value) {
                if ('printOnly' in attr) {
                    $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'printRemove');
                }
                else {
                    $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'printSection');
                }
            });
        };
    }]);
    AngularPrint.directive('printTable', function () {
        return function (scope, element, attr) {
            scope.$watch(attr.printTable, function makeTable(value) {
                setTimeout(function () {
                    if (value == null) return;
                    var elem = element[0];
                    elem.classList.add('printSection');
                    elem.id = 'print-table';
                    var tds = elem.getElementsByTagName('td');
                    for (var i = 0, content, div; i < tds.length; i++) {
                        content = tds[i].innerHTML;
                        tds[i].innerHTML = '';
                        div = document.createElement('div');
                        div.className = 'avoidPageBreak';
                        div.innerHTML = content;
                        tds[i].appendChild(div);
                    }
                    element[0] = elem;
                }, 1000);
            });
        };
    });
})();
