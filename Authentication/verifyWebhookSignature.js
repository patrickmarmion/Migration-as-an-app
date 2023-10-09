const crypto = require('crypto');
require('dotenv').config({
    path: "./env"
});

const verifyWebhookSignature = async (req, res, buf) => {
    const signature = req.query.signature;
    if (signature && req.method === "POST") {
        const hmac = crypto.createHmac("sha256", process.env.SHARED_KEY);
        hmac.update(buf);
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