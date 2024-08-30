import json

from imap_tools import MailBox

from channels.generic.websocket import WebsocketConsumer

from main.models import Email, Letter


class LetterConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        email_instance = Email.objects.get(email=text_data)
        login = email_instance.email
        password = email_instance.password
        imap_server = email_instance.imap_server

        with MailBox(imap_server).login(login, password) as mailbox:
            num_of_letters = len(mailbox.uids())
            num_of_checked = 0
            email = Email.objects.get(email=login)

            for msg in mailbox.fetch():
                # Если такое письмо уже есть в базе, то отправляем клиенту количество проверенных писем
                # и переходи к следующему письму
                if Letter.objects.filter(uid=msg.uid, email=email).exists():
                    num_of_checked += 1
                    self.send(
                        json.dumps(
                            {
                                "type": "checked",
                                "num_of_checked": num_of_checked,
                            }
                        )
                    )
                    continue

                # Если письмо новое, то сохраняем его в базу и отправляем данные клиенту.
                # Так как в приложении нет возможности удалять проверенные письма, то можно быть уверенным,
                # что после первого встреченного непроверенного письма будут только непроверенные.
                Letter.objects.create(
                    email=email,
                    uid=msg.uid,
                    subject=msg.subject,
                    message=msg.html,
                    date_of_send=msg.date,
                )
                data = {
                    "type": "new",
                    "num_of_letters": num_of_letters,
                    "uid": msg.uid,
                    "topic": msg.subject,
                    "message": msg.html,
                    "date_of_send": msg.date.strftime("%d.%m.%Y"),
                    "date_of_receive": Letter.objects.last().date_of_receive.strftime(
                        "%d.%m.%Y"
                    ),
                    "files": [att.filename for att in msg.attachments],
                }
                self.send(json.dumps(data))
