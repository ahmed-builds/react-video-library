import { Link, useLocation } from "react-router-dom";
import { Login } from "../login/login";
import { Registration } from "../registration/registration";
import { useCookies } from "react-cookie";
import { useEffect } from "react";


export function Header() {
    const location = useLocation();

    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    
    useEffect(()=>{
        if(cookies['userId']){
        
        }
    },[]);

    if (location.pathname === '/login') {
        return <Login />;
    } else if (location.pathname === '/register') {
        return <Registration />
    }

    return (
        <header className="row topHeader py-3 bg-dark text-white d-flex justify-content-between align-items-center">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-center mb-2">
                <div className="fw-bold fs-5 me-2">Video Library</div>
                <div className="bi bi-list text-white fs-4" role="button"></div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 col-xl-8 col-xxl-8 searchForm mb-2">
                <input type="text" className="form-control" />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-end mb-2">
                {
                    (cookies['userId']) ?
                        'User'
                        :
                        <Link to="/login" className='text-white text-decoration-none btn btn-outline-primary'><span className='bi bi-box-arrow-in-right'></span> Sign In</Link>
                }
            </div>
        </header>
    );
}