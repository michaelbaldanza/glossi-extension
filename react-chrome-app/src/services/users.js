const BASE_URL = `http://localhost:3001/api/users/`;
// const BASE_URL = `http://glossi.lat/api/users/`;

async function login(creds) {
  console.log(`hitting react chrome app login`)
  const options = {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds),
  };
  return fetch(BASE_URL + 'login', options)
  .then(res => {
    if (res.ok) return res.json();
    throw new Error('bad credentials');
  })
  .then(({token}) => {
    return token ? JSON.parse(atob(token.split('.')[1])).user : null;
  })
}

export { login };