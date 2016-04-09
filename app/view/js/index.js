
var gymApp = angular.module('GymApp', ['ui.router', 'LocalStorageModule', 'chart.js'/*, 'ui.bootstrap'/*, 'chart.js'*/]);

gymApp.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

    $urlRouterProvider.otherwise("/");
    $stateProvider.
        state('newSession',{
            url:'/newSession',
            templateUrl: "html/new-session.html",
            controller: "NewSessionController"
        }).
        state('sessionsList',{
            url:'/',
            templateUrl: "html/sessions-list.html",
            controller: "SessionsController"
        }).
        state('dataOverTime',{
            url:'/dataOverTime',
            templateUrl: "html/data-over-time.html",
            controller: "DataOverTimeController"
        });

    localStorageServiceProvider
        .setPrefix('gymApp')
        .setStorageType('sessionStorage')
        .setNotify(true, true);

    /*ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });*/

});

gymApp.factory('cacheManager', ['$cacheFactory', 'localStorageService', function ($cacheFactory, localStorageService) {
    var cache = $cacheFactory.get('cacheId');

    var cacheManager = {

        getIdForNewSession: function () {

        },

        getIdForNewStep: function () {

        },

        getAllSessions : function () {
            //localStorageService.clearAll()
            //return cache.get('sessions');
            if (localStorageService.get('sessions')) {
                return localStorageService.get('sessions');
            } else {
                return [];
            }
        },

        saveSession: function (newSession) {
            var sessions = this.getAllSessions();
            newSession.id = sessions.length;
            sessions.push(newSession);
            localStorageService.set('sessions', sessions);
            console.log();
        },

        clearCache: function () {
            localStorageService.clearAll()
        }

    };

    return cacheManager
}]);

gymApp.controller('MainController', ['$scope', '$state', '$cacheFactory', 'cacheManager', function ($scope, $state, $cacheFactory, cacheManager) {
    $scope.cache = $cacheFactory('cacheId');

    //$scope.cache.put("2", {a: 4, b:5});
    //var a = $scope.cache.get("2");
    $scope.newSession = function () {
        $state.go("newSession");
    };

    $scope.clearCache = function () {
        cacheManager.clearCache();
    };

    $scope.sessionsList = function () {
        $state.go("sessionsList");
    };

    $scope.dataOverTime = function () {
        $state.go("dataOverTime");
    };
}]);

gymApp.controller('SessionsController', ['$scope', '$state', '$cacheFactory', 'cacheManager',function ($scope, $state, $cacheFactory, cacheManager) {


    $scope.cache = $cacheFactory.get('cacheId');
    $scope.sessions = cacheManager.getAllSessions();
    $scope.sessions.reverse();
    $scope.sessions.forEach(function (session) {
        session.date = new Date(session.date);
    });
    $scope.months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    $scope.newSession = function () {
        $state.go("newSession");
    };
}]);

