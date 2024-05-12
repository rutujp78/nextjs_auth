'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfilePage = () => {
    const router = useRouter();
    const [data, setData] = useState(null);

    const getUserDetails = async () => {
        try {
            const resp = await axios.post('/api/users/me');
            console.log(resp.data.data._id);
            setData(resp.data.data._id);
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const logout = async () => {
        try {
            const resp = await axios.get('/api/users/logout');
            console.log(resp.data);
            toast.success('logout success');
            router.push('/login');
            setData(null);
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <h1>Profile page</h1>
        <hr />
        <h2>{data === null ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
        <hr />
        <button
            className='bg-green-500 mt-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            onClick={getUserDetails}
        >
            Get user details
        </button>
        <button
            className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={logout}
        >
            Logout
        </button>
    </div>
  )
}

export default ProfilePage