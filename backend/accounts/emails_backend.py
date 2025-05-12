import ssl
import smtplib
import socket
from django.core.mail.backends.smtp import EmailBackend

class UnsafeEmailBackend(EmailBackend):
    def open(self):
        if self.connection:
            return False
        try:
            # Set default local hostname if not defined
            self.local_hostname = getattr(self, 'local_hostname', socket.getfqdn())

            self.connection = smtplib.SMTP(
                self.host,
                self.port,
                local_hostname=self.local_hostname
            )
            self.connection.ehlo()
            if self.use_tls:
                context = ssl._create_unverified_context()
                self.connection.starttls(context=context)
                self.connection.ehlo()
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except Exception as e:
            if not self.fail_silently:
                raise
            return False