import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const createEventsFetchDb = async (formData: any) => {
    const res = await fetch(`${BASE_URL}/events/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const getEventsActive = async () => {
    const res = await fetch(`${BASE_URL}/events/event-active`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

// detail event
export const detailEventFetchDb = async (id: string) => {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    const result = await res.json();
    return { result, ok: res.ok };
}

export const allEventsFetchDb = async () => {
    const res = await fetch(`${BASE_URL}/events/get-all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const result = await res.json();
    return { result, ok: res.ok };
}