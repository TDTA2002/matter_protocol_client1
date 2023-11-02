import { useSelector } from "react-redux";
import "./binding.scss";
import { StoreType } from "@/store";
import { useEffect, useState } from "react";
import { ListBinding } from "@/store/slices/user.slices";
import AddBinding from "../AddBinding/AddBinding";
import { message, Popconfirm } from "antd";
import EditBinding from "../EditBinding/EditBinding";
interface Device {
    id: string;
    name: string;
    user_device_id: string;
    node_id: number;
    status: boolean;
    power: number;
    groupName: string;
    groupId: string;
}
export default function Binding() {
    const [listDevice, setListDevice] = useState<Device[]>([]);
    const [listBinding, setListBinding] = useState<ListBinding[]>([]);
    const [shouldUpdateListDevice, setShouldUpdateListDevice] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [showMessage, setShowMessage] = useState(false);
    const [groupId, setGroupId] = useState("");
    const text = 'Are you sure to delete this Group?';
    const description = 'Delete the group';
    const userStore = useSelector((store: StoreType) => {
        return store.userStore;
    });
    console.log("userStore", userStore);
    
    useEffect(() => {
        console.log("da vao remove 1", userStore.Device);
        
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
        console.log("da vao remove 2");

        if (shouldUpdateListDevice) {
            if (listDevice && listBinding) {
                const updatedListDevice = listDevice.map((device) => {
                    const matchingBinding = listBinding.find((binding) => binding.bindingDevice.id === device.id);
                    if (matchingBinding) {
                        return { ...device, groupName: matchingBinding.binding?.name, groupId: matchingBinding.binding?.id };
                    }
                    return device;
                });
                setListDevice(updatedListDevice);
                setShouldUpdateListDevice(false);
            }
        }
    }, [shouldUpdateListDevice, listDevice, listBinding]);
    const handleDeviceSelection = (deviceId: string) => {
        if (selectedDevices.includes(deviceId)) {
            setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
        } else {
            setSelectedDevices([...selectedDevices, deviceId]);
        }
    };
    const removeGroup = async (groupId: string) => {
        if (userStore.socket) {
            userStore.socket.emit("removeBinding", groupId)
        }
    }
    return (
        <main>
            <div className="head-title">
                <div className="left">
                    <h1>Binding</h1>
                    <ul className="breadcrumb">
                        <li>
                            <a >Home</a>
                        </li>
                        <li>
                            <i className="bx bx-chevron-right" />
                        </li>
                        <li>
                            <a className="active" >
                                Binding
                            </a>
                        </li>
                    </ul>
                </div>

                {/* <a className="btn-download">
                    <i className="bx bxs-cloud-download" />
                    <span
                        className="text"
                        data-mdb-toggle="modal"
                        data-mdb-target="#exampleModal"
                    >
                        Add New
                    </span>
                </a> */}
            </div>

            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>Binding Device</h3>
                        <i className="bx bx-search" />
                        <i className="bx bx-filter" />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th className="check_device"></th>
                                <th className="name_device">Name</th>
                                <th>Power</th>
                                <th className="group_detail_th">Detail</th>
                                <th className="delete_device">Delete</th>
                                <th>Group Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listDevice?.map((item: any) => (
                                <tr key={Date.now() * Math.random()}>
                                    <td className="check_device">
                                        {item.groupName ? <></> : <input
                                            type="checkbox"
                                            onChange={() => handleDeviceSelection(item.id)}
                                            checked={selectedDevices.includes(item.id)}
                                        />}
                                    </td>
                                    <td className="name_device">
                                        <p>
                                            {item.name}
                                        </p>
                                    </td>
                                    <td>
                                        <p>{item.power}W/h</p>
                                    </td>
                                    <td className="group_detail">
                                        {item.groupName ? <a href="#" className="btn-download detail_btn" data-mdb-toggle="modal" data-mdb-target="#EditModal">
                                            <span className="text" onClick={() => {
                                                setGroupId(item.groupId)
                                            }}>Detail</span>
                                        </a> : <span className="item_detail">Chưa Binding</span>}
                                    </td>
                                    {/* <td>{item.groupId ? <></> : <span className="delete_device delete_device_btn">Delete</span>}</td> */}
                                    <td>{item.groupId ? <span className="delete_device delete_device_btn">                                        
                                    <Popconfirm
                                        placement="top"
                                        title={text}
                                        description={description}
                                        onConfirm={() => removeGroup(item.groupId)}
                                        okText={<span className="custom-ok-button">Yes</span>}
                                        cancelText="No"
                                    >
                                        Delete
                                    </Popconfirm>
                                    </span> : <></>}</td>
                                    <td>
                                        {item.groupName ? <span>{item.groupName}</span> : <span>Chưa Binding</span>}
                                    </td>
                                    <td>
                                        <span> {item.isDeviceOn ? <>on</> : <>off</>}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {selectedDevices.length >= 2 ? (
                            <a href="#" className="btn-download add_btn_device" data-mdb-toggle="modal" data-mdb-target="#exampleModal">
                                <span className="text">Add Binding</span>
                            </a>
                        ) : (
                            <a href="#" className="btn-download add_btn_device">
                                <span className="text" onClick={() => setShowMessage(true)}>Add Binding</span>
                            </a>
                        )}
                        {showMessage && message.warning("Vui lòng chọn ít nhất 2 thiết bị.")}
                        <AddBinding selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} />
                        <EditBinding groupId={groupId} setGroupId={setGroupId} listDevice={listDevice} />
                    </table>
                </div>
            </div>
        </main>
    );
}
