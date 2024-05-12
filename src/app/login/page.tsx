'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const logIN = async () => {
    try {
      setLoading(true);
      const resp = await axios.post('/api/users/login', user);
      const data = resp.data;
      console.log(data);
      router.push('/profile');
    } catch (error: any) {
      console.log("Login failed");
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    }
    else setButtonDisabled(true);
  
  }, [user])
  

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <h1>{loading ? "Processing" : "Login"}</h1>
        <hr />
        <label htmlFor="email">email</label>
        <input 
          id='email'
          className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
          type="email" 
          placeholder='email'
          name='email'
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value})}
          />
        <label htmlFor="password">password</label>
        <input 
          id='password'
          className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
          type="password" 
          placeholder='password'
          name='password'
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value})}
        />

        <button 
          className={`p-2 border-white border rounded-lg ${buttonDisabled ? 'bg-gray-300' : 'bg-black'}`}
          disabled={buttonDisabled}
          onClick={logIN}
        >
          Login
        </button>
        <Link href='/signup'>Visit signup page</Link>
    </div>
  )
}
