(function(angular) {
    'use strict';

    angular.module('ls.components.colors', [])
    .directive('lsSelectColor', lsSelectColorDirective);

    function lsSelectColorDirective(){
        return {
                compile: function(tElement, tAttrs){
                    var _action = attrs.lsSelectColor;
                    if(_action.hasPermission){
                    element[0].innerHTML = _action.label;
                    element[0].classList.add('md-default');
                    element[0].classList.add('md-rasied');
                    element[0].classList.add(_action.cssClass);
                    return;
                }

                tElement.parent.removeChild(tElement);
                }
            };
    }
})(angular);
