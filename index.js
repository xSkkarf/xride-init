const express = require('express');
const mqtt = require('mqtt');

const app = express();
app.use(express.json());

const port = 3000 || process.env.PORT;
let status = false;

// Set up MQTT client to connect to a public broker
const MQTT_BROKER_URL = 'mqtt://test.mosquitto.org'; // Replace with your broker URL
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on('connect', () => {
    console.log(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);
});

mqttClient.on('message', (topic, message) => {
    console.log(`Message received on topic ${topic}: ${message.toString()}`);
    // Process the message if it's a response from a car
    // You can update the server state based on the message content
});

// Define your Express routes
app.get('/toggle', (req, res) => {
    status = !status;
    res.send(status.toString());
    console.log('Status changed:', status);
});

app.get('/getstatus', (req, res) => {
    res.send(status.toString());
});

app.post('/request_access', (req, res) => {
    let carId = req.body["car_id"];
    let userId = req.body["user_id"];
    console.log(`Car ID: ${carId}, User ID: ${userId}`);
    
    // Publish an MQTT message to the car's topic
    const topic = `car/${carId}/commands`;
    const message = JSON.stringify({ command: 'unlock', user_id: userId });
    mqttClient.publish(topic, message, () => {
        console.log(`Unlock request sent to car ${carId}`);
    });

    res.send("IDs requested successfully");
});

// Start the Express server
app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
