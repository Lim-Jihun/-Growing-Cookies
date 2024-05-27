import styles from "./Login.module.css";
import React, { useState } from 'react';
import axios from 'axios';
// const Login = () => {
//   return (
//     <>
//       <div className={styles.content}>Login Page</div>
//     </>
//   );
// };

// export default Login;


// todo 여기 css수정 필요
function Login() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/user/login', {
        userID: userId, 
        userPW: userPw 
      });

      console.log('Login response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error during login:', error.message);
      }
      console.log('Error config:', error.config);
    
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="userPw">Password:</label>
        <input
          type="password"
          id="userPw"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
        />
        <div className={styles.content}>Login Page</div>
      </div>
      <button type="submit">Login</button>
    </form>
    
  );
}

export default Login;