gymApp.controller('DataOverTimeController', ['$scope', '$state', 'cacheManager',function ($scope, $state, cacheManager) {


    $scope.sessions = cacheManager.getAllSessions();

    if ($scope.sessions.length > 3) {
        $scope.sessions = $scope.sessions.slice($scope.session.length-2, $scope.session.length);
    }
    $scope.tableObjects = [];
    //$scope.sessions.reverse();
    $scope.sessions.forEach(function (session) {
        session.date = new Date(session.date);
        //$scope.tableObjects
    });
    $scope.Exercises = [ "BENCH PRESS", "PRESS", "SQUATS" , "RUN"];

    $scope.Exercises.forEach(function (exercise) {
        var data = new DataOverTimeObject();

        data.exercise = exercise;
        $scope.sessions.forEach(function (session, i) {
            session.steps.forEach(function (step) {
                if (step.exercise == exercise) {
                    data.days.push({
                        numbers : step.actualNumbers ? step.actualNumbers : "-",
                        weight : step.actualWeight ? step.actualWeight : "-",
                        time : step.actualTime ? new Date(step.actualTime).getHours() + ":" + new Date(step.actualTime).getMinutes() + ":" + new Date(step.actualTime).getSeconds() : "-"
                    });
                } else {
                    data.days.push({
                        numbers : "-",
                        weight : "-",
                        time : "-"
                    });
                }
            });
        });
        $scope.tableObjects.push(data);
    });
    $scope.months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    $scope.benchPressLabelsN = [[]];
    $scope.benchPressLabelsW = [[]];
    $scope.benchPressLabelsT = [[]];
    $scope.benchPressDataN = [[]];
    $scope.benchPressDataW = [[]];
    $scope.benchPressDataT = [[]];

    $scope.pressLabelsN = [[]];
    $scope.pressLabelsW = [[]];
    $scope.pressLabelsT = [[]];
    $scope.pressDataN = [[]];
    $scope.pressDataW = [[]];
    $scope.pressDataT = [[]];

    $scope.runLabelsN = [[]];
    $scope.runLabelsW = [[]];
    $scope.runLabelsT = [[]];
    $scope.runDataN = [[]];
    $scope.runDataW = [[]];
    $scope.runDataT = [[]];

    $scope.squatsLabelsN = [[]];
    $scope.squatsLabelsW = [[]];
    $scope.squatsLabelsT = [[]];
    $scope.squatsDataN = [[]];
    $scope.squatsDataW = [[]];
    $scope.squatsDataT = [[]];

    $scope.benchPressNSeries = ['Bench press Numbers'];
    $scope.benchPressWSeries = ['Bench press Weight'];
    $scope.benchPressTSeries = ['Bench press Time'];
    $scope.pressNSeries = ['Press Numbers'];
    $scope.pressWSeries = ['Press Weight'];
    $scope.pressTSeries = ['Press Time'];
    $scope.squatsNSeries = ['Squats Numbers'];
    $scope.squatsWSeries = ['Squats Weight'];
    $scope.squatsTSeries = ['Squats '];
    $scope.runNSeries = ['Run Numbers'];
    $scope.runWSeries = ['Run Weight'];
    $scope.runTSeries = ['Run Time'];


    $scope.sessions.forEach(function (session, i) {
        session.steps.forEach(function (step) {
            if (step.actualNumbers && step.exercise == "BENCH PRESS") {
                $scope.benchPressLabelsN.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.benchPressDataN[0].push([step.actualNumbers]);
            }
            if (step.actualWeight && step.exercise == "BENCH PRESS") {
                $scope.benchPressLabelsW.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.benchPressDataW[0].push([step.actualWeight]);
            }
            if (step.actualTime && step.exercise == "BENCH PRESS") {
                $scope.benchPressLabelsT.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.benchPressDataT[0].push([new Date(step.actualTime).getTime()/60000]);
            }

            if (step.actualNumbers && step.exercise == "PRESS") {
                $scope.pressLabelsN.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.pressDataN[0].push([step.actualNumbers]);
            }
            if (step.actualWeight && step.exercise == "PRESS") {
                $scope.pressLabelsW.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.pressDataW[0].push([step.actualWeight]);
            }
            if (step.actualTime && step.exercise == "PRESS") {
                $scope.pressLabelsT.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.pressDataT[0].push([new Date(step.actualTime).getTime()/60000]);
            }


            if (step.actualNumbers && step.exercise == "SQUATS") {
                $scope.squatsLabelsN.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.squatsDataN[0].push([step.actualNumbers]);
            }
            if (step.actualWeight && step.exercise == "SQUATS") {
                $scope.squatsLabelsW.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.squatsDataW[0].push([step.actualWeight]);
            }
            if (step.actualTime && step.exercise == "SQUATS") {
                $scope.squatsLabelsT.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.squatsDataT[0].push([new Date(step.actualTime).getTime()/60000]);
            }

            if (step.actualNumbers && step.exercise == "RUN") {
                $scope.runLabelsN.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.runDataN[0].push([step.actualNumbers]);
            }
            if (step.actualWeight && step.exercise == "RUN") {
                $scope.runLabelsW.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.runDataW[0].push([step.actualWeight]);
            }
            if (step.actualTime && step.exercise == "RUN") {
                $scope.runLabelsT.push($scope.months[session.date.getMonth()] + " " + session.date.getDate()+"th");
                $scope.runDataT[0].push([new Date(step.actualTime).getTime()/60000]);
            }
        })
    });
}]);

