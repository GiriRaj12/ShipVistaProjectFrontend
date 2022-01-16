import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { SESSION } from '../constants/Constants';

export default function Profile(){
    const router = useRouter();

    const logout = () =>{
        localStorage.setItem(SESSION, null);
        router.push("/login");
    }

    return (
        <div style={{padding:'10%'}}>
        <p>Thanks for using plants app ! </p>
        <Button color='primary' variant='contained' onClick={logout}>Log Out</Button>
        </div>
    )
}