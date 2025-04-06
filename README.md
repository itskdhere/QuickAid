# QuickAid

AI-Powered Medical Assistance at Your Fingertips

## Overview

QuickAid is a comprehensive healthcare platform designed to provide immediate medical assistance and community support. The application combines AI-powered medical advice, emergency services access, community support, and health resources in one easy-to-use platform.

## Features

- **Self Diagnostics**: Get AI-powered symptoms analysis and preliminary guidance.
- **Find Nearby**: Locate the closest hospitals, clinics, and emergency services in your area.
- **Emergency Assistance** - Get ambulance services with your exact location details.
- **Community Support**: Connect with others and share health-related experiences.
- **Health Tips**: Get personalized health tips and advice based on your profile.
- **Emergency Contacts**: Quick access to emergency contacts and helplines.

## Project Structure

- **client**: React.js frontend built with TypeScript, Tailwind CSS & ShadCN UI.
- **server**: Node.js backend with TypeScript, Express.js, Passport.js, MongoDB and JWT.
- **ai**: Python AI service for medical assistance using Google Generative AI.
- **terraform**: Infrastructure as Code for deployment.
- **etc** - Nginx configuration, SSL certificates, and other configurations.
- **docker-compose.yml**: Docker Compose file for production deployment.

## Technologies

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios for API requests
- Framer Motion for animations

### Backend

- Node.js with Express
- MongoDB for database
- JWT for authentication
- Passport.js

### AI Service

- Python
- Flask for web service
- Google Generative AI integration
- BigQuery for data storage

### DevOps

- Docker and Docker Compose
- Terraform for infrastructure

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.9+
- Docker and Docker Compose
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/itskdhere/QuickAid.git
   cd QuickAid
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the .env file with your configuration.

3. Start the development environment with Docker:
   ```bash
   docker-compose up
   ```

### Running Individual Services

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
npm run dev
```

#### AI Service

```bash
cd ai
pip install -r requirements.txt
python app.py
```

## Deployment

The application can be deployed using Docker and Terraform:

```bash
cd terraform
terraform init
terraform apply
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
Built with by 💜 Turing Devs
</p>
