import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/tasks/my-tasks')
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', {
        name: newProjectName,
        description: newProjectDesc
      });
      setNewProjectName('');
      setNewProjectDesc('');
      fetchData();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  // Compute Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  
  const isOverdue = (task) => {
    if (task.status === 'Completed' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };
  const overdueTasks = tasks.filter(isOverdue).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-muted mt-4">Welcome back, {user.name}. Here's what's happening today.</p>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="metric-title">Total Tasks</span>
          <span className="metric-value">{totalTasks}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">In Progress</span>
          <span className="metric-value" style={{color: 'var(--primary)'}}>{inProgressTasks}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Completed</span>
          <span className="metric-value metric-success">{completedTasks}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Overdue</span>
          <span className="metric-value metric-danger">{overdueTasks}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">Recent Tasks</h2>
          </div>
          {tasks.length === 0 ? (
            <div className="card text-center text-muted">No tasks found.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {tasks.map(task => {
                const overdue = isOverdue(task);
                return (
                  <div key={task.id} className="card" style={{ padding: '1.25rem' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl mb-2">{task.title}</h3>
                        <p className="text-sm text-muted">Project: {task.project?.name}</p>
                        {task.dueDate && (
                          <p className={`text-sm mt-4 ${overdue ? 'text-danger' : 'text-muted'}`}>
                            Due: {new Date(task.dueDate).toLocaleDateString()} {overdue && '(Overdue)'}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {overdue ? (
                          <span className="badge badge-overdue">Overdue</span>
                        ) : (
                          <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                            {task.status}
                          </span>
                        )}
                        <select 
                          value={task.status} 
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="mt-4"
                          style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        {user.role === 'Admin' && (
                          <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger text-sm py-1 px-3 mt-2">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl mb-6">Projects</h2>
          <div className="flex flex-col gap-4 mb-8">
            {projects.map(project => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}>
                  <h3 className="mb-2">{project.name}</h3>
                  <p className="text-sm text-muted mb-4">{project.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="badge badge-in-progress">{project._count?.tasks} Tasks</span>
                    <span className="text-muted">Admin: {project.admin?.name}</span>
                  </div>
                </div>
              </Link>
            ))}
            {projects.length === 0 && <p className="text-muted">No projects found.</p>}
          </div>

          {user.role === 'Admin' && (
            <div className="card">
              <h2 className="text-xl mb-4">Create Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} required rows="2"></textarea>
                </div>
                <button type="submit" className="btn w-100">Create Project</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
