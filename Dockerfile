FROM node:18

# Install Expo CLI globally
RUN npm install -g expo-cli

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Ensure Expo-compatible native packages are installed
RUN npx expo install || true

# Copy the rest of the app code
COPY . .

# Default command
CMD ["npm", "start"]
