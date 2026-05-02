import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProject();
    if (user.role === 'Admin') fetchUsers();
  }, [id, user.role]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error('Failed to fetch project', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', {
        title: newTaskTitle,
        description: newTaskDesc,
        projectId: id,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      setAssignedTo('');
      setDueDate('');
      fetchProject();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      fetchProject();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchProject();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/" className="text-muted text-sm flex items-center gap-2 mb-4 hover:text-main">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl">{project.name}</h1>
          <p className="text-muted mt-2">{project.description}</p>
          <div className="mt-4">
            <span className="badge badge-in-progress">Admin: {project.admin?.name}</span>
          </div>
        </div>
        {user.role === 'Admin' && (
          <button onClick={handleDeleteProject} className="btn btn-danger">Delete Project</button>
        )}
      </div>

      <div className="dashboard-grid">
        <div>
          <h2 className="text-2xl mb-6">Tasks</h2>
          <div className="flex flex-col gap-4">
            {project.tasks.length === 0 ? (
              <div className="card text-center text-muted">No tasks in this project.</div>
            ) : project.tasks.map(task => {
              const isOverdue = task.status !== 'Completed' && task.dueDate && new Date(task.dueDate) < new Date();
              return (
                <div key={task.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl">{task.title}</h3>
                      {task.dueDate && (
                        <p className={`text-sm mt-2 ${isOverdue ? 'text-danger' : 'text-muted'}`}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {isOverdue ? (
                      <span className="badge badge-overdue">Overdue</span>
                    ) : (
                      <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-sm mb-6">{task.description}</p>
                  
                  <div className="flex justify-between items-center border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm text-muted">
                      Assigned to: <strong style={{ color: 'var(--text-main)' }}>{task.assignee?.name || 'Unassigned'}</strong>
                    </span>
                    
                    {(user.role === 'Admin' || user.id === task.assignedTo) && (
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}
                  </div>
                  {user.role === 'Admin' && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger text-sm py-1 px-3">Delete Task</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {user.role === 'Admin' && (
          <div>
            <div className="card sticky" style={{ top: '2rem' }}>
              <h2 className="text-xl mb-6">Assign New Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} required rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <button type="submit" className="btn w-100">Create Task</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
