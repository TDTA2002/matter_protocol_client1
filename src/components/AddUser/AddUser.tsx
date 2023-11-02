import React, { FormEvent, useRef } from 'react';
import { Input } from 'antd'; // Sửa đường dẫn import và component Input
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';

type InputRef = {
    input: HTMLInputElement;
};

export default function AddUser() {
    const userStore = useSelector((store: StoreType) => {
        return store.userStore;
    });

    const nameRef = useRef<HTMLSelectElement | null>(null);
    const roleRef = useRef<HTMLSelectElement | null>(null);

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();

        if (nameRef.current && roleRef.current) {
            const formData = {
                email: nameRef.current.value,
                role: roleRef.current.value,
            };

            console.log("formData", formData);

            if (formData && userStore.socket) {
                userStore.socket.emit('addRole', formData);
            }
        }
    }
    console.log("userdqw", userStore.ListU);


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
                                            Danh mục <br />
                                        </div>
                                        <div>
                                            <select name='categoriesId'>
                                                {userStore.ListU?.map((user: any, index: any) =>
                                                    <option key={user.id} ref={nameRef}>
                                                        {user.email}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <select name='role' ref={roleRef}>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="MEMBER">MEMBER</option>
                                            </select>
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
