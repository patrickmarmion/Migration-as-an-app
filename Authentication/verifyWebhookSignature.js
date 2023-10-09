const crypto = require('crypto');
require('dotenv').config();

const verifyWebhookSignature = async (req, res) => {
    const signature = req.query.signature;
    console.log(process.env.SHARED_KEY);
    console.log("signature: " + signature);
    if (signature && req.method === "POST") {
        const buf = Buffer.from(JSON.stringify(req.body));
        const hmac = crypto.createHmac("sha256", process.env.SHARED_KEY).update(buf);
        const digest = hmac.digest("hex");
        console.log("This is the signature: " + digest);

        if (signature !== digest) {
            return false;
        }
    } else {
        return false;
    }
    return true;
};
module.exports = verifyWebhookSignature;