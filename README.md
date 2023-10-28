# PGPR
Postgraduate Programme Review System for Quality Assurance Council of University Grants Commission

## Getting Started

### Prerequisites

Please make sure following are installed before starting.

1. Composer 
2. Node.js

### Project Initialization

1. Clone the repository
2. Open the CLI inside the root directory and run the following commands
```
cd server
composer install
cd ../client
npm install
```

### Starting the Project in Development mode

1. Open the CLI inside the root directory and run the following commands
```
cd server
php artisan serve
```
2. Open another CLI inside the root directory and run the following commands
```
cd client
npm run dev
```

#### The Application Requires a Queue Worker to be running in the background for asynchronous tasks
3. Open the 3rd CLI inside the root directory and run the following commands
```
cd server
php artisan queue:work
```
