# Meal Suggestions Feature

## Overview
The Meal Suggestions feature allows users to suggest meals to other users in the NutriPlan Pro application. Users can suggest existing recipes or custom meal ideas, and recipients can accept or reject these suggestions.

## Features

### 1. Create Meal Suggestions
- **Recipe-based suggestions**: Suggest existing recipes from the platform
- **Custom meal suggestions**: Suggest custom meal ideas with descriptions
- **User targeting**: Select specific users to receive suggestions
- **Reasoning**: Optional explanation for why the meal is being suggested

### 2. Manage Suggestions
- **View sent suggestions**: Track all suggestions you've made
- **View received suggestions**: See suggestions from other users
- **Accept/Reject**: Respond to received suggestions
- **Delete**: Remove your own suggestions

### 3. Dashboard Integration
- **Quick actions**: Suggest meals directly from dashboard
- **Widgets**: View recent suggestions and their status
- **Notifications**: Badge showing unaccepted suggestions

## Components

### Core Components
- `MealSuggestions.tsx` - Main suggestions management interface
- `CreateMealSuggestion.tsx` - Form for creating new suggestions
- `NotificationBadge.tsx` - Badge showing unread suggestions count

### Hooks
- `useMealSuggestions.ts` - Custom hook for suggestions state management

### Redux Store
- `mealSuggestionsSlice.ts` - State management for suggestions

## API Endpoints

The frontend integrates with these backend endpoints:
- `POST /api/meal-suggestions` - Create new suggestion
- `GET /api/meal-suggestions/user` - Get user's sent suggestions
- `GET /api/meal-suggestions/received` - Get received suggestions
- `PUT /api/meal-suggestions/:id/accept` - Accept suggestion
- `PUT /api/meal-suggestions/:id/reject` - Reject suggestion
- `DELETE /api/meal-suggestions/:id` - Delete suggestion

## User Experience

### Creating Suggestions
1. Navigate to Meal Suggestions
2. Click "Suggest a Meal"
3. Select target user
4. Choose meal type (breakfast, lunch, dinner, snack)
5. Select existing recipe OR describe custom meal
6. Add optional reason
7. Submit suggestion

### Managing Suggestions
1. **Received Suggestions Tab**: View and respond to incoming suggestions
2. **Sent Suggestions Tab**: Track your outgoing suggestions
3. **Dashboard Widgets**: Quick overview of suggestion status

### Navigation
- Added to main navigation with notification badge
- Quick action button on dashboard
- Integrated with existing layout and styling

## Technical Implementation

### State Management
- Redux store with dedicated slice
- Async thunks for API operations
- Optimistic updates for better UX

### TypeScript Integration
- Full type safety with interfaces
- Proper error handling
- Loading states management

### Styling
- Tailwind CSS for consistent design
- Responsive layout
- Interactive elements with hover states

## Future Enhancements

### Potential Improvements
- **Real-time notifications**: WebSocket integration for instant updates
- **Suggestion templates**: Pre-defined suggestion categories
- **Bulk suggestions**: Suggest multiple meals at once
- **Suggestion history**: Detailed tracking and analytics
- **Integration with meal plans**: Auto-add accepted suggestions to plans

### Advanced Features
- **AI-powered suggestions**: Use AI to recommend meals based on preferences
- **Social features**: Share suggestions publicly or with groups
- **Rating system**: Rate and review suggestions
- **Suggestion challenges**: Weekly/monthly suggestion themes

## Usage Examples

### Example 1: Suggesting a Recipe
```typescript
const suggestionData = {
  user_id: 123,
  meal_type: 'lunch',
  recipe_id: 456,
  reason: 'This recipe is perfect for your high-protein diet!'
};
```

### Example 2: Custom Meal Suggestion
```typescript
const suggestionData = {
  user_id: 123,
  meal_type: 'breakfast',
  custom_meal: 'Greek yogurt with berries and granola - great for energy!',
  reason: 'Light and nutritious start to your day'
};
```

## Testing

### Component Testing
- Form validation
- API integration
- Error handling
- Loading states

### User Flow Testing
- Complete suggestion workflow
- Accept/reject functionality
- Navigation between tabs
- Dashboard integration

## Dependencies

- React 18+
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Axios for API calls

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App compatible
