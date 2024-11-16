import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Errorpage } from "../errorpage";
import { Watchvideo } from "../watch/watchvideo";
import { AdminDashboard } from "../admin/admin-dashboard";
import { Homepage } from "../homepage";
import { Login } from "../login/login";
import { Registration } from "../registration/registration";
import { WatchLater } from "../users/watch-later";
import { LikedVideos } from "../users/liked-videos";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { sidebarMenuContract } from "../../contracts/sidebar-menu-contract";
import { AdminCategory } from "../admin/admin-category";
import { AdminCategoryCreate } from "../admin/admin-category-create";
import { AdminAddVideos } from "../admin/admin-add-videos";


export function Mainpage() {
    const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const [menuItems, setMenuItems] = useState<sidebarMenuContract[]>([]);
    const [accountType, setAccountType] = useState('');

    useEffect(() => {
        if (cookies['userId']) {
            axios.get(`http://127.0.0.1:3030/get-user/${cookies['userId']}`).then(response => {
                var userData = response.data;
                setAccountType(userData.userType);
            });
        }
        setMenuItems([
            { menuTitle: 'Dashboard', menuSlug: '/dashboard', menuIcon: 'bi bi-grid me-2 icon', accType: 'A' },
            { menuTitle: 'Add Videos', menuSlug: '/add-videos', menuIcon: 'bi bi-plus-square me-2 icon', accType: 'A' },
            { menuTitle: 'Categories', menuSlug: '/categories', menuIcon: 'bi bi-tags me-2 icon', accType: 'A' },
            { menuTitle: 'Create Category', menuSlug: '/categories/createCategory', menuIcon: 'bi bi-tag me-2 icon', accType: 'A' },
            { menuTitle: 'Home', menuSlug: '/', menuIcon: 'bi bi-house me-2 icon', accType: '' },
            { menuTitle: 'Watch Later', menuSlug: '/watch-later', menuIcon: 'bi bi-clock me-2 icon', accType: '' },
            { menuTitle: 'Liked Videos', menuSlug: '/liked-videos', menuIcon: 'bi bi-hand-thumbs-up me-2 icon', accType: '' },
        ]);

    }, [cookies['userId']]);

    if (['/watch', '/login', '/register'].includes(location.pathname)) {
        return null;
    }
    return (
        <div className="d-flex">
            <aside className="sidenav bg-dark text-white">
                <ul className="sidenav-nav">
                    {
                        menuItems.filter(item => accountType === item.accType || item.accType === '').map(
                            menuItem => (
                                <li key={menuItem.menuTitle} className={location.pathname === menuItem.menuSlug ? "sidenav-item active" : "sidenav-item"}>
                                    <Link to={menuItem.menuSlug} className="sidenav-link" aria-label={menuItem.menuTitle}>
                                        <span className={menuItem.menuIcon}></span>
                                        <span>{menuItem.menuTitle}</span>
                                    </Link>
                                </li>
                            ))
                    }
                </ul>
            </aside>

            <section className="mainSection p-3">
                <Routes>
                    <Route path="/" element={<Homepage />}/>
                    <Route path="dashboard" element={<AdminDashboard />}/>
                    <Route path="login" element={<Login />}/>
                    <Route path="register" element={<Registration />}/>
                    <Route path="watch" element={<Watchvideo />}/>
                    <Route path="watch-later" element={<WatchLater />}/>
                    <Route path="liked-videos" element={<LikedVideos />}/>
                    <Route path="add-videos" element={<AdminAddVideos />}/>
                    <Route path="categories" element={<AdminCategory />}>
                        <Route path="createCategory" element={<AdminCategoryCreate/>}/>
                    </Route>
                    <Route path="*" element={<Errorpage />}/>
                </Routes>
            </section>
        </div>
    );
}