import React, { FormEvent, useRef } from 'react';
import Input from 'antd/es/input/Input';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';

type InputRef = {
    input: HTMLInputElement;
};
interface AddDeviceProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDevice: React.FC<AddDeviceProps> = ({ setIsLoading }) => {
    const userStore = useSelector((store: StoreType) => {
        return store.userStore
    })

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
                    setIsLoading(true)
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
                                <h1>Add Device</h1>
                                <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className='detailproduct'>
                                    <div>
                                        <div>
                                            Name <br />
                                            <Input name="name" type="text" placeholder='Name' ref={nameRef} />
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            Power <br />
                                            <Input name="power" type="text" placeholder='Power' ref={powerRef} />
                                        </div>
                                        <div>
                                            Code <br />
                                            <Input name="code" type="text" placeholder='code' ref={codeRef} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
                                <button type='submit' className="btn_save_device" data-mdb-dismiss="modal">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default AddDevice;
