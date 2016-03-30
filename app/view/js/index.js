
var gymApp = angular.module('GymApp', ['ui.router']);

gymApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");
    $stateProvider.
        state('newSession',{
            url:'/newSession',
            templateUrl: "html/new-session.html",
            controller: "NewSessionController"
        });

});

gymApp.controller('MainController', ['$scope', '$state', function ($scope, $state) {
    $scope.newSession = function () {
        $state.go("newSession");
    };
}]);

gymApp.controller('NewSessionController', ['$scope', '$state', function ($scope, $state) {
    $scope.session = new Session();
    $scope.session.steps.push(new Step());
    $scope.session.steps.push(new Step());

    $scope.addNewStep = function () {
        $scope.session.steps.push(new Step());
    }


}]);

gymApp.directive('stepInput', function () {
    return {
        restrict: 'E',
        scope: {
            step: '='
        },
        templateUrl: 'html/step-input.html',
        controller: ['$scope', '$state', function ($scope, $state) {


            /*$scope.disabled = true;*/

            $scope.start = function () {

            };

            $scope.stop = function () {

            };

            $scope.save = function () {

            };

            $scope.goHome = function () {
                $scope.newSession = function () {
                    $state.go("home");
                }
            }

        }]

    }
});

var Session = function () {
    this.date = new Date();
    this.steps = [];
};

var Step = function () {
    this.name = "";
    this.numbers = 0;
    this.time = 0;
    this.weight = 0;
};