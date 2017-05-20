// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.service','ngCordova'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db=window.openDatabase("inotify.db","1.0","inotifyinfo","2000");
    if(window.cordova){
		db = $cordovaSQLite.openDB({name : 'inotify.db'});
	}
//for remove user table
  if(false){
       $cordovaSQLite.execute(db,"drop table user");
        $cordovaSQLite.execute(db,"drop table memo");
  }
//
    $cordovaSQLite.execute(db,
    "create table if not exists user (userid integer primary key AUTOINCREMENT,firstname VARCHAR,lastname VARCHAR,email TEXT, username TEXT,password TEXT)");
 
    $cordovaSQLite.execute(db,
    "create table if not exists  memo (memoid integer primary key AUTOINCREMENT,topic text,datetime text,description text,status text,userid integer,FOREIGN KEY(userid) REFERENCES user(userid) ON UPDATE CASCADE)");
    
 });
})
// .run function
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
  
  }
  )

.state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      }
    },
      cache: false
  })
.state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
         controller: 'loginCtrl'
        
      }
    },
      cache: false
  })
.state('app.addmemo', {
    url: '/addmemo',
    views: {
      'menuContent': {
        templateUrl: 'templates/addmemo.html', 
        controller: 'AddmemoCtrl'
        
      }
    },
      cache: false
  })
.state('app.editmemo', {
    url: '/editmemo/:memoid',
    views: {
      'menuContent': {
        templateUrl: 'templates/editmemo.html',
         controller: 'EditmemoCtrl'
        
      }
    }
  })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })
     .state('app.calendar', {
      url: '/calendar',
      views: {
        'menuContent': {
          templateUrl: 'templates/calendar.html',
          controller: 'Calendar2Ctrl'
        }
      },
      cache: false
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})
//end config

  

  ;
