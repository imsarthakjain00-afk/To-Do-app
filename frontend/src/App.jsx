import React, { useState, useEffect } from 'react';
import { authAPI, taskAPI } from './api';
import './App.css';
import { Plus, Trash, LogOut, CheckCircle, Edit3, User, Mail, Lock, Phone } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [token, setToken] = useState(localStorage.getItem('todo_token'));

  // Auth form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Task states
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Status / Error states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current user and tasks if logged in
  useEffect(() => {
    if (token) {
      fetchUserAndTasks();
    } else {
      setUser(null);
      setTasks([]);
    }
  }, [token]);

  const fetchUserAndTasks = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      setError('');
      
      try {
        const tasksData = await taskAPI.getAll();
        setTasks(tasksData);
      } catch (taskErr) {
        console.error("Failed to load tasks:", taskErr);
        setError("Could not load tasks, but you are logged in.");
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authAPI.login(username, password);
      setToken(localStorage.getItem('todo_token'));
      setSuccess('Logged in successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authAPI.register({
        name,
        username,
        email,
        password,
        mobile_number: parseInt(mobileNumber, 10) || 0,
      });
      setSuccess('Registration successful! Please login.');
      setAuthMode('login');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Check details.');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    setTasks([]);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    setError('');
    try {
      const newTask = await taskAPI.create(taskTitle, taskDesc);
      setTasks([newTask, ...tasks]);
      setTaskTitle('');
      setTaskDesc('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask || !taskTitle) return;
    setError('');
    try {
      const updated = await taskAPI.update(editingTask.id, taskTitle, taskDesc);
      setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
      setTaskTitle('');
      setTaskDesc('');
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
  };

  // Renders the login/register screens
  const renderAuth = () => (
    <div className="glass-card">
      <h1>TaskFlow</h1>
      <p className="subtitle">Manage your daily tasks cleanly and efficiently</p>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {authMode === 'login' ? (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
          <p className="switch-text">
            Don't have an account?{' '}
            <span className="switch-link" onClick={() => setAuthMode('register')}>
              Create one
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              className="input-field"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <p className="switch-text">
            Already have an account?{' '}
            <span className="switch-link" onClick={() => setAuthMode('login')}>
              Login
            </span>
          </p>
        </form>
      )}
    </div>
  );

  // Renders the main todo manager dashboard
  const renderDashboard = () => (
    <div className="glass-card dashboard-card">
      <div className="dashboard-header">
        <div className="user-info">
          <span className="welcome-text">Welcome, {user?.name || user?.username}</span>
          <span className="user-email">{user?.email}</span>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Sign Out
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="todo-form">
        <h3 className="todo-form-title">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
        <div className="todo-form-inputs">
          <input
            type="text"
            className="input-field"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          <textarea
            className="input-field"
            placeholder="Task Description (Optional)"
            rows="2"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {editingTask ? <Edit3 size={18} /> : <Plus size={18} />}
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button type="button" onClick={cancelEditing} className="btn btn-secondary" style={{ flex: 1, marginTop: 0 }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="todo-list">
        <h2>Your Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks found. Add a task above to get started!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="todo-item">
              <div className="todo-content">
                <span className="todo-title">{task.title}</span>
                {task.description && <span className="todo-desc">{task.description}</span>}
              </div>
              <div className="todo-actions">
                <button onClick={() => startEditing(task)} className="btn-icon" title="Edit Task">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="btn-icon delete" title="Delete Task">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {token ? renderDashboard() : renderAuth()}
    </div>
  );
}

export default App;
