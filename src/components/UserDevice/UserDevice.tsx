import { StoreType } from '@/store';
import { ListUser } from '@/store/slices/user.slices';
import React, { FormEvent, useRef } from 'react'
import { useSelector } from 'react-redux';
import AddUser from '../AddUser/AddUser';
import ListUserDevice from '../ListUserDevice/ListUserDevice';

type InputRef = {
    input: HTMLInputElement;
};


export default function UserDevice() {
    const userStore = useSelector((store: StoreType) => {
        return store.userStore
    })
    console.log("dqwdwqd", userStore.ListUser);

    const nameRef = useRef<InputRef | null>(null);
    const powerRef = useRef<InputRef | null>(null);
    const codeRef = useRef<InputRef | null>(null);

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();

        if (nameRef.current && powerRef.current && codeRef.current) {
            const formData = {
                name: nameRef.current.input.value,
                power: powerRef.current.input.value,
                code: codeRef.current.input.value,
            };

            console.log("formData", formData);

            if (formData) {
                if (userStore.socket) {
                    userStore.socket.emit('addDevices', formData);
                }
            }
        }
    }

    return (
        <main>
            <div className="head-title">
                <div className="left">
                    <h1>User</h1>
                    <ul className="breadcrumb">
                        <li>
                            <a href="#">Home</a>
                        </li>
                        <li>
                            <i className="bx bx-chevron-right" />
                        </li>
                        <li>
                            <a className="active" href="#">
                                User
                            </a>
                        </li>
                    </ul>
                </div>
                <a href="#" className="btn-download">
                    <i className="bx bxs-cloud-download" />
                    <span className="text" data-mdb-toggle="modal"
                        data-mdb-target="#exampleModal">Add member</span>
                </a>
                <AddUser />
            </div>
            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>User</h3>
                        <i className="bx bx-search" />
                        <i className="bx bx-filter" />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>User</th>
                                <th>Role</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStore.ListUser?.map((user: ListUser, index: number) => (
                                <tr key={Date.now() * Math.random()}>
                                    <td>
                                        <span>{index + 1}</span>
                                    </td>
                                    <td>
                                        {user.email}
                                    </td>
                                    <td>
                                        <p>{user.role}</p>
                                    </td>
                                    <td>
                                        <ListUserDevice user={user} />
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main >
    )
}
