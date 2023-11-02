import './DeviceUser.scss'
import AddDevice from '../AddDevice/AddDevice'
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';
import { useEffect, useState } from 'react';

interface DeviceUser {
    id: string;
    name: string;
    user_id: string;
    node_id: number;
    active: boolean;
}


export default function DeviceUser() {
    const [listDevice, setListDevice] = useState<DeviceUser[]>([]);

    const userStore = useSelector((store: StoreType) => {
        return store.userStore
    })
    console.log("userss", userStore.ListPerById);
    const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => {
        setIsOn(!isOn);
    };
    return (
        <main>
            <div className="head-title">
                <div className="left">
                    <h1>Products</h1>
                    <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li>
                            <i className="bx bx-chevron-right" />
                        </li>
                        <li>
                            <a className="active" href="#">
                                Products
                            </a>
                        </li>
                    </ul>
                </div>
                <a href="#" className="btn-download">
                    <i className="bx bxs-cloud-download" />
                    <span className="text" data-mdb-toggle="modal"
                        data-mdb-target="#exampleModal">Add New</span>
                </a>
            </div>
            <AddDevice />

            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>Products</h3>
                        <i className="bx bx-search" />
                        <i className="bx bx-filter" />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>

                                <th>Name</th>

                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {userStore.ListPerById?.map((item: any, index: number) => (
                                <tr key={Date.now() * Math.random()}>
                                    <td>
                                        <span>{index + 1}</span>
                                    </td>
                                    <td>
                                        <p><input type="text" defaultValue={item.name} /></p>
                                    </td>

                                    <td>
                                        <div className={`switch-container ${isOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
                                            <div className="switch">
                                                <div className={`switch-toggle ${isOn ? 'on' : 'off'}`}></div>
                                            </div>
                                            <p className="switch-text">{isOn ? 'Bật' : 'Tắt'}</p>
                                        </div>

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


