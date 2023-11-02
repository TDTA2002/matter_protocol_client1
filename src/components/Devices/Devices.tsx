import { useEffect, useState } from 'react'
import './devices.scss'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { StoreType } from '@/store'
import QrCode from './component/QrCode'
import { Popconfirm, message } from 'antd'
import AddDevice from '../AddDevice/AddDevice'
import { ListBinding } from '@/store/slices/user.slices'
import { useNavigate } from 'react-router'

interface Device {
    id: string;
    name: string;
    user_device_id: string;
    node_id: number;
    status: boolean;
    power: number;
    groupName: string;
    groupId: string;
    // timeCreate: string;
    active: boolean;
}

export default function Productlist() {
    const [listDevice, setListDevice] = useState<Device[]>([]);
    const [listBinding, setListBinding] = useState<ListBinding[]>([]);
    const [shouldUpdateListDevice, setShouldUpdateListDevice] = useState(false);
    const userStore = useSelector((store: StoreType) => {
        return store.userStore
    })
    console.log('userStore', userStore);

    const dispath = useDispatch()
    const navigate = useNavigate()
    const [statust, setStatus] = useState()
    const [name, setName] = useState('')
    const [power, setPower] = useState()
    const [nodeId, setNodeId] = useState('123')
    const [idDevice, setIdDevice] = useState('')
    const [QR_Code, setQR_Code] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [tempId, setTempId] = useState("")
    const [unpairId, setUnpairId] = useState("");
    const [Id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [add, setAdd] = useState(true)
    const [count, setCount] = useState(1)
    const [search, setSearch] = useState('')
    const text = 'Are you sure to unpair this Device?';
    const description = 'Unpair the Device';
    const [loadingState, setLoadingState] = useState<Record<string, boolean>>({});
    useEffect(() => {
        if (userStore.Device && userStore.Device.length > 0) {
            setListDevice(userStore.Device);
            setShouldUpdateListDevice(true);
        }
        if (userStore.ListBinding && userStore.ListBinding.length > 0) {
            setListBinding(userStore.ListBinding);
            setShouldUpdateListDevice(true);
        }
    }, [userStore.Device, userStore.ListBinding]);
    useEffect(() => {
        if (shouldUpdateListDevice) {
            if (listDevice && listBinding) {
                console.log("listDevice", listDevice);
                console.log("listBinding", listBinding);


                const updatedListDevice = listDevice.map((device) => {
                    const matchingBinding = listBinding.find((binding) => binding.bindingDevice.id === device.id);
                    if (matchingBinding) {
                        return { ...device, groupName: matchingBinding.binding.name, groupId: matchingBinding.binding.id };
                    }
                    return device;
                });
                setListDevice(updatedListDevice);
                setShouldUpdateListDevice(false);
            }
        }
    }, [shouldUpdateListDevice, listDevice, listBinding]);
    console.log("listDevice", listDevice);
    function handleSearchQrCode(node_id: number, idDevice: string) {
        // Lấy dữ liệu từ localStorage

        const decodeTemp = localStorage.getItem('decodeData');
        setLoadingState((prevState) => ({ ...prevState, [idDevice]: true }));
        if (decodeTemp) {
            const decodeData = JSON.parse(decodeTemp);
            for (let i in decodeData) {
                if (decodeData[i].id == idDevice) {
                    const parts = decodeData[i].decode.split('+')
                    if (parts.length === 2) {
                        const a = parts[0];
                        const timestamp = parseInt(parts[1], 10);
                        if (!isNaN(timestamp)) {
                            const currentTime = Math.floor(Date.now());
                            const time = ((currentTime - timestamp) / 1000)
                            const isWithin10Minutes = time < 300;
                            console.log("isWithin10Minutes", isWithin10Minutes);
                            console.log("time", time);
                            if (isWithin10Minutes) {
                                setLoadingState((prevState) => ({ ...prevState, [tempId]: false }));
                                // mã QR còn hạn => show mã
                                setQR_Code(a)
                                setShowModal(true)
                                return;
                            } else {
                                if (userStore.socket) {
                                    // setLoading(true)
                                    // mã QR đã hết hạn =>  gọi tạo mới                               
                                    setTempId(idDevice)
                                    userStore.socket.emit("requireDecoe", {
                                        message: 8,
                                        node_id: node_id
                                    })
                                }
                            }
                        }
                    }
                    // localStorage.setItem('decodeData', JSON.stringify(decodeData));
                }
            }
            if (userStore.socket) {
                // setLoading(true)
                // mã QR của ID đó đã hêt hạn =>  gọi tạo mới
                console.log("da roi vao truong hop khac");
                setTempId(idDevice)
                userStore.socket.emit("requireDecoe", {
                    message: 8,
                    node_id: node_id
                })
            }

        } else {
            if (userStore.socket) {
                // setLoading(true)
                // không có mã QR của ID đó trong local => gọi cập nhật cái mới 
                setTempId(idDevice)
                userStore.socket.emit("requireDecoe", {
                    message: 8,
                    node_id: node_id
                })
            }
        }
    }
    useEffect(() => {
        var socket = new WebSocket("ws://192.168.1.41:5580/ws");
        socket.onopen = function (event) {
            console.log("Kết nối WebSocket đã được thiết lập.");
            // Gửi thông điệp JSON cho máy chủ
            var message = {
                "message_id": "4",
                "command": "start_listening"
            };

            socket.send(JSON.stringify(message));
        };

        socket.onmessage = function (event) {
            let data2 = event.data;
            if (typeof data2 == 'string') {

                data2 = JSON.parse(data2)
                console.log("Dữ liệu nhận được từ WebSocket data: ", data2);
                if (data2.event == "attribute_updated") {
                    setStatus(data2.data[2])
                    setNodeId(data2.data[0])
                    // console.log('data2.data[3]',data);

                }
            }
        };
        socket.onclose = function (event) {
            // console.log("Kết nối WebSocket đã đóng.");
        };
        socket.onerror = function (error) {
            console.error("Lỗi WebSocket: " + error);
            // console.log('vao', [1, 1].length);
        };
    }, [])
    useEffect(() => {
        // lắng nghe kêt quả trả về và tạo mới
        userStore.socket?.on("decode", (decode: string) => {
            if (decode != null) {
                if (tempId != "") {
                    setLoadingState((prevState) => ({ ...prevState, [tempId]: false }));
                    const decodeData = [
                        {
                            id: tempId,
                            decode: `${decode}+${Date.now()}`
                        }
                    ];
                    const storeData = localStorage.getItem('decodeData');
                    if (storeData) {
                        const storeArray = JSON.parse(storeData);
                        decodeData.push(...storeArray);
                    }
                    localStorage.setItem('decodeData', JSON.stringify(decodeData));
                    setQR_Code(decode)
                    setShowModal(true)
                }
            }
        })
    }, [tempId])

    useEffect(() => {
        userStore.socket?.on("decodeFailed", (notification: string) => {
            // setLoading(false)
            // lắng nghe và thông báo các lỗi 
            if (notification != "") {
                message.error(notification)
            }

        })
    }, [])

    function handleUnpair(id: string, node_id: number) {

        setUnpairId(id)
        if (userStore.socket) {
            userStore.socket.emit("unpairDevice", {
                message: 7,
                id: id,
                node_id: node_id
            })
            message.success("Ngắt kết nối thành công")
        } else {
            message.warning("Kết nối máy chủ không thành công")
        }
    }
    function handleShowChart(id: string) {
        setId(id)
        if (userStore.socket) {
            userStore.socket.emit("showChart", {
                id: id,
            })
        }
    }
    useEffect(() => {
        userStore.socket?.on('unpairScuces', (message2) => {
            if (message2 != "") {
                console.log("đã unpair", message2);
                // message.success(message2)
                const localStorageData = localStorage.getItem('decodeData');
                if (localStorageData != undefined) {
                    const dataArray = JSON.parse(localStorageData);
                    for (let i in dataArray) {
                        const parts = dataArray[i].id
                        if (parts != "") {
                            const tempId = parts
                            if (tempId == unpairId) {
                                dataArray.splice(dataArray[i], 1);
                                setUnpairId("")
                            }
                        }
                    }
                    localStorage.setItem('decodeData', JSON.stringify(dataArray));
                } else {
                    console.log("khong ton tai du lieu");
                }
            }
        })
    }, [unpairId])

    return (
        <main>
            {showModal && <QrCode QR_Code={QR_Code} setQR_Code={setQR_Code} setShowModal={setShowModal} />}
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
                                <th>Power</th>
                                <th>Group name</th>
                                <th>Action</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {listDevice?.map((item: any, index: number) => (
                                <tr key={Date.now() * Math.random()}>
                                    <td>
                                        <span>{index + 1}</span>
                                    </td>
                                    <td>
                                        <p><input type="text" defaultValue={item.name} /></p>
                                    </td>
                                    <td>
                                        <p>{item.power} W/h</p>
                                    </td>
                                    <td>
                                        {item.groupName ? <span>{item.groupName}</span> : <span>Chưa Binding</span>}
                                    </td>
                                    <td>

                                        <button className="status completed" onClick={() => handleSearchQrCode(item.node_id, item.id)}>
                                            {loadingState[item.id] ? <span className='loading-spinner'></span> : "Share Connect"}
                                        </button>
                                        <Popconfirm
                                            placement="top"
                                            title={text}
                                            description={description}
                                            onConfirm={() => handleUnpair(item.id, item.node_id)}
                                            okText={<span className="custom-ok-button">Yes</span>}
                                            cancelText="No"
                                        >
                                            <button className="status delete"
                                            >Unpair</button>
                                        </Popconfirm>
                                        <button className="status pending" onClick={() => {
                                            handleShowChart(item.id)
                                            navigate("/chart")
                                        }}>Detail</button>
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


