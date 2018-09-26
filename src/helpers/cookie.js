export function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : undefined;
}
