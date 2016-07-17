// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function(){
var app =  angular.module('starter', ['ionic', 'firebase'])

app.factory("Gases", function($firebaseArray) {
  var itemsRef = new Firebase("https://test-d0812.firebaseio.com/Gases");

  return $firebaseArray(itemsRef);
})

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider.state('landing',{
    url: '/landing',
    templateUrl: 'templates/landing.html'
  });
  $stateProvider.state('variables',{
    url: '/variables',
    templateUrl: 'templates/variables.html',
    controller: 'ListCtrl'
  });
  $stateProvider.state('equations',{
    url: '/equations',
    templateUrl: 'templates/equations.html'
  });
  $stateProvider.state('homepage',{
    url: '/homepage',
    templateUrl: 'templates/homepage.html'
  });
  $stateProvider.state('analysis',{
    url: '/analysis',
    templateUrl: 'templates/analysis.html'
  });
  $urlRouterProvider.otherwise('/homepage');
})

app.controller("ListCtrl", function($scope, $rootScope, Gases) {

  

  // $scope.addItem = function() {
  //   var name = prompt("What do you need to buy?");
  //   if (name) {
  //     $scope.items.$add({
  //       "name": name
  //     });
  //   }
  // };

  $scope.pressure= { 
    availableUnits: [
      {unit: 'Pascal'},
      {unit: 'KPa'},
      {unit: 'Torr'},
      {unit: 'Bar'},
      {unit: 'Atmosphere'}
    ],
    selectedUnit: {unit: 'Pascal'}
  };

  $scope.temperature = { 
    availableUnits: [
      {unit: 'Kelvin'},
      {unit: 'Celcius'},
      {unit: 'Fahrenheit'}
    ],
    selectedUnit: {unit: 'Kelvin'}
  };

  $scope.velocity = { 
    availableUnits: [
      {unit: 'm/s'},
      {unit: 'km/s'}
      
      ],
    selectedUnit: {unit: 'm/s'}
  };

  $scope.diameter = { 
    availableUnits: [
      {unit: 'mm'},
      {unit: 'cm'},
      {unit: 'Inch'},
      {unit: 'm'}
    ],
    selectedUnit: {unit: 'm'}
  };

  $scope.velogas1 = { 
    availableUnits: [
      {unit: 'm/s', multiplier: 1},
      {unit: 'km/s', multiplier: 0.001},
      {unit: 'km/h', multiplier: 3.6}
    ],
    selectedUnit: {unit: 'm/s', multiplier: 1}
  };

  $scope.velogas2 = { 
    availableUnits: [
      {unit: 'm/s', multiplier: 1},
      {unit: 'km/s', multiplier: 0.001},
      {unit: 'km/h', multiplier: 3.6}
    ],
    selectedUnit: {unit: 'm/s', multiplier: 1}
  };

  $scope.Gases = Gases;
  var gas = Gases.name;
  $scope.choices = [
    {option: '', id: 'choice1'}, 
    {id: 'choice2'}
  ];
  
  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length+1;
    $scope.choices.push({'id':'choice'+newItemNo});
  };
    
  $scope.removeChoice = function() {
    var lastItem = $scope.choices.length-1;
    $scope.choices.splice(lastItem);
  };

  $scope.calculate = function(gas1, x1, gas2, x2, press1, temp1, velo1, diame1, pressure, 
    temperature, velocity, diameter){

    if (pressure.unit === 'Torr') {
      press1 = press1 * 133.322;
    }else if (pressure.unit === 'Bar'){
      press1 = press1 * 100000;
    }else if (pressure.unit === 'KPa'){
      press1 = press1 * 1000;
    }else if (pressure.unit === 'Atmosphere'){
      press1 = press1 * 101325;
    };

    if (temperature.unit === 'Celcius') {
      temp1 = temp1 * 274.15;
    } else if (temperature.unit === 'Fahrenheit') {
      temp1  = temp1 * 255.928;
    }else {
      temp1 = temp1;
    };

    if (velocity.unit === 'km/s') {
      velo1 = velo1 * 1000;
    } else {
      velo1 = velo1;
    };

    if (diameter.unit === 'cm') {
      diame1 = diame1 * 0.01;
    } else if (diameter.unit === 'mm') {
      diame1 = diame1 * 0.001;
    }else if (diameter.unit === 'Inch'){
      diame1 = diame1 * 0.0254;
    }else{
      diame1 = diame1;
    };

    // switch (diameter){
    //   case 'cm': diame1 = diame1 * 0.001;
    //               break;
    //   case 'mm': diame1 = diame1 * 0.001;
    //     break;
    //   case 'Inch': diame1 = diame1 * 0.0254;
    //     break;
    //   default: diame1 = diame1;
    // };

    var R1;
    var P1;
    R1 = 8.314 * 1000 / gas1.Mw;
    P1 = press1 / (R1 * temp1);

    var R2;
    var P2;
    R2 = 8.314 * 1000 / gas2.Mw;
    P2 = press1 / (R2 * temp1);
    var Pmix;
    
    Pmix = (x1 * P1) + (x2 * P2);

    var M1;
//    M1 = (Math.pow((temp1 / gas1.T),(3/2)) * ((gas1.T + gas1.S)/(temp1 + gas1.S));
    M1 = ( Math.pow((temp1 / gas1.T),(3/2)) * ((gas1.T + gas1.S)/(temp1 + gas1.S))) * gas1.M;
    var M2;
    M2 = ( Math.pow((temp1 / gas2.T),(3/2)) * ((gas2.T + gas2.S)/(temp1 + gas2.S))) * gas2.M;

    var Mmix;
    Mmix = ( ( x1 * M1 * Math.pow(gas1.Mw,(1/2)) ) + ( x2 * M2 * Math.pow(gas2.Mw,(1/2)) ) )
            / ( ( x1 * Math.pow(gas1.Mw,(1/2)) ) + ( x2 * Math.pow(gas2.Mw,(1/2)) ) );

    var reynold;
    var analyze;
    reynold = (Pmix * velo1 * diame1) / Mmix;
    if (reynold < 2000) {
      analyze = "Laminar Flow";
    }else if (reynold>4000) {
      analyze = "Turbulent Flow";
    }else {
      analyze = "Transitional";
    };

    $scope.answer = reynold.toFixed(2);
    $scope.analysis = analyze;
//    $scope.answer = press1;
    $rootScope.Pmix = Pmix.toFixed(2);
    $rootScope.Mmix = Mmix.toExponential(2);
    $rootScope.Vgas1 = velo1 * x1;
    $rootScope.Vgas2 = velo1 - (velo1 * x1);  
  };

  var master = {};
  $scope.reset = function(){
    this.press1 = null;
    this.gas1 = null;
    this.gas2 = null;
    this.temp1 = null;
    this.velo1 = null;
    this.diame1 = null;
    this.x1 = null;
    this.x2 = null;

  };

  $scope.fill = function(){
        alert("Previewed");
    };

  
})



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());
