import { TronWeb } from 'tronweb';
export class TronService {
    constructor() {
        this.tronWeb = new TronWeb({
            fullHost: "https://api.trongrid.io"
        });
    }
    async verifySignature(address, message, signature) {
        if (!address || !message || !signature) {
            return false;
        }
        let isVerified = false;
        const hexMessage = this.tronWeb.toHex(message);
        let formattedSignature = signature.replace(/^0x/, "");
        const vPart = formattedSignature.substring(128, 130);
        if ("01" === vPart) {
            formattedSignature = formattedSignature.substring(0, 128) + "1c";
        }
        if ("00" === vPart) {
            formattedSignature = formattedSignature.substring(0, 128) + "1b";
        }
        if ("1b" !== formattedSignature.substring(formattedSignature.length - 2) &&
            "1c" !== formattedSignature.substring(formattedSignature.length - 2)) {
            console.error("Invalid signature");
            return isVerified;
        }
        try {
            isVerified = await this.tronWeb.trx.verifyMessage(hexMessage.replace(/^0x/, ""), formattedSignature, address, true);
        }
        catch (e) {
            if (!isVerified) {
                try {
                    const hexMessageWithoutPrefix = this.tronWeb.toHex(message).replace(/^0x/, "");
                    const byteArrayMessage = this.tronWeb.utils.code.hexStr2byteArray(hexMessageWithoutPrefix);
                    const hashedMessage = this.tronWeb.sha3(byteArrayMessage).replace(/^0x/, "");
                    isVerified = await this.tronWeb.trx.verifyMessage(hashedMessage, formattedSignature, address, true);
                }
                catch (e) {
                    console.error("Error while verifying message:", e);
                }
            }
        }
        return isVerified;
    }
}
export const tronService = new TronService();
