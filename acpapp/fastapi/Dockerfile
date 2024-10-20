# Start with a base image
FROM python:3.12

# Set the working directory
WORKDIR /src

# Copy requirements.txt (if you have one) or add the packages directly
COPY requirements.txt ./

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Alternatively, you can add the installations directly:
# RUN pip install fastapi uvicorn bcrypt

# Copy the rest of your application code
COPY . .

# Expose the port
EXPOSE 8000

# Command to run your application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