gymApp.controller('NewSessionController', ['$scope', '$state', '$cacheFactory', 'cacheManager',function ($scope, $state, $cacheFactory, cacheManager) {
    $scope.cache = $cacheFactory.get('cacheId');
    $scope.session = new Session();

    $scope.createStep = function () {
        var step = new Step();
        step.id = $scope.session.steps.length != -1 ? $scope.session.steps.length+1 : 1;
        return step;
    };

    $scope.session.steps.push($scope.createStep());
    //$scope.session.steps.push(new Step());

    $scope.addNewStep = function () {
        $scope.session.steps.unshift($scope.createStep());
    };

    $scope.finishSession = function () {
        var isValid = true;
        $scope.session.steps.forEach(function (step) {
            if (step.state != Statuses.FINISHED) {
                isValid = false;
            }
        });
        if (isValid) {
            cacheManager.saveSession($scope.session);
            $scope.home();
        } else {
            alert("You have not finished steps");
        }
    };

    $scope.home = function () {
        $state.go("sessionsList");
    };
}]);

gymApp.directive('sessionData', function () {
    return {
        restrict: 'E',
        scope: {
            session: '='
        },
        templateUrl: 'html/session-data.html',
        controller: ['$scope', '$state', 'cacheManager', function ($scope, $stat, cacheManager){

            $scope.chartSteps = [];

            $scope.session.steps.forEach(function (step, i) {
                if(step.forecastNumbers == 0) {
                    step.forecastNumbers = "-";
                    step.actualNumbers = "-";
                    step.numberDiff = '-';
                } else {
                    step.numberDiff = Math.round(((step.actualNumbers) / step.forecastNumbers) * 100);
                    /*if (step.forecastNumbers <= step.actualNumbers) {
                        step.numberDiff = Math.abs(step.numberDiff) + 100;
                    }*/
                }
                if(!step.forecastTime) {
                    step.forecastTime = "-";
                    step.actualTime = "-";
                    step.timeDiff = '-';
                } else {
                    step.forecastTime = new Date(step.forecastTime);
                    step.actualTime = new Date(step.actualTime);
                    var totalSecF = step.forecastTime.getSeconds() + step.forecastTime.getMinutes()*60 + step.forecastTime.getHours()*3600;
                    var totalSecA = step.actualTime.getSeconds() + step.actualTime.getMinutes()*60 + step.actualTime.getHours()*3600;
                    step.timeDiff = Math.round(((totalSecA) / totalSecF) * 100);
                    /*if (totalSecF <= totalSecA) {
                        step.timeDiff = Math.abs(step.timeDiff) + 100;
                    }*/
                    step.forecastTime = step.forecastTime.getHours() + ":" + step.forecastTime.getMinutes() + ":" + step.forecastTime.getSeconds();
                    step.actualTime = step.actualTime.getHours() + ":" + step.actualTime.getMinutes() + ":" + step.actualTime.getSeconds();
                }
                if(step.forecastWeight == 0) {
                    step.forecastWeight = "-";
                    step.actualWeight = "-";
                    step.weightDiff = '-';
                } else {
                    step.weightDiff = Math.round(((step.actualWeight) / step.forecastWeight) * 100);
                    /*if (step.forecastWeight <= step.actualWeight) {
                        step.weightDiff = Math.abs(step.weightDiff) + 100;
                    }*/
                }
                $scope.numberLabels = ['Numbers'];
                $scope.weightLabels = ['Weight'];
                $scope.timeLabels = ['Time'];
                $scope.series = ['Series A', 'Series B'];

                $scope.chartSteps.push({
                    id: $scope.session.id+'char'+step.id+'Chart',
                    numberData: [
                        [step.forecastNumbers],
                        [step.actualNumbers]
                    ],
                    weightData: [
                        [step.forecastWeight],
                        [step.actualWeight]
                    ],
                    timeData: [
                        [totalSecF],
                        [totalSecA]
                    ]
                });

/*
                $scope.numberData = [
                    [step.forecastNumbers],
                    [step.actualNumbers]
                ];
                $scope.weightData = [
                    [step.forecastWeight],
                    [step.actualWeight]
                ];
                $scope.timeData = [
                    [totalSecF],
                    [totalSecA]
                ];*/
            });


        }]
    }
});

