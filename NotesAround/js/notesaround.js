var app =  new function () {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var me = this;
    var appMap;
    var currentPosition;

    return {
        init : function() {
            var that = this;
            this.updateCurrentPosition();
            me.appMap = new google.maps.Map(document.getElementById("map_canvas"),myOptions);


            $.PeriodicalUpdater('/api/notes', {
                                    method: 'GET',
                                    type: 'json',
                                    maxTimeout: 5000,
                                    runatonce: true
                                },
                                function (notes, success, xhr, handle) {
                                    for (note in notes) {
                                        that.displayNote(notes[note]);
                                    }
                                });
        },

        displayNote: function(note) {
            var that = this;
            var spot = new google.maps.Marker({
                                                  position: new google.maps.LatLng(note.loc[0],
                                                                                   note.loc[1]),
                                                  map: me.appMap,
                                                  icon: 'img/icon.png',
                                                  title : 'Bananinhas'
                                              });

            that.complementNote(spot);
        },

        complementNote: function (spot) {
            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h2 id="firstHeading" class="firstHeading">Example marker</h2>' +
                '<div id="bodyContent">' +
                '<p><b>The example marker with post text:</b>,' +
                '<p>post</p> ' +
                '</div>' +
                '</div>'

            var infowindow = new google.maps.InfoWindow({content:contentString});

            google.maps.event.addListener(spot, 'click', function () {
                infowindow.open(me.appMap, spot);
            });
        },

        putMarker: function(image) {
            this.updateCurrentPosition();
            var post = document.getElementById("textToPost").value||"Default";

            $.post("/api/note", 'note=' + JSON.stringify({ 'loc': [me.currentPosition.lat(), me.currentPosition.lng()] }));

        } ,

        updateCurrentPosition : function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function( position ){
                                                             // Log that this is the initial position.
                                                             console.log( "Position Found" );
                                                             me.currentPosition = new google.maps.LatLng(position.coords.latitude,
                                                                                                         position.coords.longitude);
                                                         },
                                                         function( error ){
                                                             console.log( "Something went wrong: ", error );
                                                             me.currentPosition =   new google.maps.LatLng(-34.397, 150.644);
                                                         },
                                                         {
                                                             timeout: (5 * 1000),
                                                             maximumAge: (1000 * 60 * 15),
                                                             enableHighAccuracy: true
                                                             //bypass to chrome dev
                                                         } );
            } else {
                alert('I guess this browser does not support geolocation!')
            }
        }
    }

}();

