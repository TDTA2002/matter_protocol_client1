import './main.scss';
import { useEffect, useState } from 'react'
import RouteSetup from './routes/RouteSetup'
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from './store';
import { Device, User, userAction, ListBinding, ListU, ListUser } from './store/slices/user.slices';
import { Socket, io } from 'socket.io-client';
import { Chart } from 'chart.js';

function App() {
  const dispatch = useDispatch()
  const userStore = useSelector((store: StoreType) => {
    return store.userStore
  })
  useEffect(() => {
    if (!userStore.data) {
      let token = localStorage.getItem("token");
      if (token) {
        let socket: Socket = io("http://localhost:3001", {
          query: {
            token
          }
        })
        socket.on("connectStatus", (data: { status: boolean, message: string }) => {
          if (data.status) {
            console.log(data.message)
          } else {
            console.log(data.message)
          }
        })
        socket.on("disconnect", () => {
          dispatch(userAction.setData(null))
        })
        socket.on("receiveUserData", (user: User) => {

          dispatch(userAction.setData(user))
        })
        socket.on("receiveDevice", (device: Device[]) => {
          dispatch(userAction.setDevice(device))
        })
        socket.on("receiveBinding", (ListBinding: ListBinding[]) => {
          dispatch(userAction.setListBinding(ListBinding))
        })
        socket.on("showChartList", (chart: Chart[]) => {
          dispatch(userAction.setChart(chart))
        })
        socket.on("listUser", (ListUser: ListUser[]) => {
          dispatch(userAction.setUser(ListUser))
        })
        socket.on("listU", (ListU: ListU[]) => {
          dispatch(userAction.setListU(ListU))
        })
        socket.on("showListPerByid", (ListPerByid: ListU[]) => {
          dispatch(userAction.setListPerById(ListPerByid))
        })
        dispatch(userAction.setSocket(socket))
      }
    }
  }, [userStore.reLoad])
  useEffect(() => {
    const interval = 1 * 60 * 1000; // 3 phút
    const checkLocalStorageData = () => {
      const localStorageData = localStorage.getItem('decodeData');
      if (localStorageData != undefined) {
        const dataArray = JSON.parse(localStorageData);
        for (let i in dataArray) {
          const parts = dataArray[i].decode.split('+')
          if (parts.length === 2) {
            const timestamp = parseInt(parts[1], 10);
            if (!isNaN(timestamp)) {
              const currentTime = Math.floor(Date.now());
              const time = ((currentTime - timestamp) / 1000);
              const isWithin10Minutes = time > 270;
              if (isWithin10Minutes) {
                dataArray.splice(dataArray[i], 1);
              }
            }
          }
        }
        localStorage.setItem('decodeData', JSON.stringify(dataArray));
      } else {
        clearTimeout(interval)
      }
    };
    const timeoutCallback = async () => {
      while (true) {
        checkLocalStorageData();
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    };
    timeoutCallback();
    return () => {
      console.log("clear");
      clearTimeout(interval)
    };
  }, []);
  return (
    <>
      <RouteSetup />
    </>
  )
}

export default App
