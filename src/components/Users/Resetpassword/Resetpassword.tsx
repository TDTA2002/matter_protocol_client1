import React, { useState } from 'react'
import apis from '@/services/apis';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import './resetpassword.scss'

export default function ResetPassword() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);

    function handleResetPassword() {
        setLoading(true);
        apis.userApi.resetPassword({
            email
        })
            .then(res => {
                console.log("res", res)
                if (res.status == 200) {
                    setLoading(false);
                    message.success(res.data.message);
                }
            })
            .catch(err => {
                setLoading(false);
                for (let i in err.response.data.message) {
                    message.warning(err.response.data.message[i])
                }
                console.log("err", err);
            })
    }

    return (
        <section className='form-main'>
            <div className='form-content'>
                <div className='box'>
                    <h3>Forgot Password</h3>

                    <div className="input-box">
                        <input type="email" placeholder='Email' className='input-control' onChange={(e) => setEmail(e.target.value)} />

                    </div>
                    <button className='btn221' onClick={() => handleResetPassword()}>Send Reset Link</button>

                    <p>Don't have an account ? <Link to='/login' className='gradient-text'>Sign Up</Link></p>

                </div>
            </div>
        </section>
    )
}