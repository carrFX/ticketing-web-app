import { ILoginUser, IRegisterUser } from '@/type/authType';
import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const loginFetchDb = async (data: ILoginUser) => {
  // mengakses(membuat) dan mengambil(fetch) data login dari db
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    body: JSON.stringify(data), // (data) yaitu dari parameter:ILoginUser yang berasal dari form login
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json(); // mengubah data res (json) ke bentuk (object)
  return { result, ok: res.ok }; // ok jika proses fetchnya sukses
};

export const registerFetchDb = async (data: IRegisterUser) => {
  // mengakses(membuat) dan mengambil(fetch) data register dari db
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return { result, ok: res.ok }; 
};

export const logoutFetchDb = async () => {
  const res = await fetch(`http://localhost:8000/api/users/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json();
  return { result, ok: res.ok }; 
}

export const refreshToken = async () => {
  const res = await fetch(`http://localhost:8000/api/users/token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const result = await res.json();
  return { result, ok: res.ok };
}