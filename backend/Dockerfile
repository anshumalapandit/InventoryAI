FROM python:3.10-slim

WORKDIR /app

# copy everything first
COPY . .

RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "predict_api:app", "--host", "0.0.0.0", "--port", "8000"]
