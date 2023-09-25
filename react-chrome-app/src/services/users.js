// const BASE_URL = `http://localhost:3001/api/users/`;
const BASE_URL = `http://glossi.lat/api/users/`;

async function login(creds) {
  console.log(`hitting react chrome app login`)
  const options = {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds),
  };
  return fetch(BASE_URL + 'login', options)
  .then(res => {
    console.log(res);
    if (res.ok) return res.json().then(({token}) => {
      return token ? JSON.parse(atob(token.split('.')[1])).user : null;
    });
    const error = {};
    if (res.status && res.statusText) {
      console.log(typeof(res.status));
      error.error = true;
      error.status = res.status;
      error.statusText = res.statusText;
    }
    console.log(`going to serve this erro`)
    console.log(error);
    return error;
  })
}

export { login };