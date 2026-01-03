

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

export async function changePassword(oldPassword: string, newPassword: string,confirmPassword: string, token: string) {
  const res = await fetch('/api/proxy/auth/change-password', {
    method: 'PATCH',
    headers:{
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "oldPassword": oldPassword,
      "newPassword": newPassword,
      "confirmPassword": confirmPassword
}),
  });
const data= await res.json();
return data;
}

export async function changeUserInfo(name:string,gender:string,token:string,dob:Date) {
  const res = await fetch('/api/auth/profile', {
    method: 'PATCH',
    headers:{
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      "userGender": gender,
      "userDob": dob|| null
}),
  });
  const data= await res.json();
  return data;
}

export async function getUserData(token:string){
  const res = await fetch('/api/auth/profile', {
    method: 'GET',
    headers:{
      'Authorization': `Bearer ${token}`
    },
  });
  const data= await res.json();
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('/api/proxy/auth/refresh', { // Thay đổi endpoint này theo backend của bạn
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  
  if (!res.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await res.json();
  return data; // Mong đợi trả về { accessToken: "...", refreshToken: "..." }
}