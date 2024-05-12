'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {

    const [token, setToken] = useState<String>("");
    const [verified, setVerfied] = useState(false);
    const [error, setError] = useState(false);

    const searchParams = useSearchParams();

    const verifyUserEmail = async () => {
        try {
            const resp = await axios.post('/api/users/verifyemail', { token });
            const data = resp.data;

            setVerfied(true);
            setError(false);
        } catch (error: any) {
            console.log(error.response.data);
            setError(true);
        }
    }

    // useEffect(() => {
    //     // not optimized
    //     const urlToken = window.location.search.split('=')[1]
    //     setToken(urlToken);
    // }, []);

    useEffect(() => {
        setError(false);
        const urlToken = searchParams.get('token');
        setToken(urlToken || "");
    }, [searchParams]);

    useEffect(() => {
        setError(false);
        if (token.length > 0) {
            verifyUserEmail(); // optional can do with button as well using onClick property;
        }
    }, [token]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-4xl'>Verify Email</h1>
            <h2 className='p-2 bg-orange-500 text-black'>
                {token ? token : "no token"}
            </h2>
            {verified && (
                <div>
                    <h2>Verified</h2>
                    <Link href='/login'>Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h2>Error</h2>
                </div>
            )}
        </div>
    )
}