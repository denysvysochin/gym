
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
    //$scope.session.steps.push(new Step());

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
        controller: ['$scope', '$state',function ($scope, $stat) {


            $scope.States = Statuses;
            $scope.Exercises = Exercises;
            /*$scope.disabled = true;*/

            $scope.start = function () {
                $scope.step.isDisabled = true;
                $scope.step.state = $scope.States.STARTED
            };

            $scope.stop = function () {
                $scope.step.isDisabled = true;
                $scope.step.state = $scope.States.FINISHED
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





    this.exercise = "";
    this.numbers = 0;
    this.time = 0;
    this.weight = 0;
    this.isDisabled = false;
    this.state = Statuses.NEW;
};

var Statuses = {
    NEW: "new",
    STARTED: "started",
    FINISHED: "finished"
};

var Exercises = {
    RUN: "Run",
    BENCH_PRESS: "Bench press",
    PRESS: "Press"
};