import { tronService } from './tron.service';
const MESSAGE = 'This is a message to be signed for Tron';
export class TronController {
    async getMessage(req, res) {
        res.json({ message: MESSAGE });
    }
    async verifySignature(req, res) {
        const { address, message, signature } = req.body;
        if (!address || !message || !signature) {
            return res.status(400).json({
                success: false,
                message: "Required parameters (address, message, signature) are missing"
            });
        }
        const isValid = await tronService.verifySignature(address, message, signature);
        if (isValid) {
            res.json({
                success: true,
                message: "Wallet verified successfully"
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Verification failed"
            });
        }
    }
}
export const tronController = new TronController();
