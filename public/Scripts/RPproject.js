// JavaScript source code


angular.module('myApp', ['routeConfig','gameLoadService', 'gameCtrl', 'homeCtrl']);


//jQuery to toggle sidebar on smaller screens
$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});