L.Handler.ImageDrag = L.Handler.extend({
    options: {
    },

    initialize: function (image, options) {
        this._image = image;
        L.Util.setOptions(this, options);
    },

    addHooks: function () {
        if (this._image._map) {
            if (!this._markerGroup) {
                this._initMarkers();
            }
            this._image._map.addLayer(this._markerGroup);
            this._center._icon.style.cursor = "move";
            this._center.setZIndexOffset(10);
        }
    },

    removeHooks: function () {
        if (this._image._map) {
            this._image._map.removeLayer(this._markerGroup);
            delete this._markerGroup;
        }
    },

    updateMarkers: function () {
        this._markerGroup.clearLayers();
        this._initMarkers();
    },

    _initMarkers: function () {
        if (!this._markerGroup) {
            this._markerGroup = new L.LayerGroup();
        }

        var c = this._image._bounds.getCenter();
        this._center = this._createMarker(c, 0);
    },

    _createMarker: function (latlng, index) {
        var marker = new L.Marker(latlng, {
            draggable: true,
            icon: new L.DivIcon({
                iconSize: new L.Point(8, 8),
                className: 'leaflet-div-icon leaflet-editing-icon'
            })
        });
        marker.on('drag', this._onMarkerDrag, this);
        this._markerGroup.addLayer(marker);
        return marker;
    },

    _onMarkerDrag: function (e) {
        var marker = e.target;
        if (marker === this._center) {
            var c = marker.getLatLng();
            this._image._bounds = this._moveBounds(this._image._bounds, c);
            this._image._reset();
        }
    },

    //move bounds center to point
    _moveBounds: function (bounds, newCenter) {
        var delta = this._delta(newCenter, bounds.getCenter());
        var topLeft = this._moveLatLng(bounds.getNorthWest(), delta);
        var bottomDown = this._moveLatLng(bounds.getSouthEast(), delta);
        return L.latLngBounds(topLeft, bottomDown);
    },

    _moveLatLng: function (point, delta) {
        return L.latLng(point.lat + delta.lat, point.lng + delta.lng);
    },

    _delta: function (from, to) {
        return L.latLng(from.lat - to.lat, from.lng - to.lng);
    }

});