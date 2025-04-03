<p align="center">
  <img src="./assets/images/icon-nobg.png" alt="Clear Meals Logo" width="400" height="400">
</p>

<p align="center">
  <em>Track with ease, savor simplicity</em>
</p>


# Clear Meals: A Comprehensive Mobile Meal Tracking Application

Clear Meals is a robust, user-friendly mobile application designed to help users track their daily food intake, monitor nutritional information, and maintain a healthy lifestyle. Built with React Native and Expo, this app offers a seamless experience for logging meals, searching for foods, and analyzing nutritional data.

## 🌟 Features

- **User Authentication**: Secure sign-up, sign-in, and email verification system.
- **Food Search**: Powered by the FatSecret API for an extensive database of food items.
- **Meal Logging**: Easy-to-use interface for adding foods to different meal types (Breakfast, Lunch, Dinner, Snack).
- **Nutritional Information**: Detailed nutritional breakdown for each food item and meal.
- **Daily Log**: Comprehensive view of daily food intake and nutritional totals.
- **Calendar View**: Historical data of meal logs with an interactive calendar.
- **Customizable Serving Sizes**: Adjust serving sizes and see real-time nutritional updates.
- **User Profile Management**: Account settings and data management options.

## 🛠 Technologies Used

- **React Native**: Core framework for building the mobile application.
- **Expo**: Development platform for easy building and deployment.
- **Firebase**: 
  - Authentication for user management.
  - Firestore for database storage.
  - Cloud Functions for secure API interactions.
- **FatSecret API**: Extensive food database and nutritional information.
- **TypeScript**: For type-safe code and improved developer experience.

## 📲 How to Use (Currently Android Only)
*For developers see `SETUP.md`*

1. **Download**: Install the latest APK from [here](https://github.com/Mark-Bosco/Clear-Meals/releases/tag/v0.1.0-alpha) onto your Android device.
2. **Sign Up/Sign In**: Create an account or sign in to an existing one.
3. **Email Verification**: Verify your email address to access all features.
4. **Home Screen**: View your daily food log and total calorie intake.
5. **Add Food**: 
   - Tap "Add Food" and select a meal type.
   - Search for food items using the search bar.
   - Select a food item to view nutritional information.
   - Adjust serving size if needed and tap "Save" to add to your meal.
6. **View Nutritional Details**: Tap on any logged food item to see detailed nutritional information.
7. **Edit/Delete Foods**: Swipe left on a food item in your daily log to delete it. Click on an item to edit it.
8. **Calendar View**: Access the calendar icon to view your meal history and edit any daily logs.
9. **Settings**: Manage your account settings and log out.



## 📚 API Information

The app uses the FatSecret API for food data. Key endpoints include:
- `foods.search`: Search for food items.
- `food.get`: Retrieve detailed information about a specific food item.
- `foods.autocomplete`: Get autocomplete suggestions for food searches.

For full API documentation, visit [FatSecret Platform API](https://platform.fatsecret.com/api/Default.aspx?screen=rapiref2).

Made by Mark Bosco
