// JavaScript source code


angular.module('myApp', ['routeConfig','gameLoadService', 'gameCtrl', 'homeCtrl']);


//jQuery voor toggle sidebar op kleine schermen
$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});