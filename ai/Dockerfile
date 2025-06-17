FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE ${port}

CMD ["python", "app.py"]