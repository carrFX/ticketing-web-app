import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;


export const createTicketsFetchDb = async (data: any) => {
    const res = await fetch(`${BASE_URL}/tickets/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const getTicketByEventFetchDb = async (data: any) => {
    const res = await fetch(`${BASE_URL}/tickets/by/${data}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: "include"
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const getTicketByIdFetchDb = async (data: any) => {
    const res = await fetch(`${BASE_URL}/tickets/${data}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        }
    })
    const result = await res.json();
    return { result, ok: res.ok };
}