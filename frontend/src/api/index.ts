export async function getSignMessage(walletAddress: string): Promise<string> {
        const response = await fetch('http://localhost:3001/sign-message', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: walletAddress,
            }),
        });
        return await response.json();
}
