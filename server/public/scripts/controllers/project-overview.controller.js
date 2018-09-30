timeTrackerApp.controller( 'ProjectOverviewController', ['$http', '$mdToast', '$mdDialog', function ( $http, $mdToast, $mdDialog ) {


    // controller setup
    console.log( 'ProjectOverviewController loaded!' );
    const self = this;

    // variables and stuff
    self.displayProjects = [];
    self.newAllProjects = [];

    // navigation stuff
    self.currentProject = 0;
    self.parentProject = 0;


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


    // Read
    self.getProject = function () {

        console.log( '--- in getProject.' );

        $http.get( '/project/all' )
            .then( function ( results ) {
                console.log( '--- back from the server with:' );
                console.log( results );
                self.displayProjects = results.data;

            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the projects.' ) );
                console.log( '--- Error in getProjects:' );
                console.log( error );
            } )

    }


    $http.get( '/project/special' )
        .then( function ( results ) {
            self.newAllProjects = results.data;
        } )


    self.navigateToProject = function ( destinationProject ) {

        console.log( 'destinationProject:', destinationProject );


        if ( destinationProject == 0 ) {

            $http.get( `/project/special/` )

                .then( function ( results ) {
                    console.log( results.data );
                    self.displayProjects = results.data;
                    self.currentProject = destinationProject;
                    console.log( 'self.displayProjects.parent_id:', results.data[0].parent_id );

                    self.parentProject = self.displayProjects[0].parent_id || 0;
                } )

        } else {

            $http.get( `/project/special/${destinationProject}` )

                .then( function ( results ) {
                    console.log( results.data );
                    self.displayProjects = results.data;
                    self.currentProject = destinationProject;
                    console.log( 'self.displayProjects.parent_id:', results.data[0].parent_id );
                    self.parentProject = self.displayProjects[0].parent_id || 0;
                } )

        }
    }

    // initial calls
    // self.getProject();

}] )