import mqtt, { MqttClient, IClientOptions } from "mqtt";

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER_URL!;
const MQTT_USERNAME = process.env.NEXT_PUBLIC_MQTT_USERNAME!;
const MQTT_PASSWORD = process.env.NEXT_PUBLIC_MQTT_PASSWORD!;

let client: MqttClient | null = null;
const callbacks: { [topic: string]: Array<(message: string) => void> } = {};

export const connectToMQTT = () => {
  if (!client) {
    const options: IClientOptions = {
      clientId: "nextjs-client-" + Math.random().toString(16).substr(2, 8),
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };

    client = mqtt.connect(MQTT_BROKER_URL, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      Object.keys(callbacks).forEach((topic) => {
        client?.subscribe(topic, (err) => {
          err
            ? console.error(`Subscribe error ${topic}:`, err)
            : console.log(`Resubscribed to ${topic}`);
        });
      });
    });

    client.on("message", (topic, message) => {
      const msg = message.toString();
      callbacks[topic]?.forEach((cb) => cb(msg));
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });
  }
  return client;
};

export const subscribeToTopic = (
  topic: string,
  callback: (message: string) => void
) => {
  if (!callbacks[topic]) callbacks[topic] = [];
  callbacks[topic].push(callback);

  if (client?.connected) {
    client.subscribe(topic, (err) => {
      err
        ? console.error(`Subscribe error ${topic}:`, err)
        : console.log(`Subscribed to ${topic}`);
    });
  }
};

export const unsubscribeFromTopic = (
  topic: string,
  callback: (message: string) => void
) => {
  if (!callbacks[topic]) return;

  const index = callbacks[topic].indexOf(callback);
  if (index >= 0) {
    callbacks[topic].splice(index, 1);
    if (callbacks[topic].length === 0) {
      delete callbacks[topic];
      if (client?.connected) {
        client.unsubscribe(topic, (err) => {
          err
            ? console.error(`Unsubscribe error ${topic}:`, err)
            : console.log(`Unsubscribed from ${topic}`);
        });
      }
    }
  }
};

export const disconnectMQTT = () => {
  if (client) {
    client.end();
    client = null;
    console.log("Disconnected from MQTT");
  }
};
