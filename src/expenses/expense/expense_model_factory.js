(function(angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name ls.service:lsExpenseModel
     *
     * @description
     * Creates a expense models from objects.
     *
     */
    angular.module('ls').factory('lsExpenseModel', factory);
    factory.$inject = ['lsModelsBase', 'lsDateService'];

    function factory(lsModelsBase, lsDateService) {
        var _service = {
            create: create,
            createArrayFromApi: createArrayFromApi
        },
        _purchaseTypes = [
            [0,'Account'],
            [1,'Company Credit Card'],
            [2,'Personal']
        ];

        /**
         * convert incomming data from API to an array of Expense
         * @param  {Array} arr array of objects
         * @return {Array}     array of Expense
         */
        function createArrayFromApi(arr) {
            return lsModelsBase.createModelArray(arr, createModelFromApi);
        }


        /**
         * convert incomming data from API to an appointment expense model
         * @param  {object} data      incomming data from API
         * @return {Expense}      an appointment expense model
         */
        function createModelFromApi(data, updateMethods) {
            var _m = new Expense();

            _m.id = data.id;
            _m.appointmentId = data.appointmentId;
            _m.expense = data.expense;
            _m.editExpense = _m.expense;
            _m.entered = data.entered;
            _m.enteredBy = data.enteredBy;
            _m.updateExpenseAsync = function(expense) {
                updateMethods.updateExpenseAsync(_m, expense);
            };
            _m.deleteAsync = function() {
                updateMethods.deleteAsync(_m.id);
            };
            updateStatus(_m);
            return _m;
        }


        function create(entered, enteredBy) {
            var _m = new Expense();

            _m.entered = entered;
            _m.enteredBy = enteredBy;
            updateStatus(_m);

            return _m;
        }

        function Expense() {
            // id - GUID
            this.id = '';

            // appointmentId - GUID of the parent appointment
            this.appointmentId = 0;

            // editDescription - A 512 character text describing the expense
            this.description = '';

            // editDescription - stores the description while editing
            this.editDescription = '';

            // entered - A Unix time stamp when expense was added
            this.entered = 0;

            // enteredBy - the full name of the user who entered the expense
            this.enteredBy = '';

            // photoUrl - a link to the expense photo
            this.photoUrl = '';

            // amount - The amount (currency) of the expense
            this.amount = '';

            // editAmount - stores the amount while editing
            this.editAmount = '';

            // formattedAmount - a formatted version for display (formatting is server side)
            this.formattedAmount = '';

            // date -  A Unix timestamp when the expense was incurred
            this.date = 0;

            // editDate - stores the date while editing
            this.editDate = 0;

            // purchaseType - The purchase payment method. Valid values:
            //                  0:  Account
            //                  1:  CompanyCreditCard
            //                  2:  Personal
            this.purchaseType = -1;

            // editPurchaseType - stores the purchaseType while editing
            this.editPurchaseType = -1;

            // allPurchaseTypes - an array of all possible purchase types
            this.allPurchaseTypes = _purchaseTypes;

            // status  - a status message “entered {enter date} by {entered user}”
            this.status = '';

            // async method to update this expense
            this.updateAsync = null;

            // async upload photo of this expense
            this.uploadPhotoAsync = null;

            // async method to delete this expense
            this.deleteAsync = null;
        }

        Expense.prototype.update = function(response) {
            this.description = response.description;
            this.editDescription = this.description;
            this.amount = response.amount;
            this.editAmount = this.amount;
            this.formattedAmount = response.formattedAmount;
            this.date = response.date;
            this.editDate = this.date;
            this.purchaseType = response.purchaseType;
            this.editPurchaseType = response.purchaseType;

            updateStatus(_self);
            return this;
        };

        Expense.prototype.cancelUpdate = function() {
            var _self = this;
            _self.editDescription = _self.description;
            updateStatus(_self);
            return this;
        };

        function updateStatus(expense) {
            expense.status = 'entered on ' +
                lsDateService.formattedDate(expense.entered) +
                ' by ' +
                expense.enteredBy;
        }

        return _service;
    }
})(angular);
