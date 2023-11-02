import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import "./qrCode.scss"
import QRCode from 'qrcode.react';

type Props = {
    QR_Code: string,
    setQR_Code: any,
    setShowModal: any,
}
export default function QrCode(props: Props) {

    const [open, setOpen] = useState(false);
    const [modalText, setModalText] = useState(props.QR_Code);

    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
        props.setQR_Code("")
        props.setShowModal(false)
    };
    useEffect(() => {
        showModal();
    }, []);

    return (
        <>
            <Modal
                open={open}
                onCancel={handleCancel}

            >
                <QRCode value={modalText} size={128} />
                {/* <span>{modalText}</span> */}
            </Modal>
        </>
    );
};

