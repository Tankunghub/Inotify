angular.module('starter.service', [])



.factory('UserProvider',function($cordovaSQLite){
	
	var data = null;
	
	return{
		doLogin:function(uname, password){
			var p = new Promise(function(done){
				$cordovaSQLite.execute(db,'SELECT * FROM user where username = ? and password = ?',[uname, password])
				.then(function(res){
					if(res.rows.length > 0) {
						//only one user is selected
						data = res.rows.item(0);
					}
					done(res.rows.length > 0);
				})
			});
			return p;
		},
		logout:function(){
			data = null;
		},
		isLogin:function(){
			return data != null;
		},
		getInfo:function(){
			return data;
		},
		load:function(userid,pass){
			var p = new Promise(function(done){
				$cordovaSQLite.execute(db,'SELECT * FROM user where userid = ?  and password = ?', [userid,pass]).then(function(res){
					
					  var data1 = res.rows.item(0)
						$scope.user = data1
		})
			});
			return p;
		},
		
	}
});