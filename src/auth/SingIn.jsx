import React, { useState } from 'react';
import Vector from '../assets/Vector.png';
import Ellipse from '../assets/Ellipse.png';
import Ellipse1 from '../assets/Ellipse1.png';
import Ellipse2 from '../assets/Ellipse2.png';
import Copy from '../assets/CopyIcone.svg';
import User from '../assets/user.svg';
import Lock from '../assets/lock.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const signin = async () => {
        if (name == "" || password == "") {
            toast.warning("please input all field")
        } else {
            const response = await axios.post('http://localhost:8080/api/module/users/auth', {
                name,
                password
            });
            if (response.status === 200) {
                toast.success("Successfully Athenticated")
                localStorage.setItem('isSigned', true);
            } else {
                toast.success("Authentication failed")
            }
            navigate('/dashboard');
        }
    }
    return (
        <div className='w-screen h-screen bg-[#0F908B] flex items-center justify-center'>
            <img src={Vector} alt="Vector" className="w-[864px] h-full absolute top-0 right-0" />
            <img src={Ellipse} alt="Ellipse" className="w-[362px] h-[362px] absolute bottom-0 left-0" />
            <img src={Ellipse1} alt="Ellipse" className="w-[286px] h-[286px] absolute bottom-0 left-0" />
            <img src={Ellipse2} alt="Ellipse2" className="w-[219px] h-[219px] absolute bottom-0 left-0" />
            <div className='w-[300px] h-fit min-h-[475px] flex justify-between items-center flex-col z-10'>
                <Copy />
                <div className='text-white text-[16px] font-[500] mb-5'>
                    Sign In
                </div>
                <div className='relative mb-5'>
                    <User className='absolute w-5 h-5 top-3 left-1' />
                    <input onChange={setName} type="text" className='rounded-md  focus:border-white focus:outline-none pl-8 border border-white w-[300px] h-[45px] bg-[#088883] text-white text-[14px]' placeholder='USERNAME' />
                </div>
                <div className='relative mb-10'>
                    <Lock className='absolute w-5 h-5 top-3 left-1' />
                    <input onChange={setPassword} type="password" className='rounded-md focus:border-white focus:outline-none pl-8 border border-white w-[300px] h-[45px] bg-[#088883] text-white text-[14px]' placeholder='PASSWORD' />
                </div>
                <button onClick={(() => {
                    signin()
                })} className='mb-5 rounded-md bg-white text-[#207976] text-[16px] font-[600] text-center w-[300px] h-[45px]'>
                    Login
                </button>
            </div>
        </div>
    );
};

export default SignIn;