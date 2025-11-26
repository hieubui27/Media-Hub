export async function login(email: string, password: string) {
  const res = await fetch('/api/proxy/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      "email": email, 
      "password": password }),
  });
  const data = await res.json();
  return data;
}

export async function getUserInfo(token: string) {
  const res = await fetch('/api/proxy/me', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}
