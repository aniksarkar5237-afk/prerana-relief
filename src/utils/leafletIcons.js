import L from 'leaflet';

// Fix Leaflet's default marker icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Emergency alert icon with a pulsing red style
export const emergencyAlertIcon = new L.DivIcon({
  className: 'emergency-alert-icon',
  html: '<div class="pulse-ring"></div><div class="pulse-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
