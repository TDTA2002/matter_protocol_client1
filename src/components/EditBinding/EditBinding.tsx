import { FormEvent, useEffect, useRef, useState } from 'react';
import Input from 'antd/es/input/Input';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';
import { Device } from '@/store/slices/user.slices';
import "./editbinding.scss"

type InputRef = {
    input: HTMLInputElement;
};
interface Props {
    groupId: string;
    setGroupId: (groupId: string) => void;
}
export default function EditBinding(props: Props) {
    console.log("props", props);

    const userStore = useSelector((store: StoreType) => {
        return store.userStore
    })
    console.log("ustore", userStore.Device);
    const [listDevice, setListDevice] = useState<Device[]>([]);
    const nameRef = useRef<InputRef | null>(null);
    useEffect(() => {
        if (userStore.Device && userStore.Device.length > 0) {
            setListDevice(userStore.Device);
        }
    }, [userStore.Device]);
    console.log("listDevice", listDevice);





    const handleCreate = (e: FormEvent) => {
        e.preventDefault();

        if (nameRef.current) {
            const formData = {
                name: nameRef.current.input.value,
            };
            console.log("formData", formData);
            if (formData) {
                if (userStore.socket) {
                    userStore.socket.emit('addBinding', formData);
                    nameRef.current.input.value = '';
                }
            }
        }
    }

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form onSubmit={(e: FormEvent) => handleCreate(e)}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1>Thêm Sản Phẩm</h1>
                                <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className='detailproduct'>
                                    <div>
                                        <div>
                                            Tên <br />
                                            <Input name="name" type="text" placeholder='Tên' ref={nameRef ?? null} />
                                        </div>
                                    </div>
                                    <div>
                                        <span>Danh sách thiết bị.</span>
                                        {/* {selectedDevices.map((item, index) => (
                                            <div className='itemBinding' key={Date.now() * Math.random()}>
                                                <span>{index + 1} :</span>
                                                <span>{item.name}</span>
                                            </div>
                                        ))} */}

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
