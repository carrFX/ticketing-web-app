import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const ProfileFetchDb = async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const EditAvatarFetchDb = async (formData: any) => {
    const res = await fetch(`${BASE_URL}/users/avatar`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });

      const result = await res.json();
    return { result, ok: res.ok };
}

export const deleteAvatarFetchDb = async () => {
    const res = await fetch(`${BASE_URL}/users/delete-avatar`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const deleteUsersAccountFetchDb = async () => {
    const res = await fetch(`${BASE_URL}/users/delete-user`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const buyingTicketsFetchDb = async (data: any) => {
    const res = await fetch(`${BASE_URL}/transaction/buy-tickets`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}