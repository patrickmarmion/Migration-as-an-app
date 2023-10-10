const express = require('express');
const bodyParser = require("body-parser");
require('dotenv').config();
const app = express();

const verifyWebhookSignature = require("./Authentication/verifyWebhookSignature");
const Producer = require("./rabbitmq/producer");
const producer = new Producer();
const formId = process.env.FORM_ID;
const port = process.env.PORT;

app.use(bodyParser.json("application/json"));

app.post("/webhook", async (req, res) => {

    const isVerified = await verifyWebhookSignature(req, res);
    if (!isVerified) {
        console.error("Webhook Auth failed");
        return res.status(500).send("Webhook Auth failed");
    };

    if (! await verifyDocument(req.body[0].data)) {
        console.error("Wrong Doc");
        return res.status(204).send("Completed Document Not intended for this process");
    };
    
    console.log("Adding request to Queue...")
    await producer.publishMessage("Webhook Payload", req.body[0].data);

    res.status(201).send("Processing your request");
});

const verifyDocument = async (data) => {
    return data.linked_objects.length && data.linked_objects[0].entity_id === formId ? true : false;
};

app.get("/", (req, res) => {
    res.send("Up the Mighty Toffees");
});

app.listen(port, () => {
  console.log(`Server listening...${port}`);
});