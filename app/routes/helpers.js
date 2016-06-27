"use strict"

module.exports.checkAuth = ["$q", "$timeout", "$http", "$location", "$rootScope", "$cookies",
function ($q, $timeout, $http, $location, $rootScope, $cookies, dfd, token) {

//  console.log("checkAuth");

  dfd = $q.defer()
  token = $cookies.get("jwt-token") || window.localStorage.getItem('token')

  if (!token)
    dfd.reject()

  if (!$cookies.get("jwt-token") && !!token)
    $cookies.put("jwt-token", token)

  $http({
    method: 'GET'
    , url: '/api/auth'
    , headers: {
      'Authorization': ['Bearer ', token].join("")
    }
  }).success(function(user){

    if (user !== '0'){
      $rootScope.auth = true
      dfd.resolve()
    } else { // Not Authenticated
      $rootScope.auth = false
      $rootScope.message = 'You need to log in.'
      dfd.reject()
      $location.url('/signin')
    }

  }).error(function(err){
    $rootScope.auth = false
    dfd.reject()
    $location.url('/signin')
  })

  return dfd.promise
}]
