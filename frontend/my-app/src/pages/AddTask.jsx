import axios from "axios";
import {createContext, useState } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

function AddTasks(){
   const [title, setTitle] = useState('');
   const [content, setContent] = useState('');


   const handleAddTask = async (e) => {
    e.preventDefault();
  
    const token = Cookies.get('token');
    if (!token) {
      alert('No token found');
      return;
    }
  
    try {
      // Validate token and get user ID from server
      const response = await axios.post('http://localhost:3004/validate-token', { token });
      const UserId = response.data.userId;
  
      // Proceed to add the task
      await axios.post('http://localhost:3004/tasks', { title, content, UserId });
      alert('Added task successfully');
    } catch (error) {
      console.error('Add task failed:', error);
      alert('Added task failed!');
    }
  };




    return(
        <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tightmlFortracking-tightmlFortext-gray-900 md:text-2xl dark:text-white">
                       Add Task
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleAddTask}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >task title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                        </div>
                      
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} name="description" id="description" placeholder="description...." className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        </div>
                 
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-black">Add Task</button>
                        
                      
                    </form>
                </div>
            </div>
        </div>
</section>

    );
}
export default AddTasks;