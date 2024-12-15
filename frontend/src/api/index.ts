export async function getSignMessage (walletAddress: string): Promise<{message: string}> {
    const response = await fetch('http://localhost:3001/get-message', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export async function verifySignMessage (walletAddress: string, message: string, signature: string): Promise<{isValid: boolean}> {
    const response = await fetch('http://localhost:3001/verify-signature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress, message, signature }),
    });
    const data = await response.json();

    if (response.ok) {
        console.log('Успешная верификация:', data.message);
        // Здесь можно произвести вход или другие действия
    } else {
        console.error('Ошибка верификации:', data.error);
    }
}
