function getToken() {
  let token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      token = null;
    }
  }
  return token;
}

export { getToken };