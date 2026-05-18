# Acapella

A music streaming platform for Tanzanian choirs, built with Laravel 13 and React 19.

## Overview

Acapella connects listeners with choir music across Tanzania. Users can explore choirs, albums, and tracks, create playlists, and subscribe for premium access. Choir managers can manage their content, while admins oversee the platform.

## Tech Stack

### Backend
- **Framework:** Laravel 13.8 (PHP 8.3+)
- **Authentication:** Laravel Sanctum
- **Real-time:** Laravel Reverb
- **Email:** Laravel Mail (Gmail SMTP)
- **Database:** MySQL

### Frontend
- **Framework:** React 19.2
- **Routing:** Inertia.js 3
- **UI:** Tailwind CSS 4, Headless UI, React Icons
- **Build:** Vite 8
- **HTTP:** Axios

### Payment Integration
- **Mongike** (Tanzanian payment gateway) - Webhook-based subscription handling

## Features

### User Roles
- **Listener:** Browse, play, like tracks, create playlists, subscribe to premium
- **Choir Manager:** Manage choirs, albums, tracks, view analytics
- **Admin:** Manage users, approve choir manager requests, oversee feedback

### Core Functionality
- Choir and album browsing with verification system
- Track playback with queue management
- Playlist creation and management
- Like/unlike tracks
- Premium subscriptions with Mongike payment integration
- Donation support
- Feedback and support system
- Choir manager request and approval workflow
- Password reset with email verification

## Installation

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- MySQL 8+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd acapella_api_2

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
# DB_DATABASE=acapella
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Build frontend assets
npm run build

# Start development server
composer run dev
```

### Development Scripts

```bash
# Quick setup (install all dependencies and migrate)
composer run setup

# Start development servers (API, queue, logs, Vite)
composer run dev

# Run tests
composer run test

# Lint frontend code
npm run lint
npm run lint:fix
```

## Project Structure

```
acapella_api_2/
├── app/
│   ├── Http/Controllers/Api/    # API controllers
│   ├── Models/                  # Eloquent models
│   ├── Mail/                    # Email mailables
│   └── Services/                # Business logic services
├── database/
│   ├── migrations/              # Database migrations
│   └── seeders/                 # Database seeders
├── resources/
│   ├── js/
│   │   ├── Components/          # Reusable React components
│   │   ├── Layout/              # Layout components
│   │   ├── Pages/               # Inertia page components
│   │   │   ├── Admin/           # Admin pages
│   │   │   ├── Auth/            # Authentication pages
│   │   │   ├── ChoirManager/    # Choir manager pages
│   │   │   ├── Listener/        # Listener pages
│   │   │   ├── Public/          # Public pages
│   │   │   └── Shared/          # Shared pages
│   │   ├── Services/            # API service layer
│   │   └── Utils/               # Utility functions
│   ├── views/emails/            # Email templates
│   └── css/                     # CSS files
├── routes/
│   ├── api.php                  # API routes
│   └── web.php                  # Web/Inertia routes
└── public/                      # Public assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (authenticated)
- `GET /api/auth/me` - Get current user (authenticated)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Public Resources
- `GET /api/choirs` - List all choirs
- `GET /api/choirs/{choir}` - Get choir details
- `GET /api/albums` - List all albums
- `GET /api/albums/{album}` - Get album details
- `GET /api/tracks` - List all tracks
- `GET /api/tracks/{track}` - Get track details
- `GET /api/tracks/{track}/related` - Get related tracks
- `POST /api/donations/initiate` - Initiate donation
- `POST /api/manager-requests` - Submit choir manager request

### Protected Routes (Authenticated)
- `POST /api/tracks/{track}/like` - Like track
- `DELETE /api/tracks/{track}/like` - Unlike track
- `GET /api/queue` - Get playback queue
- `POST /api/tracks/{track}/queue` - Add to queue
- `POST /api/queue/reorder` - Reorder queue
- `DELETE /api/queue/{queue}` - Remove from queue
- `DELETE /api/queue` - Clear queue
- `GET /api/playlists` - List playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/{playlist}` - Get playlist
- `PUT /api/playlists/{playlist}` - Update playlist
- `DELETE /api/playlists/{playlist}` - Delete playlist
- `POST /api/subscriptions/initiate` - Initiate subscription
- `GET /api/subscriptions/status` - Get subscription status
- `POST /api/feedbacks` - Submit feedback
- `GET /api/feedbacks/mine` - Get user's feedbacks

### Admin Routes (Admin only)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/{user}/role` - Update user role
- `POST /api/admin/choirs/{choir}/verify` - Verify choir
- `POST /api/admin/choirs/{choir}/unverify` - Unverify choir
- `GET /api/admin/manager-requests` - List manager requests
- `GET /api/admin/manager-requests/{id}` - Get manager request
- `PUT /api/admin/manager-requests/{id}` - Update manager request
- `DELETE /api/admin/manager-requests/{id}` - Delete manager request
- `GET /api/admin/feedbacks` - List all feedbacks
- `GET /api/admin/feedbacks/{id}` - Get feedback
- `PUT /api/admin/feedbacks/{id}` - Update feedback
- `DELETE /api/admin/feedbacks/{id}` - Delete feedback

