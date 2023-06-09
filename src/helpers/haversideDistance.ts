const asin = Math.asin;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;
const R = 6378137;

function squared(x: any) {
  return x * x;
}
function toRad(x: any) {
  return (x * PI) / 180.0;
}
function hav(x: any) {
  return squared(sin(x / 2));
}

export function haversineDistance(a: any, b: any) {
  const aLat = toRad(Array.isArray(a) ? a[1] : a.latitude || a.lat);
  const bLat = toRad(Array.isArray(b) ? b[1] : b.latitude || b.lat);
  const aLng = toRad(Array.isArray(a) ? a[0] : a.longitude || a.lng || a.lon);
  const bLng = toRad(Array.isArray(b) ? b[0] : b.longitude || b.lng || b.lon);

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
  return 2 * R * asin(sqrt(ht));
}
