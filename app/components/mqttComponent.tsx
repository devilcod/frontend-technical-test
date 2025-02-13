// components/MQTTComponent.tsx
"use client";

import { useEffect, useState } from "react";
import {
  connectToMQTT,
  disconnectMQTT,
  publishMessage,
} from "../../utils/mqttClient";

const MQTTComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const client = connectToMQTT((topic, message) => {
      setMessages((prev) => [...prev, `${topic}: ${message}`]);
      console.log("🚀 ~ client ~ message:", message);
    });

    return () => {
      disconnectMQTT();
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      publishMessage(process.env.NEXT_PUBLIC_MQTT_TOPIC!, inputMessage);
      setInputMessage("");
    }
  };

  return <></>;
};

export default MQTTComponent;
