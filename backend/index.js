require('dotenv').config();

const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

const {TronWeb} = require("tronweb");

const message = 'This is a message to be signed for Tron';

async function verifySignature(address, message, signature) {
    if (address && message && signature) {
        let isVerified = false;
        const tronweb = new TronWeb({
            fullHost: "https://api.trongrid.io"
        })

        const hexMessage = tronweb.toHex(message);

        let formattedSignature = signature.replace(/^0x/, "");

        const vPart = formattedSignature.substring(128, 130);


        if ("01" === vPart && (formattedSignature = formattedSignature.substring(0, 128) + "1c"), "00" === vPart && (formattedSignature = formattedSignature.substring(0, 128) + "1b"), "1b" !== formattedSignature.substring(formattedSignature.length - 2) && "1c" !== formattedSignature.substring(formattedSignature.length - 2)) {
            console.error("Invalid signature");
            return;
        }

        try {

            isVerified = await tronweb.trx.verifyMessage(
                hexMessage.replace(/^0x/, ""),
                formattedSignature,
                address,
                true
            )

            console.log("1 isVerified:", isVerified);
        } catch (e) {
            if (!isVerified) {
                const hexMessageWithoutPrefix = tronweb.toHex(message).replace(/^0x/, "");
                const byteArrayMessage = tronweb.utils.code.hexStr2byteArray(hexMessageWithoutPrefix);

                const hashedMessage = tronweb.sha3(byteArrayMessage).replace(/^0x/, "");

                try {
                    isVerified = await tronweb.trx.verifyMessage(
                        hashedMessage,
                        formattedSignature,
                        address,
                        true
                    )
                } catch (e) {
                    console.error("Error while verifying message:", e);
                }
            }
        }

        return isVerified;
    }
}

app.use(cors())
app.use(express.json());

app.get('/get-message', (req, res) => {
    res.json({ message });
});

app.post('/verify-signature', async (req, res) => {

    const { address, message, signature } = req.body;

    if (!address || !message || !signature) {
        return res.status(400).json({ error: "Необходимые параметры (address, message, signature) отсутствуют" });
    }

    const isValid = await verifySignature(address, message, signature);

    if (isValid) {
        res.json({ message: "Подпись валидна. Пользователь владеет кошельком." });
    } else {
        res.status(401).json({ error: "Подпись не валидна. Подделка!" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
