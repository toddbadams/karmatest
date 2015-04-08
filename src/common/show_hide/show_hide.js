(function() {
    'use strict';

    var _domGroups = {},
        _btnGroups = {},
        _hiddenCssClass = 'ls-hidden',
        _activeCssClass = 'ls-active';


    /**
     * Add a button to cached list of buttons and button groups
     * @param {Element} element The button DOM element
     * @param  {String} group The group identifier
     * @param  {String} id    A unique idendifier within the group
     */
    function addBtn(group, id, element) {
        // add group if it does not exist
        if (!_btnGroups[group]) {
            _btnGroups[group] = [];
        }
        // add the button to the group
        _btnGroups[group].push(new Button(group, id, element));
    }

    /**
     * Remove a button
     * @param  {String} group The group identifier
     * @param  {String} id    A unique idendifier within the group
     */
    function removeBtn(group, id) {
        // ensure group exists
        // todo: throw exception
        if (!_btnGroups[group]) return;
        if (!_btnGroups[group][id]) return;

        _btnGroups[group][id].destroy;
        delete _btnGroups[group][id];
        // if the button group is empty remove it
        if (_btnGroups[group].length < 1) {
            delete _btnGroups[group];
        }
    }

    /**
     * Add a DOM element to cached list of DOM element groups
     * @param {Element} element The DOM element
     * @param  {String} group The group identifier
     * @param  {String} id    A unique idendifier within the group
     */
    function addDom(group, id, element) {
        // add group if it does not exist
        if (!_domGroups[group]) {
            _domGroups[group] = [];
        }
        // add the button to the group
        _domGroups[group].push(new DomElement(group, id, element));
    }

    /**
     * Remove a DOM element
     * @param  {String} group The group identifier
     * @param  {String} id    A unique idendifier within the group
     */
    function removeDom(group, id) {
        // ensure group exists
        // todo: throw exception
        if (!_domGroups[group]) return;
        delete _domGroups[group][id];
        // if the button group is empty remove it
        if (_domGroups[group].length < 1) {
            delete _domGroups[group];
        }
    }

    /**
     * Set a group of buttons to inactive by removing the 'ls-active' class
     * @param  {String} group The group identifier
     */
    function setBtnGroupInactive(group) {
        _btnGroups[group].map(function(a) {
            a.removeCssClass(_activeCssClass);
        });
    }

    /**
     * A button object
     * @param  {String} group The group identifier
     * @param  {String} id    A unique idendifier within the group
     * @param {Element} element The DOM element
     */
    function Button(group, id, element) {
        var _self = this;
        _self.group = group;
        _self.id = id;
        _self.element = element;
        _self.element.addEventListener("click", function() {
            setBtnGroupInactive(_self.group);
            _self.addCssClass(_activeCssClass);
            showDom(_self.group,_self.id);
        });
    }

    /**
     * Remove a css class from the button
     * @param  {String} cssClass a CSS class
     */
    Button.prototype.removeCssClass = function(cssClass) {
        this.element.classList.remove(cssClass);
        return this;
    };

    /**
     * Add a css class to a button
     * @param  {String} cssClass a CSS class
     */
    Button.prototype.addCssClass = function(cssClass) {
        this.element.classList.add(cssClass);
        return this;
    };

    /**
     * clean up the button on destroy
     */
    Button.prototype.destroy = function() {
        this.element.onclick = null;
        return this;
    };

    function showDom(group, id) {
        var _domGroup = _domGroups[group];
        if (!_domGroup) return;

        var _i, _l = _domGroup.length;
        for(_i=0; _i<_l; _i+=1){
            if(_domGroup[_i].id === id){
                _domGroup[_i].removeCssClass(_hiddenCssClass);
            } else {
                _domGroup[_i].addCssClass(_hiddenCssClass);
            }
        }
    }

    /**
     * A DOM element object
     * @param  {String} group The group identifier
     * @param  {String} id    A unique idendifier within the group
     * @param {Element} element The DOM element
     */
    function DomElement(group, id, element) {
        var _self = this;
        _self.group = group;
        _self.id = id;
        _self.element = element;
    }

    /**
     * Remove a css class from the DOM element
     * @param  {String} cssClass a CSS class
     */
    DomElement.prototype.removeCssClass = function(cssClass) {
        this.element.classList.remove(cssClass);
        return this;
    };

    /**
     * Add a css class to a DOM element
     * @param  {String} cssClass a CSS class
     */
    DomElement.prototype.addCssClass = function(cssClass) {
        this.element.classList.add(cssClass);
        return this;
    };

    /**
     * @ngdoc directive
     * @name ls.directive:lsShowBtn
     * @restrict E
     *
     * @description
     * attribute based directive to show a dom element on button click
     * shows the dom element associated with the id passed in the
     * ls-show-button attribute.
     * sets the current button class to ls-active
     * remove ls-active from all sibling elements
     *
     */
    angular.module('ls').directive('lsShowBtn', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var _group = attrs.lsGroup,
                    _id = attrs.lsShowBtn;

                addBtn(_group, _id, element[0]);
                scope.$on('destroy', function() {
                    removeBtn(_group, _id);
                });
            }
        };
    });

    /**
     * @ngdoc directive
     * @name ls.directive:lsShowHideId
     * @restrict E
     *
     * @description
     * attribute based directive to show a dom element on button click
     * shows the dom element associated with the id passed in the
     * ls-show-hide-id attribute.
     * removes the ls-hidden css class from the current element
     * adds ls-hidden to all sibling elements
     *
     */
    angular.module('ls').directive('lsShowItem', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function link(scope, element, attrs) {
                var _group = attrs.lsGroup,
                    _id = attrs.lsShowItem;

                addDom(_group, _id, element[0]);
                scope.$on('destroy', function() {
                    removeDom(_group, _id);
                });
            }
        };
    });
})();
