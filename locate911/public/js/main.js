var map;

$(document).ready(function () {
    
    function addPoint(map, coord, title, circleColor) {
        map.setView([coord.latitude, coord.longitude], 18);
        var marker = L.marker(
            [coord.latitude, coord.longitude],
            { title: title }).addTo(map);
        
        var addrUrl = "http://nominatim.openstreetmap.org/reverse?format=json&lat=LAT&lon=LON&zoom=18&addressdetails=1".replace("LAT", coord.latitude).replace("LON", coord.longitude);
        jQuery.getJSON(addrUrl, function (data, b, c) {
            var html = "<h1>" + title + "</h1>";
            html += "<div><strong>Address:</strong></div>";
            html += "<div><i>" + data.display_name + "</i></div>";
            marker.bindPopup(html, {});
        });

        var circle = L.circle(
            [coord.latitude, coord.longitude], 
            coord.accuracy, 
            { 'color': circleColor || '#f30' }).addTo(map);
        circle.marker = marker;
        return circle;
    }

    function createMap() {
        map = L.map('map');
        
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar' }).addTo(map);
        
        var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
            layers: 'nexrad-n0r-900913',
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            attribution: "Weather data © 2012 IEM Nexrad"
        }).addTo(map);
/*        
        var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/wfs/ww.php", {
            layers: 'nexrad-n0r-900913',
            format: 'image/png',
            transparent: true,
            attribution: "Weather data © 2012 IEM Nexrad"
        }).addTo(map);
*/
        return map;
    }

    navigator.geolocation.getCurrentPosition(function (p) {
        var map = createMap();
        var point = addPoint(map, p.coords, "My Location", '#03f');
    }, function (err) { 
        console.log("getCurrentPosition error: ", err.message);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });

    $('#get-location-btn').click(function () {
        var val = $('#phone-no', this.parentElement).val();
        console.log("#get-location-btn click : " + val);
        $.get("/locations?p=" + val, function (r) {
            console.log(r.coord);
            if (r.coord && r.coord.latitude && r.coord.longitude) {
                addPoint(map, r.coord, val + " Location", '#f30');
            }
        });
    });
});