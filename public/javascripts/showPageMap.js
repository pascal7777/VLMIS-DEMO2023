


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: site.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

const nav = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(nav, 'bottom-right');

new mapboxgl.Marker()
    .setLngLat(site.geometry.coordinates)
    .setPopup(
    new mapboxgl.Popup({ offset: 25 })
    .setHTML(
        `<h5>${site.site_name}</h5><p>${site.site_district}</p>`
    )
)
.addTo(map)