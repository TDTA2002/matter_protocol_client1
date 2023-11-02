import { FormEvent, useEffect, useRef, useState } from 'react';
import Input from 'antd/es/input/Input';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';
// import { Device } from '@/store/slices/user.slices';
import "./editbinding.scss";

type InputRef = {
    input: HTMLInputElement;
};

interface Props {
    groupId: string;
    setGroupId: (groupId: string) => void;
    listDevice: Device[];
}
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
export default function EditBinding(props: Props) {
    const userStore = useSelector((store: StoreType) => {
        return store.userStore;
    });

    const filteredDevices = props.listDevice.filter(item => item.groupId === props.groupId);
    const devicesWithoutGroup = props.listDevice.filter(item => !item.groupId);

    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

    const nameRef = useRef<InputRef | null>(null);

    useEffect(() => {
        if (filteredDevices.length > 0) {
            const defaultName = filteredDevices[0].groupName;
            if (nameRef.current) {
                nameRef.current.input.value = defaultName;
            }
        }
    }, [filteredDevices]);

    const handleEdit = (e: FormEvent) => {
        e.preventDefault();

        // Lọc ra các thiết bị đã được chọn
        const selectedDeviceIds = devicesWithoutGroup
            .filter(item => selectedDevices.includes(item.id))
            .map(item => item.id); // Extract 'id' from each object

        if (nameRef.current) {
            const formData = {
                name: nameRef.current.input.value,
                deviceIds: selectedDeviceIds.join('+'),
                id: props.groupId,
            };

            if (formData) {
                if (userStore.socket) {
                    userStore.socket.emit('EditBinding', formData);
                    nameRef.current.input.value = '';
                    setSelectedDevices([]); // Đặt lại danh sách thiết bị đã chọn
                }
            }
        }
    }

    const handleDeviceSelection = (deviceId: string) => {
        if (selectedDevices.includes(deviceId)) {
            setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
        } else {
            setSelectedDevices([...selectedDevices, deviceId]);
        }
    }

    return (
        <>
            <div className="modal fade" id="EditModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form onSubmit={(e: FormEvent) => handleEdit(e)}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Thêm Sản Phẩm</h1>
                                <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className='detailproduct'>
                                    <div className='left_container'>
                                        <div className='group_name'>
                                            <span>Tên Group</span>
                                            <Input name="name" type="text" placeholder='Tên' ref={nameRef} />
                                        </div>
                                        <div className='group_list'>
                                            <span className='group_list_title'>Danh sách thiết bị của group.</span>
                                            {filteredDevices?.map((item, index) => (
                                                <div className='group_item' key={item.id}>
                                                    <span className='item_index'>{index + 1} :</span>
                                                    <span className='item_name'>{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='right_container'>
                                        <div className='list_device'>
                                            <span className='list_device_title'>Thêm thiết bị</span>
                                            {devicesWithoutGroup?.map((item, index) => (
                                                <div className='list_device_item' key={item.id}>
                                                    <span className='device_index'>{index + 1} :</span>
                                                    <span className='device_name'>{item.name}</span>
                                                    <input className='check_box'
                                                        type="checkbox"
                                                        onChange={() => handleDeviceSelection(item.id)}
                                                        checked={selectedDevices.includes(item.id)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">Đóng</button>
                                <button type='submit' className="btn btn-primary" data-mdb-dismiss="modal">Lưu</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
