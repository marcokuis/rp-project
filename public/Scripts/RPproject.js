// JavaScript source code


angular.module('myApp', ['routeConfig', 'gameLoadService', 'sessionService', 'gameCtrl', 'homeCtrl', 'userCtrl']);


//jQuery to toggle sidebar on smaller screens
$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});