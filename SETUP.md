# Installation Guide

## Backend Setup (Django)

### Step 1: Navigate to Django directory
```bash
cd django/travels
```

### Step 2: Activate virtual environment (if using one)
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Step 3: Install Python packages
```bash
pip install -r requirements.txt
```

This will install:
- Django 6.0
- Django REST Framework 3.16.1
- Django CORS Headers 4.3.1

### Step 4: Run migrations
```bash
python manage.py migrate
```

### Step 5: Create superuser (optional)
```bash
python manage.py createsuperuser
```

### Step 6: Start Django server
```bash
python manage.py runserver
```

Server will run on: `http://localhost:8000`

---

## Frontend Setup (React)

### Step 1: Navigate to React directory
```bash
cd react
```

### Step 2: Install Node.js packages
```bash
npm install
```

This will install:
- react (^18.2.0)
- react-dom (^18.2.0)
- react-router-dom (^6.20.0)
- axios (^1.6.2)
- react-scripts (^5.0.1)

### Step 3: Start React development server
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

---

## Prerequisites

### For Backend:
- Python 3.8 or higher
- pip (Python package manager)

### For Frontend:
- Node.js 14 or higher
- npm (comes with Node.js)

---

## Troubleshooting

### If pip install fails:
- Make sure Python is installed: `python --version`
- Try: `python -m pip install -r requirements.txt`

### If npm install fails:
- Make sure Node.js is installed: `node --version`
- Try: `npm install --legacy-peer-deps`

### If CORS errors occur:
- Make sure Django server is running
- Check that `django-cors-headers` is installed
- Verify CORS settings in `django/travels/travels/settings.py`
