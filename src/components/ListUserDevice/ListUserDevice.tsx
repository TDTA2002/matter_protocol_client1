import React, { useEffect, useState } from 'react';
import { Button, Modal, Switch } from 'antd';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';
import './listuserdevice.scss'

enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

interface User {
  user: Props;
}

interface Props {
  email: string;
  id: string;
  role: UserRole;
  userId: string;
}

export default function ListUserDevice({ user }: User) {
  const userStore = useSelector((store: StoreType) => {
    return store.userStore;
  });
  const dataa = {
    name: "dwjdi1",
    power: 232121,
    node_id: 1232
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Props[]>([]);
  // console.log("isModalOpen", isModalOpen);




  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    sendSelectedUsersToServer(selectedUsers);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (user: Props) => {
    const selectedUserIndex = selectedUsers.findIndex((selectedUser) => selectedUser.id === user.id);
    console.log("selectedUserIndex", selectedUserIndex);

    if (selectedUserIndex !== -1) {
      const updatedSelectedUsers = [...selectedUsers];
      updatedSelectedUsers.splice(selectedUserIndex, 1);
      setSelectedUsers(updatedSelectedUsers);
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const sendSelectedUsersToServer = async (selectedUsers: Props[]) => {
    try {
      console.log("selectedUsers", selectedUsers);
      if (userStore.socket) {
        userStore.socket.emit("showPermis", selectedUsers, user.id, active)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [status, setStatus] = useState<{ [key: string]: boolean }>({}); // Sử dụng một đối tượng để lưu trạng thái của từng người dùng
  const [active, setActive] = useState<{ [key: number]: boolean }>({}); // Sử dụng một đối tượng để lưu trạng thái của từng người dùng
  console.log("active", active);

  const toggleUserStatus = (userId: string | number) => {

    setStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId],
    }));

  };
  const toggleActiceStatus = (userId: number) => {
    setActive((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId],
    }));
  };

  return (
    <>
      <Button type="primary" onClick={() => showModal()}>
        Devices
      </Button>
      <Modal title="Devices" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="container">
          <table className="my-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Power</th>
                <th className="table-header-cell">See</th>
                <th className="table-header-cell">Active</th>
              </tr>
            </thead>
            <tbody>
              {userStore.Device?.map((user: any, index: number) => (
                <tr key={Date.now() * Math.random()} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td className="table-data-cell">{user.name}</td>
                  <td className="table-data-cell">{user.power}</td>
                  <td className="table-data-cell"> <Switch checked={status[user.id]} onChange={() => { toggleUserStatus(user.id); handleCheckboxChange(user); }} />
                  </td>
                  <td className="table-data-cell switch">
                    <Switch checked={active[user.node_id]} onChange={() => { toggleActiceStatus(user.node_id) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
