(function () {

    "use strict";

    angular.module("app")

    // define toaster configurations
    .config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body',
            templates: {
                toast: 'node_modules/angular-toastr/src/directives/toast/toast.html',
                progressbar: 'node_modules/angular-toastr/src/directives/progressbar/progressbar.html'
            },
        });
    });

}());