import { useSelector } from "react-redux";
import "./binding.scss";
import { StoreType } from "@/store";
import { useEffect, useState } from "react";
import { ListBinding } from "@/store/slices/user.slices";
import AddBinding from "../AddBinding/AddBinding";
// import { Device } from "@/store/slices/user.slices"
import { message } from "antd";
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

    const userStore = useSelector((store: StoreType) => {
        return store.userStore;
    });
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
    console.log("listDevice", listDevice);
    console.log("listBinding", listBinding);

    const handleDeviceSelection = (deviceId: string) => {
        if (selectedDevices.includes(deviceId)) {
            setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
        } else {
            setSelectedDevices([...selectedDevices, deviceId]);
        }
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
                    <span
                        className="text"
                        data-mdb-toggle="modal"
                        data-mdb-target="#exampleModal"
                    >
                        Add New
                    </span>
                </a>
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
                                <th>Default</th>
                                <th>Name</th>
                                <th>Power</th>
                                <th className="group_detail_th">Detail</th>
                                <th>Group Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listDevice?.map((item: any) => (
                                <tr key={Date.now() * Math.random()}>
                                    <td>
                                        {item.groupName ? <></> : <input
                                            type="checkbox"
                                            onChange={() => handleDeviceSelection(item.id)}
                                            checked={selectedDevices.includes(item.id)}
                                        />}
                                    </td>
                                    <td>
                                        <p>
                                            <input
                                                type="text"
                                                defaultValue={item.name}
                                            />
                                        </p>
                                    </td>
                                    <td>
                                        <p>{item.power}W/h</p>
                                    </td>
                                    <td className="group_detail">
                                        {item.groupName ? <a href="#" className="btn-download add_btn" data-mdb-toggle="modal" data-mdb-target="#EditModal">
                                            <span className="text" onClick={() => {
                                                setGroupId(item.groupId)
                                            }}>Detail</span>
                                        </a> : <span>Detail</span>}
                                    </td>
                                    <td>
                                        {item.groupName ? <span>{item.groupName}</span> : <span>Chưa Binding</span>}
                                    </td>
                                    <td>
                                        <span> {item.isDeviceOn}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {selectedDevices.length >= 2 ? (
                            <a href="#" className="btn-download add_btn" data-mdb-toggle="modal" data-mdb-target="#exampleModal">
                                <span className="text">Add Binding</span>
                            </a>
                        ) : (
                            <a href="#" className="btn-download add_btn">
                                <span className="text" onClick={() => setShowMessage(true)}>Add Binding</span>
                            </a>
                        )}
                        {showMessage && message.warning("Vui lòng chọn ít nhất 2 thiết bị.")}
                        <AddBinding selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} />
                        <EditBinding groupId={groupId} setGroupId={setGroupId}/>
                    </table>
                </div>
            </div>
        </main>
    );
}
