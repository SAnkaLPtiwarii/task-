# Task Manager Application

A real-time task management application built with MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO.

## Features

- Real-time task updates
- Task creation, editing, and deletion
- Priority management
- Due date tracking
- Status updates
- Sorting and filtering
- User authentication
- Responsive design

## Project Structure

```
task-manager/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── hooks/       # Custom hooks
│   │   └── ...
│   └── ...
├── server/              # Node.js backend
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── ...
└── ...
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SAnkaLPtiwarii/task-.git
cd task-manager
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```


## Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

The application will be available at http://localhost:5173

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
 