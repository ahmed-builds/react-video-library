import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { CategoriesContract } from "../../contracts/categories-contract";
import axios from "axios";
import { useFormik } from "formik";
import { VideoFormContract } from "../../contracts/video-form-contract";
import * as yup from "yup";


export function AdminAddVideos() {
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoriesContract[]>();
    const [getVideoId, setVideoId] = useState(0);

    useEffect(() => {
        if (cookies['userId']) {
            axios.get(`http://127.0.0.1:3030/get-categories`).then(categoriesLists => {
                setCategories(categoriesLists.data);
            });
            axios.get(`http://127.0.0.1:3030/get-videos`).then(getAllVideos => {
                setVideoId(getAllVideos.data.length);
            });
        } else {
            navigate('/');
        }
    }, [navigate, cookies]);

    const formik = useFormik<VideoFormContract>({
        initialValues: {
            videoId: 0,
            videoCategory: 0,
            videoTitle: '',
            videoDescription: '',
            videoURL: '',
            videoLikes: 0,
            videoDislikes: 0,
            videoViews: 0,
            videoStatus: 0,
        },
        validationSchema: yup.object({
            videoCategory: yup.number().required('Category is required').min(1,'Category is required'),
            videoTitle: yup.string().required('Title is required'),
            videoDescription: yup.string().required('Description is required'),
            videoURL: yup.string().required('URL is required'),
            videoLikes: yup.number().required('Likes is required'),
            videoDislikes: yup.number().required('Dislikes is required'),
            videoViews: yup.number().required('Views is required'),
            videoStatus: yup.number().required('Status is required').min(1,'Status is required')
        }),
        onSubmit: (storeVideo) => {
            var videoId = getVideoId + 1;
            storeVideo.videoId = videoId;
            axios.post(`http://127.0.0.1:3030/post-videos`, storeVideo).then(videoStores=>{                
                localStorage.setItem('videoStoredFeedback', 'true');
                navigate('/dashboard');
            })
        }
    });
    return (
        <div>
            <h2>Add Videos</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-floating mb-3">
                    <select name="videoCategory" id="videoCategory" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select</option>
                        {
                            categories?.map(category =>
                                <option key={category.categoryId} value={category.categoryId}>{category.categoryTitle}</option>
                            )
                        }
                    </select>
                    <label htmlFor="videoCategory">Category of Video</label>
                    <span className="text-danger">{formik.touched.videoCategory && formik.errors.videoCategory}</span>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" name="videoTitle" id="videoTitle" className="form-control" placeholder="Title" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <label htmlFor="videoTitle">Title</label>
                    <span className="text-danger">{formik.touched.videoTitle && formik.errors.videoTitle}</span>
                </div>
                <div className="form-floating mb-3">
                    <textarea name="videoDescription" id="videoDescription" className="form-control" placeholder="Description" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <label htmlFor="videoDescription">Description</label>
                    <span className="text-danger">{formik.touched.videoDescription && formik.errors.videoDescription}</span>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" name="videoURL" id="videoURL" className="form-control" placeholder="URL" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <label htmlFor="videoURL">URL</label>
                    <span className="text-danger">{formik.touched.videoURL && formik.errors.videoURL}</span>
                </div>
                <div className="row g-2">
                    <div className="col form-floating mb-3">
                        <input type="text" name="videoLikes" id="videoLikes" className="form-control" placeholder="Likes" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.videoLikes}/>
                        <label htmlFor="videoLikes">Likes</label>
                        <span className="text-danger">{formik.touched.videoLikes && formik.errors.videoLikes}</span>
                    </div>
                    <div className="col form-floating mb-3">
                        <input type="text" name="videoDislikes" id="videoDislikes" className="form-control" placeholder="Dislikes" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.videoDislikes} />
                        <label htmlFor="videoDislikes">Dislikes</label>
                        <span className="text-danger">{formik.touched.videoDislikes && formik.errors.videoDislikes}</span>
                    </div>
                </div>
                <div className="row g-2">
                    <div className="col form-floating mb-3">
                        <input type="text" name="videoViews" id="videoViews" className="form-control" placeholder="Views" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.videoViews}/>
                        <label htmlFor="videoViews">Views</label>
                        <span className="text-danger">{formik.touched.videoViews && formik.errors.videoViews}</span>
                    </div>
                    <div className="col form-floating mb-3">
                        <select name="videoStatus" id="videoStatus" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                            <option value="">Select</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <label htmlFor="videoStatus">Status</label>
                        <span className="text-danger">{formik.touched.videoStatus && formik.errors.videoStatus}</span>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-outline-success"><span className="bi bi-plus-square"></span> Add to Inventory</button>
                </div>
            </form>
        </div>
    );
}