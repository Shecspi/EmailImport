import json
from time import sleep

from channels.generic.websocket import WebsocketConsumer


class LetterConsumer(WebsocketConsumer):
    def connect(self):
        print("Connected")
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        print(text_data, bytes_data)

        for i in range(3):
            data = {
                "id": 1,
                "email": text_data,
                "topic": "Первое письмо",
                "message": "Текст первого письма. Он довольно длинный и может не влезть в отводимое ему пространство. Если не влезает, то должен обрезаться тремя точками в конце.",
                "date_of_send": "2024-01-01",
                "date_of_receive": "2024-01-01",
                "files": None,
            }
            self.send(json.dumps(data))
            sleep(1)
