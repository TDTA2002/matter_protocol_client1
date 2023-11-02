import React, { FormEvent, useRef } from 'react';
import Input from 'antd/es/input/Input';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';

type InputRef = {
    input: HTMLInputElement;
};


export default function AddDevice() {
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
                                            <Input name="name" type="text" placeholder='Tên' ref={nameRef} />
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            Power <br />
                                            <Input name="power" type="text" placeholder='Mô tả' ref={powerRef} />
                                        </div>
                                        <div>
                                            Code <br />
                                            <Input name="code" type="text" placeholder='Giá' ref={codeRef} />
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