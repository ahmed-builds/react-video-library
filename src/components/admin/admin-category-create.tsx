import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";


export function AdminCategoryCreate() {

    const [cookies, setCookie, removeCookie] = useCookies(['userId']);

    const [totalCategories, setTotalCategories] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (cookies['userId']) {
            axios.get(`http://127.0.0.1:3030/get-categories`).then(allCategories => {
                setTotalCategories(allCategories.data.length);
            });
        } else {
            navigate('/');
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            categoryId: 0,
            categoryTitle: '',
            categoryDescription: ''
        },
        validationSchema: yup.object({
            categoryTitle: yup.string().trim().required('Title is required'),
            categoryDescription: yup.string().trim().required('Description is required')
        }),
        onSubmit: (createCategory) => {
            var categoryId = totalCategories + 1;
            createCategory.categoryId = categoryId;
            axios.post(`http://127.0.0.1:3030/create-category`, createCategory).then(categoryCreated => {
                localStorage.setItem('categoryCreatedFeedback', 'true');
                navigate('/categories');
            });
        },
        validateOnBlur: true,
        validateOnChange: true
    });

    return (
        <div>
            <h3 className="text-dark">Create Category</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-floating mb-3">
                    <input type="text" name="categoryTitle" id="categoryTitle" className="form-control" placeholder="Title" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <label htmlFor="categoryTitle">Title</label>
                    <span className="text-danger">{formik.touched.categoryTitle && formik.errors.categoryTitle}</span>
                </div>
                <div className="form-floating mb-3">
                    <textarea name="categoryDescription" id="categoryDescription" className="form-control" placeholder="Description" onChange={formik.handleChange} onBlur={formik.handleBlur}></textarea>
                    <label htmlFor="categoryDescription">Description</label>
                    <span className="text-danger">{formik.touched.categoryDescription && formik.errors.categoryDescription}</span>
                </div>
                <div className="form-floating mb-3">
                    <button type="submit" className="btn btn-outline-dark"><span className="bi bi-tag"></span> Create</button>
                </div>
            </form>

        </div>
    );
}