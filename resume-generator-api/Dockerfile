FROM python:3.9.6

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt


RUN apt-get update && apt-get install -y gcc musl-dev python3-dev postgresql postgresql-contrib wkhtmltopdf && pip install -r requirements.txt

COPY . .