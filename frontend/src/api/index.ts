const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function getSignMessage (walletAddress: string): Promise<{message: string}> {
    const response = await fetch(`${BASE_URL}/api/tron/get-message`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export async function verifySignMessage (walletAddress: string, message: string, signature: string): Promise<{isValid: boolean; message: string}> {
    const response = await fetch(`${BASE_URL}/api/tron/verify-signature`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress, message, signature }),
    });
    const data = await response.json();

    return { 
        isValid: response.ok,
        message: data.message 
    };
}
