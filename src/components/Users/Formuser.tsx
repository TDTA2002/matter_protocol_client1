import React, { useEffect, useState } from 'react'
import './formuser.scss'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from '@/store';
import apis from '@/services/apis';
import { message } from 'antd';
import { userAction } from '@/store/slices/user.slices';
export default function FormUser() {
    const [handleShowForm, setHandleShowForm] = useState(true)
    useEffect(() => {
        const wrapper = document.querySelector(".wrapper") as HTMLElement;
        const signupHeader = document.querySelector(".signup header") as HTMLElement;
        const loginHeader = document.querySelector(".login header") as HTMLElement;

        function handleLoginClick() {
            wrapper.classList.add("active");
        }

        function handleSignupClick() {
            wrapper.classList.remove("active");
        }

        loginHeader.addEventListener("click", handleLoginClick);
        signupHeader.addEventListener("click", handleSignupClick);

        // Clean up event listeners when the component unmounts
        return () => {
            loginHeader.removeEventListener("click", handleLoginClick);
            signupHeader.removeEventListener("click", handleSignupClick);
        };
    }, []);

    const [validEmail, setValidEmail] = useState(true);
    const [validConfirmPW, setValidConfirmPW] = useState(false)
    const [validPassword, setValidPassword] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userStore = useSelector((store: StoreType) => store.userStore)
    console.log("userStore", userStore);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        console.log("e", e)

        let user = {
            userNameOrEmail: (e.target as any).userNameOrEmail.value,
            password: (e.target as any).password.value
        }

        apis.userApi.login(user)
            .then(res => {
                if (res.status == 200) {
                    message.success(res.status);
                    console.log("Login thành công");

                    localStorage.setItem("token", res.data.token);
                    console.log("ressss111", res, userAction);
                    dispatch(userAction.reload());
                } else {
                    message.warning(res.data.message)
                }
            })
            .catch(err => {
                if (Array.isArray(err.response.data.message)) {
                    for (let i in err.response.data.message) {
                        message.warning(err.response.data.message[i])
                    }
                } else {
                    message.warning(err.response.data.message);
                }

            })
    }
    useEffect(() => {
        if (userStore.data) {
            navigate("/")
        }
    }, [userStore.data])
    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        let data = {
            email: (e.target as any).email.value,
            userName: (e.target as any).userName.value,
            password: (e.target as any).password.value
        }
        console.log("new user", data);
        const confirmPass = (e.target as any).confirmpassword.value

        const password = data.password;
        if (password.length < 6) {
            message.error("Password phải 6 chữ trở lên")
            setValidPassword(false);
            return;
        }
        if (data.password != confirmPass) {
            message.error("Vui lòng xác nhận lại password")
            setValidConfirmPW(true)
            return
        }

        setValidConfirmPW(false);
        setValidPassword(true);
        await apis.userApi.register(data)
            .then(res => {
                console.log("res", res.status);
                if (res.status != 200) {
                    message.error("Đăng ký không thành công")

                } else {
                    message.success(res.data.message)
                }
            })
            .catch(err => console.log("err", err)
            )
    }
    return (
        <div className='account_section'>
            <div className='account_form'>
                <section className="wrapper">
                    <div className="form signup">
                        <header>Signup</header>
                        <form onSubmit={(e) => {
                            handleRegister(e)
                        }}>
                            <input name='userName' type="text" placeholder="Full name" required />
                            <input name='email' type="email" placeholder="Email address" required />
                            <input name='password' type="password" placeholder="Password" required />
                            <input name='confirmpassword' type="password" placeholder="Password" required />
                            <div className="checkbox">
                                <input type="checkbox" id="signupCheck" />
                                <label htmlFor="signupCheck">I accept all terms &amp; conditions</label>
                            </div>
                            <input type="submit" defaultValue="Signup" />
                        </form>
                    </div>
                    <div className="form login">
                        <header>Login</header>
                        <form onSubmit={(e) => {
                            handleLogin(e)
                        }}>
                            <input name='userNameOrEmail' type="text" placeholder="Email address" required />
                            <input name='password' type="password" placeholder="Password" required />
                            <a href="/resetpassword">Forgot password?</a>
                            <input type="submit" defaultValue="Login" />
                        </form>
                    </div>
                </section>
            </div>
        </div>
    )
}