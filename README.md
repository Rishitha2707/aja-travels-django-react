# AJA Travels - Bus Booking System

A full-stack bus booking application built with Django REST Framework backend and React frontend.

## Features

- User authentication (registration and login)
- Browse available buses
- View bus details and seat availability
- Book seats
- View booking history
- Admin panel for managing buses and bookings

## Project Structure

```
Aja_Travels/
├── django/
│   └── travels/          # Django backend
│       ├── bookings/     # Main app
│       └── travels/     # Project settings
└── react/                # React frontend
```

## Backend Setup (Django)

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Navigate to the Django directory:
```bash
cd django/travels
```

2. Create and activate a virtual environment (if not already created):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## Frontend Setup (React)

### Prerequisites
- Node.js 14+
- npm

### Installation

1. Navigate to the React directory:
```bash
cd react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `GET /api/buses/` - List all buses
- `GET /api/buses/<id>/` - Get bus details
- `GET /api/buses/<id>/seats/` - Get seats for a bus
- `POST /api/bookings/` - Create a booking (requires authentication)
- `GET /api/users/<user_id>/bookings/` - Get user bookings (requires authentication)

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` using your superuser credentials.

## Technologies Used

### Backend
- Django 6.0
- Django REST Framework
- Django CORS Headers
- SQLite (default database)

### Frontend
- React 18
- React Router
- Axios
- CSS3

## Notes

- Make sure both servers are running simultaneously
- The React app is configured to connect to `http://localhost:8000` for API calls
- CORS is configured to allow requests from `http://localhost:3000`
