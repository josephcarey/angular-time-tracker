timeTrackerApp.controller( 'ProjectOverviewController', ['$http', '$mdToast', '$mdDialog', function ( $http, $mdToast, $mdDialog ) {

    // controller setup
    const self = this;

    // variables and stuff
    self.displayProjects = [];
    self.timeToEdit = {};
    self.timeToDelete = {};

    // navigation stuff
    self.currentProject = 0;
    self.parentProject = 0;


    // collapsible stuff
    var coll = document.getElementsByClassName( "collapsible" );
    var i;

    for ( i = 0; i < coll.length; i++ ) {
        coll[i].addEventListener( "click", function () {
            this.classList.toggle( "active" );
            var content = this.nextElementSibling;
            if ( content.style.maxHeight ) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        } );
    }

    self.addTime = function ( projectID ) {

        $http.post( '/time', { project_id: projectID } )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem adding a new time to this project.' ) );
                console.log( '--- Error in addTime:' );
                console.log( error );
            } )
    }

    self.stopTime = function ( timeEntryID ) {

        $http.put( `/time/stop/${timeEntryID}`, {} )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem stopping the time.' ) );
                console.log( '--- Error in stopTime:' );
                console.log( error );
            } )

    }

    self.stageEditTime = function ( timeToPutInEdit ) {

        self.timeToEdit = timeToPutInEdit;

        $mdDialog.show( {
            contentElement: '#editTimeDialog',
            parent: angular.element( document.body ),
            clickOutsideToClose: true,
            bindToController: true
        } )


    }

    self.editTime = function ( timeToEdit ) {

        $http.put( `/time/${timeToEdit.id}`, timeToEdit )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem editing the time.' ) );
                console.log( '--- Error in editTime:' );
                console.log( error );
            } )

    }

    self.closeMe = function () {
        $mdDialog.hide();
    }

    self.navigateToProject = function ( destinationProject ) {

        console.log( 'destination project:', destinationProject );
        console.log( 'current project:', self.currentProject )


        if ( destinationProject == 0 ) {

            $http.get( `/project/special/` )

                .then( function ( results ) {
                    self.displayProjects = results.data;
                    self.currentProject = destinationProject;
                    self.parentProject = 0;
                } )
                .catch( function ( error ) {
                    $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the projects.' ) );
                    console.log( '--- Error in getProjects:' );
                    console.log( error );
                } )

        } else {

            $http.get( `/project/special/${destinationProject}` )

                .then( function ( results ) {
                    self.displayProjects = results.data;
                    self.currentProject = destinationProject;
                    self.parentProject = self.displayProjects[0].parent_id || 0;
                } )
                .catch( function ( error ) {
                    $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the projects.' ) );
                    console.log( '--- Error in getProjects:' );
                    console.log( error );
                    self.navigateToProject( 0 );
                } )

        }
    }

    // initial calls
    self.navigateToProject( 0 );

}] )