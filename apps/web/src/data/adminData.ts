import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getCustomersFetchDb = async () => {
    const res = await fetch(`${BASE_URL}/transaction`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const getSalesFetchDb = async () => {}

export const getProductsFetchDb = async () => {
    const res = await fetch(`${BASE_URL}/tickets/active`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}