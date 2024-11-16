import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


export function AdminDashboard() {
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState<boolean>();

    useEffect(() => {
        if (cookies['userId']) {
            const getVideoStoredFeedback = localStorage.getItem('videoStoredFeedback');
            if (getVideoStoredFeedback === 'true') {
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                    localStorage.removeItem('videoStoredFeedback');
                }, 3000);
            }
        } else {
            navigate('/');
        }
    }, [navigate, cookies]);
    return (
        <div>
            <h2>Dashboard</h2>
            {showToast && (
                <div className="toast fade position-fixed bottom-0 end-0 show align-items-center text-bg-success border-0 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">Video Added Successfully</div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            )}
        </div>
    );
}