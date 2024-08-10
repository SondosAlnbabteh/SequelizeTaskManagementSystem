import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({ title: '', content: '' });

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get('http://localhost:3004/tasks');
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        setError('Fetching tasks failed!');
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  async function DeleteTask(id) {
    try {
      await axios.put(`http://localhost:3004/tasksdelete/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      alert("Task deleted successfully");
    } catch (error) {
      setError('Failed to delete task!');
    }
  }

  async function UpdateTask(id) {
    if (!updatedTask.title || !updatedTask.content) {
      alert("Please fill in both fields.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:3004/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
      setEditTaskId(null);
      setUpdatedTask({ title: '', content: '' });
      alert("Task updated successfully");
    } catch (error) {
      console.error('Update task error:', error);
      setError('Failed to update task!');
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUpdatedTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-wrap items-center justify-center">
        {tasks.length === 0 ? (
          <div>No tasks available</div>
        ) : (
          tasks.map((task) => (
            <div
              className="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md my-20"
              key={task.id}
            >
              <div className="p-6">
                <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                  {task.title || "No title"}
                </h4>
                <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                  {task.content || "No content"}
                </p>
                <FontAwesomeIcon 
                  icon={faTrash} 
                  className="mr-10 cursor-pointer" 
                  onClick={() => DeleteTask(task.id)}
                />
                <FontAwesomeIcon 
                  icon={faPenToSquare} 
                  className="cursor-pointer" 
                  onClick={() => {
                    setEditTaskId(task.id);
                    setUpdatedTask({ title: task.title, content: task.content });
                  }} 
                />
              </div>
            </div>
          ))
        )}
      </div>

      {editTaskId && (
        <div className="fixed z-50 p-6 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2">
          <h2 className="mb-4 text-xl font-semibold">Edit Task</h2>
          <input
            type="text"
            name="title"
            value={updatedTask.title}
            onChange={handleInputChange}
            placeholder="Task title"
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
          />
          <textarea
            name="content"
            value={updatedTask.content}
            onChange={handleInputChange}
            placeholder="Task content"
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
          />
          <button 
            onClick={() => UpdateTask(editTaskId)}
            className="px-4 py-2 mr-4 text-white bg-blue-500 rounded"
          >
            Update
          </button>
          <button 
            onClick={() => setEditTaskId(null)}
            className="px-4 py-2 text-white bg-gray-500 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Tasks;
