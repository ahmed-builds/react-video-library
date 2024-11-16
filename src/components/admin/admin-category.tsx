import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { CategoriesContract } from "../../contracts/categories-contract";


export function AdminCategory() {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState<boolean>();
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);

    const [categoriesData, setCategoriesData] = useState<CategoriesContract[]>();

    useEffect(() => {
        if (cookies['userId']) {
            axios.get(`http://127.0.0.1:3030/get-categories`).then(categoriesLists => {
                setCategoriesData(categoriesLists.data);
            });
            const categoryCreationFeedback = localStorage.getItem('categoryCreatedFeedback');
            if (categoryCreationFeedback === 'true') {
                setShowToast(true);
                setTimeout(()=>{
                    setShowToast(false);
                    localStorage.removeItem('categoryCreatedFeedback');
                }, 3000);
            } else {
                setShowToast(false);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div>
            <h2 className="text-dark">Categories</h2>
            <div className="row">
                <div className="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-xxl-7">
                    <Link to="createCategory" className="btn btn-outline-primary bi bi-tag mb-3"> Create Category</Link>
                    {showToast && (
                        <div className="toast fade show align-items-center text-bg-primary border-0 mb-3 w-100" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="d-flex">
                                <div className="toast-body"><span className="bi bi-tag"></span> Category created successfully!!</div>
                                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                        </div>
                    )}
                    <div className="categoryList">
                        <table className="table table-responsive-lg table-striped table-bordered table-primary">
                            <thead>
                                <tr key='categoryHead'>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categoriesData?.map(category =>
                                        <tr key={category.categoryId}>
                                            <td>{category.categoryId}</td>
                                            <td>{category.categoryTitle}</td>
                                            <td>{category.categoryDescription}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-xxl-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
