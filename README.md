


<p align="center">
  <img src="https://raw.githubusercontent.com/AhmeddSaid/Horizon-Peaks/main/horizon-peaks-logo.png" alt="Cover Image">
</p>


<h1 align="center">Horizon Peaks - Hotel Management Application</h1>


Horizon Peaks is a custom-built application designed to manage a small boutique hotel with 8 luxurious wooden cabins. This internal tool helps hotel staff manage bookings, cabins, guests, and check-ins/check-outs efficiently. The project also lays the foundation for a future customer-facing website.

## Features

### 1. **Authentication**
- Only hotel employees can access the app, ensuring security.
- Users sign up through the app to restrict account creation to employees.
- Employees can upload avatars and update their profile (name, password).

### 2. **Cabins Management**
- View a table of all cabins displaying their photo, name, capacity, price, and discounts.
- CRUD functionality: create, update, and delete cabins, with the ability to upload photos.

### 3. **Bookings**
- View and filter bookings based on status: *unconfirmed*, *checked in*, and *checked out*.
- Bookings include details like number of guests, nights, guest observations, and breakfast preferences.
- Handle check-ins/check-outs and payment confirmation inside the app.
- **Create New Booking**: Users can create new bookings directly through the app, streamlining the reservation process.

### 4. **Guests**
- Store and view guest data, including full name, email, national ID, nationality, and country flag.

### 5. **Dashboard**
- View key hotel metrics for the past 7, 30, or 90 days, such as bookings, sales, check-ins, and occupancy rates.
- Perform guest check-ins/check-outs directly from the dashboard.
- Charts display daily sales and statistics on stay durations.

### 6. **Settings**
- Define application-wide settings such as breakfast price, minimum/maximum nights, and guest limits per booking.
- Dark mode toggle available for users.

## Pages

- **Dashboard**: /dashboard - View overall hotel metrics and perform guest management tasks.
- **Bookings**: /bookings - Manage hotel bookings.
- **Cabins**: /cabins - Manage cabins.
- **Check In**: /checkin/:bookingID - Check guests in/out and manage payments.
- **Settings**: /settings - Manage app-wide configurations.
- **User Sign-Up**: /users - Add new employees to the app.
- **Login**: /login - Employee login.
- **Account Settings**: /account - Update user profile information.

## Technology Stack

- **Frontend**: React (Client-Side Rendering - CSR)
- **Styling**: Styled Components
- **Remote State Management**: React Query
- **UI State Management**: Context API
- **Forms**: React Hook Form
- **Authentication & Data**: Supabase (Postgres database, API, authentication, and file storage)

### Tools
- **React Icons**
- **React Hot Toast**
- **Recharts**
- **date-fns**

## Database Modeling

The application uses Supabase with a Postgres database, with the following main tables:

- **Bookings**: Includes guest, cabin, stay duration, and payment details.
- **Cabins**: Stores cabin information.
- **Guests**: Guest data for identification and management.
- **Users**: Employee authentication and profiles.
- **Settings**: Application-wide settings (e.g., breakfast price).


---

### **Code Author:** [Ahmed Said](https://ahmedsaidadnan.com)