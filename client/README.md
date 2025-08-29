# NutriPlan Pro Frontend

A comprehensive React-based frontend for the NutriPlan Pro AI-Powered Personalized Meal Planning Platform.

## Features

### User Features
- **Authentication**: Secure login/register with JWT
- **Dashboard**: Personalized overview with nutrition goals and recent recipes
- **Recipe Management**: Create, edit, and manage personal recipes
- **Meal Planning**: Weekly meal planning with AI-powered suggestions
- **Profile Management**: Comprehensive user profile with dietary preferences
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Features
- **Admin Dashboard**: System overview and quick actions
- **User Management**: View and manage user accounts
- **Recipe Moderation**: Approve/reject pending recipes
- **Analytics**: System performance and user insights

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Charts**: Chart.js with React Chart.js 2

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running (see backend setup)

## Installation

1. **Clone the repository**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3001` (since backend uses port 3000).

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared/common components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout and navigation
│   ├── mealPlans/      # Meal planning components
│   ├── profile/        # User profile components
│   └── recipes/        # Recipe management components
├── store/              # Redux store and slices
│   └── slices/         # Redux slices for state management
├── services/           # API services
├── types/              # TypeScript interfaces
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Integration

The frontend integrates with the NutriPlan Pro backend API:

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT-based with automatic token refresh
- **Endpoints**: 
  - `/auth/*` - Authentication endpoints
  - `/recipes/*` - Recipe management
  - `/meal-plans/*` - Meal planning
  - `/admin/*` - Admin operations
  - `/ai/*` - AI-powered features

## Demo Accounts

### Admin Account
- **Email**: admin@nutriplan.com
- **Password**: admin123

### Regular User
- Register a new account through the registration form

## Key Components

### Authentication
- **Login**: Email/password authentication
- **Register**: Comprehensive user registration with health preferences
- **Private Routes**: Protected routes requiring authentication

### Dashboard
- **User Dashboard**: Personal overview with quick actions
- **Admin Dashboard**: System management and analytics

### Recipe Management
- **Recipe List**: Browse and search recipes
- **Recipe Creation**: Form-based recipe creation
- **Recipe Details**: Comprehensive recipe view

### Meal Planning
- **Weekly View**: Calendar-based meal planning
- **AI Suggestions**: AI-powered meal recommendations
- **Nutrition Tracking**: Calorie and macro tracking

## Styling

The application uses Tailwind CSS with custom utility classes:

- **Color System**: Primary, secondary, success, warning, danger colors
- **Components**: Pre-built component classes (buttons, cards, inputs)
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and hover effects

## State Management

Redux Toolkit is used for state management with the following slices:

- **Auth**: User authentication and profile
- **Recipes**: Recipe data and operations
- **Meal Plans**: Meal planning data
- **AI**: AI analysis and suggestions
- **Admin**: Administrative data and operations

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new components
3. Follow the established naming conventions
4. Add proper error handling and loading states
5. Ensure responsive design for mobile devices

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 3000 is busy, the backend will show an error
2. **API Connection**: Ensure the backend is running before starting the frontend
3. **Dependencies**: Run `npm install` if you encounter module not found errors

### Development Tips

- Use React DevTools for debugging
- Check the browser console for API errors
- Use Redux DevTools for state debugging
- Test on multiple screen sizes for responsive design

## License

MIT License - see LICENSE file for details
