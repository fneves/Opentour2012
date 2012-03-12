var app =  new function () {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var me = this;
    var appMap;
    var markers = [];



    return {
        init : function() {
            me.appMap = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
        },

        putMarker: function(image, lat, lon) {
            var myLatLng = new google.maps.LatLng(lat, lon);
            var spot = new google.maps.Marker({
                position: myLatLng,
                map: me.appMap,
                icon: image
            });
            markers.push(spot);
        }
    }

}();

