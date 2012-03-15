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
            this.updateCurrentPosition();
            me.appMap = new google.maps.Map(document.getElementById("map_canvas"),myOptions);

            $.PeriodicalUpdater({
                                    url : 'api/notes',
                                    method: 'get',
                                    maxTimeout: 6000
                                },
                                function(data){
                                    console.log(data);
                                });
        },

        putMarker: function(image) {
            this.updateCurrentPosition();
            var post = document.getElementById("textToPost").value||"Default";
            var spot = new google.maps.Marker({
                                                  position: me.currentPosition,
                                                  map: me.appMap,
                                                  icon: image,
                                                  title : post
                                              });
            $.post("http://notesaround.code-monkeys.info/api/note", { 'loc': [me.currentPosition.lat(),me.currentPosition.lon()] });
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h2 id="firstHeading" class="firstHeading">Example marker</h2>'+
                '<div id="bodyContent">'+
                '<p><b>The example marker with post text:</b>,'+
                '<p>post</p> '+
                '</div>'+
                '</div>'

            var infowindow = new google.maps.InfoWindow({
                                                            content: contentString
                                                        });
            google.maps.event.addListener(spot, 'click', function() {
                infowindow.open(me.appMap,spot);
            });
            me.appMap.setCenter(me.currentPosition);
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