gymApp.directive('stepInput', function () {
    return {
        restrict: 'E',
        scope: {
            step: '='
        },
        templateUrl: 'html/step-input.html',
        controller: ['$scope', '$state', '$cacheFactory', function ($scope, $stat, $cacheFactory) {
            $scope.parent = {forecastTime : ''}
            $scope.cache = $cacheFactory.get('cacheId');
            $scope.States = Statuses;
            $scope.Exercises = [ "BENCH PRESS", "PRESS", "SQUATS" , "RUN", ""];
            $scope.hours = 0;
            $scope.minutes = 0;
            $scope.seconds = 0;
            /*$scope.disabled = true;*/
/*            setTimeout( function () {
                $('#step'+$scope.step.id).datetimepicker({
                pickDate: false});
                //var obj = new Object();
                //obj['forecastTime' = ''];

            }, 1000);*/
            var startInterval;

            $scope.start = function () {
                if ($scope.step.forecastNumbers == 0
                    && $scope.step.forecastTime == 0
                    && $scope.step.forecastWeight == 0)  {
                    $scope.isError = true;
                } else {
                    $scope.isError = false;
                    var date = new Date();

                    if ($scope.step.forecastNumbers == 0) {
                        $scope.step.isNumberIncluded = false;
                    }

                    if ($scope.step.forecastTime == 0) {
                        $scope.step.isTimeIncluded = false;
                    }

                    if ($scope.step.forecastWeight == 0) {
                        $scope.step.isWeightIncluded = false;
                    }

                    $scope.step.isForecastDisabled = true;
                    $scope.step.state = $scope.States.STARTED;
                }
                $scope.step.actualTime = new Date('1970-01-01 00:00:00');
                startInterval = setInterval(function () {
                    $scope.hours = $scope.step.actualTime.getHours();
                    $scope.minutes = $scope.step.actualTime.getMinutes();
                    $scope.seconds = $scope.step.actualTime.getSeconds();

                    $scope.step.actualTime.setSeconds($scope.step.actualTime.getSeconds() + 1);
                    $scope.$apply();
                },1000);
            };

            $scope.stop = function () {
                //if ($scope.step.forecastTime == 0) {
                    $scope.step.actualTime = 0;
                //}/* else {
                    //$scope.step.actualTime = String($scope.step.actualTime);
                //}*/
                clearInterval(startInterval);
                $scope.step.isActualVisible = true;
                $scope.step.state = $scope.States.STOPPED
            };

            $scope.finish = function () {
                $scope.step.isActualDisabled = true;
                $scope.step.state = $scope.States.FINISHED;
            };

            $scope.save = function () {

            };

            $scope.timePickerOptions = {
                step: 20,
                timeFormat: 'g:ia',
                appendTo: 'body'
            };


        }]

    }
});

var Session = function () {
    this.id = -1;
    this.date = new Date();
    this.steps = [];
};

var Step = function () {

    this.id = -1;
    this.exercise = "BENCH PRESS";
    this.forecastNumbers = 0;
    this.forecastTime = 0;
    this.forecastWeight = 0;

    this.actualNumbers = 0;
    this.actualTime =  0;
    this.actualWeight = 0;

    this.isDisabled = false;
    this.isForecastDisabled = false;
    this.isActualDisabled = false;
    this.isActualVisible = false;

    this.isNumberIncluded = true;
    this.isWeightIncluded = true;
    this.isTimeIncluded = true;
    this.state = Statuses.NEW;
};

var DataOverTimeObject = function() {
    this.excercise = "";
    this.days = [];
};



var Statuses = {
    NEW: "new",
    STARTED: "started",
    STOPPED: "stopped",
    FINISHED: "finished"
};

var Exercises = {
    BENCH_PRESS: "BENCH PRESS",
    PRESS: "Press",
    SQUATS: "Squats"
};
