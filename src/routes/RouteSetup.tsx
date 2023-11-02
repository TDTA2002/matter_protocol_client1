import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lazy from '@util/lazies/lazy';
import Binding from "@components/Binding/Binding";
import Home from "@/components/Dashboard";
import Homemm from "@components/Home";
import MyChart from "@components/Chart/Chart";

import User from "@components/UserDevice/UserDevice";
import Device from "@components/Devices/Devices";
import DeviceUser from "@components/DeviceUser/DeviceUser"


export default function RouteSetup() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home - Navbar + Footer */}

        <Route path="/" element={<Homemm />}>
          <Route path="/" element={<Home />}></Route>

          <Route path="/device" element={<Device />}></Route>
          <Route path="/user-device" element={<DeviceUser />}></Route>

          <Route path="/Chart" element={<MyChart />}></Route>
          <Route path="/binding" element={<Binding />}></Route>
          <Route path="/users" element={<User />}></Route>

        </Route>
        <Route path="/login" element={Lazy(() => import("@components/Users/Formuser"))()}></Route>
        <Route path="/resetpassword" element={Lazy(() => import("@components/Users/Resetpassword/Resetpassword"))()}></Route>

      </Routes>
    </BrowserRouter>
  )
}