### Choir Manager Routes (Choir Manager/Admin)
- `POST /api/choirs` - Create choir
- `PUT /api/choirs/{choir}` - Update choir
- `DELETE /api/choirs/{choir}` - Delete choir
- `POST /api/albums` - Create album
- `PUT /api/albums/{album}` - Update album
- `DELETE /api/albums/{album}` - Delete album
- `POST /api/tracks` - Create track
- `PUT /api/tracks/{track}` - Update track
- `DELETE /api/tracks/{track}` - Delete track

### User Routes
- `GET /api/users/me` - Get current user
- `GET /api/users` - List users (admin only)
- `GET /api/users/{user}` - Get user
- `PUT /api/users/{user}` - Update user
- `DELETE /api/users/{user}` - Delete user

## Pages

### Public Pages
- `/welcome` - Landing page with stats
- `/premium` - Premium subscription page
- `/become-choir-manager` - Information about becoming a choir manager
- `/become-choir-manager/submit` - Submit manager request form
- `/feedback` - Submit feedback form
- `/donate` - Donation page
- `/terms-of-service` - Terms of service
- `/privacy-policy` - Privacy policy

### Authentication Pages
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Request password reset
- `/reset-password/{token}` - Reset password with token

### Listener Pages
- `/explore` - Browse choirs, albums, tracks
- `/library` - User's music library
- `/profile` - User settings
- `/album/{id}` - Album details
- `/choir/{id}` - Choir details
- `/play-track/{id}` - Track player
- `/playlist/{id}` - Playlist details
- `/payments` - Payment history

### Choir Manager Pages
- `/manager` - Dashboard
- `/manager/choirs` - Manage choirs
- `/manager/choirs/{id}/content` - Manage choir content
- `/manager/choirs/{choirId}/albums/{albumId}/tracks` - Manage album tracks
- `/manager/profile` - Manager profile

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/choirs` - Manage choirs
- `/admin/users` - Manage users
- `/admin/manager-requests` - Manage manager requests
- `/admin/manager-requests/{id}` - View manager request
- `/admin/feedbacks` - Manage feedbacks
- `/admin/feedbacks/{id}` - View feedback
- `/admin/profile` - Admin profile

## Database Models

- **User** - User accounts with soft deletes, roles (listener, choir_manager, admin), premium status
- **Choir** - Choir profiles with verification status
- **Album** - Music albums belonging to choirs
- **Track** - Individual tracks with playback data
- **Playlist** - User-created playlists
- **Queue** - Playback queue for users
- **Subscription** - Premium subscriptions with Mongike integration
- **Feedback** - User feedback with soft deletes
- **ManagerRequest** - Choir manager approval requests

## Environment Configuration

Key `.env` variables:

```env
APP_NAME=Acapella
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=acapella
DB_USERNAME=
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="${APP_NAME}"

# Mongike Payment Gateway
MONGIKE_SECRET_KEY=
MONGIKE_WEBHOOK_SECRET=
```

## Email Templates

Email templates are located in `resources/views/emails/`:
- `password-reset.blade.php` - Password reset email
- `manager-credentials.blade.php` - Choir manager credentials email

## Security

- API routes protected with Laravel Sanctum tokens
- Role-based access control (RBAC) middleware
- Rate limiting on authentication endpoints
- Soft deletes for sensitive data recovery
- Password hashing with Laravel's Hash facade
- CSRF protection for web routes

## Testing

```bash
# Run PHPUnit tests
composer run test
```

## Code Quality

```bash
# ESLint for frontend
npm run lint
npm run lint:fix

# Laravel Pint for backend PHP formatting
./vendor/bin/pint
```

## License

MIT License

## Support

For feedback or issues, use the in-app feedback form or contact support.
