FROM python:3.12-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY . /app
COPY mountdb.sh /usr/local/bin/mountdb.sh

RUN pip install -r requirements.txt
RUN dos2unix /usr/local/bin/mountdb.sh && chmod +x /usr/local/bin/mountdb.sh

ENTRYPOINT ["bash", "/usr/local/bin/mountdb.sh"]