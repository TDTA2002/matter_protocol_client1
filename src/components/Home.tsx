import { useEffect, useState } from "react";
import "./home.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from '@/assets/z4787944792026_b3b2b8ef0f17a15a59306b4383b0ac2c_transparent.png'
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "@/store";
import { Dropdown, MenuProps, Modal } from "antd";
import { userAction } from "@/store/slices/user.slices";

const Sidebar = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const [activeMenuItem, setActiveMenuItem] = useState<number | null>(0);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [searchFormVisible, setSearchFormVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuItemClick = (index: number) => {
    setActiveMenuItem(index);
  };

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  const toggleSearchForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (window.innerWidth < 576) {
      e.preventDefault();
      setSearchFormVisible(!searchFormVisible);
    }
  };

  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };


  const [isAdmin, setIsAdmin] = useState(false);


  const userStore = useSelector((store: StoreType) => store.userStore);

  const dispatch = useDispatch()
  const navigate = useNavigate();


  useEffect(() => {
    if (userStore.data == null) {

      navigate("/login");
    }
  }, [userStore])



  const checkAdmin = () => {
    if (userStore.data?.isAdmin) {
      setIsAdmin(!isAdmin)
    }
  }

  useEffect(() => {
    checkAdmin()
  }, [userStore])

  const handleLogout = () => {
    Modal.confirm({
      content: ("Are you sure you want to log out?"),
      onOk: () => {
        localStorage.removeItem("token");
        userStore.socket?.disconnect();
        dispatch(userAction.setData(null))
        dispatch(userAction.setSocket(null))
      },
    });
  };


  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => navigate("/profile")}>
          Profile
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => handleLogout()}>
          Log out
        </a>
      ),
    },
  ];




  return (
    <>
      <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
        {userStore.data?.isAdmin ? (
          <>
            <a href="#" className="brand">
              <i className="bx bxs-smile" />
              <span className="text">Admin</span>
            </a>
            <ul className="side-menu top">
              <li className={activeMenuItem === 1 ? 'active' : ''}>
                <Link to={"/device"} onClick={() => handleMenuItemClick(1)}>
                  <i className="bx bxs-shopping-bag-alt" />
                  <span className="text">Device</span>
                </Link>
              </li>
              <li className={activeMenuItem === 2 ? 'active' : ''}>
                <Link to={"/binding"} onClick={() => handleMenuItemClick(2)}>
                  <i className="bx bxs-doughnut-chart" />
                  <span className="text">Binding</span>
                </Link>
              </li>
              <li className={activeMenuItem === 3 ? 'active' : ''}>
                <Link to={"/users"} onClick={() => handleMenuItemClick(3)}>
                  <i className="bx bxs-group" />
                  <span className="text">Users</span>
                </Link>
              </li>
            </ul>
            <ul className="side-menu">
              <li>
                <a href="#" className="logout">
                  <i className="bx bxs-log-out-circle" />
                  <span className="text" onClick={() => handleLogout()}>Logout</span>
                </a>
              </li>
            </ul>
          </>
        ) : (
          <>
            <a href="#" className="brand">
              <i className="bx bxs-smile" />
              <span className="text">{userStore.data?.userName}</span>
            </a>
            <ul className="side-menu top">
              <li className={activeMenuItem === 1 ? 'active' : ''}>
                <Link to={"/device"} onClick={() => handleMenuItemClick(1)}>
                  <i className="bx bxs-shopping-bag-alt" />
                  <span className="text">Device</span>
                </Link>
              </li>
            </ul>
            <ul className="side-menu">
              <li>
                <a href="#" className="logout">
                  <i className="bx bxs-log-out-circle" />
                  <span className="text" onClick={() => handleLogout()}>Logout</span>
                </a>
              </li>
            </ul>
          </>
        )}

      </section>
      <section id="content">
        {/* NAVBAR */}
        <nav>
          <i className="bx bx-menu" onClick={toggleSidebar} />
          <form action="#">
            <div className={`form-input${searchFormVisible ? ' show' : ''}`}>
            </div>
          </form>
          <>
          </>
          <input type="checkbox" id="switch-mode" onChange={handleDarkModeChange} checked={darkMode} hidden />
          <label htmlFor="switch-mode" className="switch-mode" />
        </nav>
        {/* NAVBAR */}
        {/* MAIN */}
        <Outlet />
        {/* MAIN */}
      </section>
    </>
  );
};



export default Sidebar;