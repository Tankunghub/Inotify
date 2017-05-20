angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state,$ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
 

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();      
    };

})

.controller('RegisterCtrl', function($scope,$state, $cordovaSQLite,UserProvider) {
	
  $scope.insert=function(user){
   //check password matching
    if($scope.user.password != $scope.user.cpass){
      alert($scope.status="Passwords do not match!");
    }

    else{
       
    var query = "INSERT INTO user(firstname,lastname ,email, username ,password ) VALUES (?,?,?,?,?)";
    $cordovaSQLite.execute(db,query,[user.firstname,user.lastname,user.email,user.username,user.password])
    .then(function(res){
      alert($scope.status="success");
      $state.go("app.login");
    }, function(err){
       alert($scope.status-"error");
    });

  }
    	$scope.islogin = UserProvider.isLogin();
  }

  /*
  $scope.load=function(){
    $scope.alluser=[];
    $cordovaSQLite.execute(db,'SELECT * FROM user')
    .then(
      function(res){
        if(res.rows.length){
          for(var i=0;i<res.rows.length;i++){
          $scope.alluser.push(res.rows.item(i));
        }
       // alert( $scope.status="successss");
        }
      },function(err){
         alert($scope.status-"error: " +err.message);
      }
    )
  }
  */
 
})// end registerCtrl

.controller('loginCtrl', function($scope,$state, $stateParams, UserProvider,$ionicModal){
   
	$scope.doLogin = function(){
		$scope.err = '';
		var u = document.getElementById('user.username').value;
		var p = document.getElementById('user.password').value;

		UserProvider.doLogin(u,p).then(function(done){
			if(done){
        
				console.log('logined');
				$scope.islogin = true;
         $scope.islogin = UserProvider.isLogin();
      
        //retreive value from database
				$scope.firstname = UserProvider.getInfo()['firstname'];
				$scope.lastname = UserProvider.getInfo()['lastname'];
        $scope.email = UserProvider.getInfo()['email'];
				$scope.username = UserProvider.getInfo()['username'];
        $scope.islogin = UserProvider.isLogin();
			}
			else{
				$scope.err = 'error';
			}
		});
	}//end $scope.doLogin
	
	$scope.logout= function(){
		UserProvider.logout();
		$scope.islogin = false
    $state.go("app.login")
	}//end $scope.logout

  //when user go back to view profile/*
	$scope.islogin = UserProvider.isLogin();
      if( UserProvider.isLogin() ){
        //maintain value from database
        $scope.islogin = true;
        $scope.firstname = UserProvider.getInfo()['firstname'];
        $scope.lastname = UserProvider.getInfo()['lastname'];
        $scope.email = UserProvider.getInfo()['email'];
        $scope.username = UserProvider.getInfo()['username'];
	}

})//end loginCtrl

.controller('AddmemoCtrl', function($scope, $stateParams, $cordovaSQLite,UserProvider) { 
  //checking login before allow user to add memo
  $scope.isLogin = UserProvider.isLogin()
  if(UserProvider.isLogin()){
      $scope.save=function(memo){
      //use userid for add memo on specific user 
      var uid= UserProvider.getInfo()['userid'];
      //check datetime format
      console.log(memo.datetime)

      //insert memo to database
        var query = "INSERT INTO memo(topic,datetime, description ,status ,userid) VALUES (?,?,?,?,?)";
        $cordovaSQLite.execute(db,query,[memo.topic,memo.datetime,memo.description,memo.status,uid])
        .then(function(res){
          alert($scope.status="success");
        }, function(err){
          alert($scope.status-"error");
        });
    }
  }
})//end AddmemoCtrl


.controller('EditmemoCtrl', function($scope, $state, $stateParams, $cordovaSQLite){
  
  var memoid = $stateParams.memoid
  $cordovaSQLite.execute(db, 'select * from memo where memoid = ?', [memoid]).then(function(res){
    //only one memo 
    var data = res.rows.item(0)
    //change datetime form database to readable datetime format for user
    data.datetime = (new Date(data.datetime)) 
    data.status = data.status == 'done'
    $scope.memo = data
  })

  $scope.save=function(memo){
    console.log(memo)//display value of a memo
    var query = "update memo set topic = ? ,datetime = ?, description = ?, status = ? where memoid = ?";
    $cordovaSQLite.execute(db,query,[memo.topic,memo.datetime,memo.description,memo.status ? 'done' : 'not done', memo.memoid])
    .then(function(res){
      alert($scope.status="success");
      // go to calendar page
      $state.go("app.calendar")
    }, function(err){
       alert($scope.status-"error");
    });
  }

  $scope.remove=function(){
    $cordovaSQLite.execute(db, 'delete from memo where memoid = ?', [memoid])
    // go to calendar page
    $state.go("app.calendar")
  }
})// end EditmemoCtrl

.controller('Calendar2Ctrl', function($scope, $state, $cordovaSQLite, UserProvider) {

  $scope.isLogin = UserProvider.isLogin()
  if(UserProvider.isLogin()){
    //select all memo that have the same userid
    $cordovaSQLite.execute(db, 'select * from memo where userid = ?', [UserProvider.getInfo()['userid']]).then(function(res){
      var cur = new Date, echdate
      var memos = [], ech, m = 0, i
      for(i = 0; i < res.rows.length; i++){
        ech = res.rows.item(i)
        //change datetime form database to readable datetime format
        echdate = new Date(ech['datetime'])
        if(cur.getMonth() == echdate.getMonth() && cur.getFullYear() == echdate.getFullYear()){
          memos[m++] = ech
        }
      }

      console.log(memos)

      var events = []
      for(i in memos){

        var today = new Date(memos[i]['datetime']);
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        //display each event in calendar
        events[i] = {
            memoid: memos[i]['memoid'],
            title: (memos[i]['status'] == 'done' ? '+' : '-') + memos[i]['topic'],
            start: yyyy + '-' + mm + '-' + dd,

          }
      }//end loop

      //using fullCalendar
      $('#calendar2').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        },
        defaultDate: '2017-05-12',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: events,
        eventClick: function(calEvent, jsEvent, view) {
          console.log(calEvent)
          //if user click on memo, go to edit memo page
          $state.go("app.editmemo", {memoid: calEvent.memoid });
        }
      });


    })

    
  }
})


;
