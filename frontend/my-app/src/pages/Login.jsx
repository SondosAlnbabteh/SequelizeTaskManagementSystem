import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";


function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3004/login', { email, password });
          Cookies.set('token', response.data.token, { expires: 1 });
                    
          console.log(response.data.userId);
          alert('Login successful!');
        } catch (error) {
          // استخدام console.log لطباعة تفاصيل الخطأ للحصول على معلومات دقيقة
          console.error('Login failed:', error.response ? error.response.data : error.message);
          
          if (error.response) {
            // تحقق من حالة الاستجابة
            switch (error.response.status) {
              case 400:
                alert('Bad request: ' + error.response.data.message);
                break;
              case 401:
                // عرض رسالة خطأ دقيقة بناءً على الرسالة من الخادم
                if (error.response.data.message === 'Email not found') {
                  alert('Email not found');
                } else if (error.response.data.message === 'Invalid password') {
                  alert('Invalid password');
                } else {
                  alert('Invalid credentials');
                }
                break;
              case 500:
                alert('Internal server error');
                break;
              default:
                alert('An unknown error occurred');
                break;
            }
          } else {
            // حالة عندما لا يكون هناك استجابة من الخادم
            alert('Network error: ' + error.message);
          }
        }
      };
      

return(
    <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tightmlFortracking-tightmlFortext-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleLogin}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Your email</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
           
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-black">Sign in</button>
                  
                  <p className="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
                        Don not have an account?
     
                   <Link
                   to="/Register"
                    class="ml-1 block font-sans text-sm font-bold leading-normal text-gray-700 antialiased"
                     >
                              Sign up
                    </Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
);
}
export default Login;