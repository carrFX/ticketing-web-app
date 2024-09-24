import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getCouponsUser = async () => {
    const res = await fetch(`${BASE_URL}/transaction/coupons`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const getPointsUser = async () => {
    const res = await fetch(`${BASE_URL}/transaction/points`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const buyTicketsFetchDb = async (data: any) => {
    const res = await fetch(`${BASE_URL}/transaction/buy-tickets`, {
        method: 'PATCH',
        body : JSON.stringify(data),
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const result = await res.json();
    return { result, ok: res.ok };
}