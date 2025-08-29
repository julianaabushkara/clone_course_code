#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

const char* ssid = "AirCarmel";
const char* password = ""; // Use "" for open WiFi

const int buttonPin = 4; // Button connected to GPIO 4
const int ledPin = 2;    // Onboard LED (usually GPIO 2, but check your board!)

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void setup() {
  Serial.begin(115200);
  delay(100);

  pinMode(buttonPin, INPUT_PULLUP); 
  pinMode(ledPin, OUTPUT);

  digitalWrite(ledPin, HIGH); // <<<<<< LED always ON

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.addHandler(&ws);
  server.begin();
}

void loop() {
  int buttonState = digitalRead(buttonPin);

  if (buttonState == LOW) { // Button pressed
    ws.textAll("HOME");
    delay(500); 
  }

  delay(100);
}