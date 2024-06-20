import React from 'react'
import '../pages/Profile.css'
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import horizontalMoreAction from '../images/horizontalMoreAction.PNG'

import { API_BASE_URL } from '../config';
import axios from 'axios';
import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector(state => state.userReducer);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState({ preview: '', data: '' });
    const [myallposts, setMyallposts] = useState([]);
    const [postDetail, setPostDetail] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showPost, setShowPost] = useState(false);

    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    const deletePost = async (postId) => {
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
        if (response.status === 200) {
          getMyPosts();
          handleClose();
        }
      }
    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }
    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData);
        return response;
    }

    const getMyPosts = async () => {
        const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_OBJ);
        if (response.status === 200) {
            setMyallposts(response.data.posts);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Some error occurred while getting your posts'
            })
        }
    }

    const addPost = async () => {
        if (image.preview === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post image is mandatory'
            })
        } else if (caption === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post caption is mandatory'
            })
        } else if (location === '') {
            Swal.fire({
                icon: 'error',
                title: 'Location is mandatory'
            })
        } else {
            setLoading(true);
            const imgRes = await handleImgUpload();
            const request = { description: caption, location: location, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
            const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ);
            setLoading(false);
            if (postResponse.status === 201) {
                navigate("/posts");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred while uploading post'
                })
            }
        }
    }

    const showDetail= (post)=>{
        setPostDetail(post);
    }

    useEffect(() => {
        getMyPosts();
    }, []);

    return (
        <div className='container shadow mt-3 p-4'>
            <div className='row'>
                <div className='col-md-6 d-flex flex-column'>
                    <img className='img-fluid p-2 profile-pic' alt='profile pic' src='https://plus.unsplash.com/premium_photo-1670596899123-c4c67735d77a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                    <p className='ms-3 fs-5 fw-bold'>{user.user.email}</p>
                    <p className='ms-3 fs-5'>{user.user.fullName}</p>
                    <p className='ms-3 fs-5'>UI/UX Designer @john | Follow @{user.user.fullName}</p>
                    <p className='ms-3 fs-5'>My portfolio on <a href='#'>www.portfolio.com/{user.user.fullName}</a></p>
                </div>
                <div className='col-md-6 d-flex flex-column justify-content-between mt-3'>
                    <div className='d-flex justify-content-equal mx-auto'>
                        <div className='count-section pe-md-5 pe-4 text-center fw-bold'>
                            <h4>{myallposts.length}</h4>
                            <p>Posts</p>
                        </div>
                        <div className='count-section px-md-5 px-4 text-center fw-bold'>
                            <h4>20</h4>
                            <p>Followers</p>
                        </div>
                        <div className='ps-md-5 ps-4 text-center fw-bold'>
                            <h4>20</h4>
                            <p>Following</p>
                        </div>
                    </div>
                    <div className='mx-auto mt-md-0 mt-4'>
                        <button className="custom-btn custom-btn-white me-md-3">
                            <span className='fs-9'>Edit Profile</span>
                        </button>
                        <button className="custom-btn custom-btn-white" onClick={handlePostShow}>
                            <span className='fs-9'>Upload Post</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* for the horizontal row */}
            <div className='row my-3'>
                <div className='col-12'>
                    <hr></hr>
                </div>
            </div>
            {/* for the posts section */}
            <div className='row mb-4'>
                {myallposts.map((post) => {
                    return (
                        <div className='col-md-4 col-sm-12' key={post._id}>
                            <div className="card" onClick={handleShow}>
                                <img onClick={()=>showDetail(post)} className="card-img-top" src={post.image} alt={post.description} />
                            </div>
                        </div>
                    )
                })}


            </div>


            <Modal show={show} onHide={handleClose} size="lg" >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div>
                                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                                    <div className="carousel-indicators">
                                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                    </div>
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <img src={postDetail.image} className="d-block w-100" alt="post picture" />
                                        </div>
                                        <div className="carousel-item">
                                            <img src="https://images.unsplash.com/photo-1664574653790-cee0e10a4242?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" className="d-block w-100" alt="post picture" />
                                        </div>
                                        <div className="carousel-item">
                                            <img src="https://images.unsplash.com/photo-1670396118274-4f14fdd6323d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" className="d-block w-100" alt="post picture" />
                                        </div>
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-6 d-flex'>
                                    <img className='p-2 post-profile-pic' alt='profile pic' src='https://plus.unsplash.com/premium_photo-1670596899123-c4c67735d77a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                                    <div className='mt-2 ms-2'>
                                        <p className='fs-6 fw-bold'>{postDetail.location}</p>
                                        <p className='location'>{postDetail.description}</p>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className="dropdown float-end">
                                        <a className="btn " href="#" role="button" data-bs-toggle="dropdown">
                                            <img alt="more action" src={horizontalMoreAction} />
                                        </a>

                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">
                                                <i className="fa-regular fa-pen-to-square px-2"></i>
                                                Edit Post
                                            </a></li>
                                            <li><a onClick={()=>deletePost(postDetail._id)} className="dropdown-item" >
                                                <i className="fa-sharp fa-solid fa-trash px-2"></i>Delete Post
                                            </a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <span className='p-2 text-muted'>2 Hours Ago</span>
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-12'>
                                    <p>Lorem ipsum dummy text Lorem ipsum dummy text Lorem ipsum text</p>
                                </div>
                            </div>

                            <div className='row my-3'>
                                <div className='col-6 d-flex'>
                                    <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                                    <i className="ps-3 fs-4 fa-regular fa-comment"></i>
                                    <i className="ps-3 fs-4 fa-solid fa-location-arrow"></i>
                                </div>
                                <div className='col-12 mt-3 ms-2'>
                                    <span className='fs-6 fw-bold'>200 likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>


            <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
                <Modal.Header closeButton>
                    <span className='fw-bold fs-5'>Upload Post</span>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6 col-m-12 mb-3'>
                            <div className='upload-box'>
                                <div className="dropZoneContainer">
                                    <input name='file' type="file" id="drop_zone" className="FileUpload" accept=".jpg,.png,.gif" onChange={(e) => handleFileSelect(e)} />
                                    <div className="dropZoneOverlay">
                                        {image.preview && <img src={image.preview} width='150' height='150' />}
                                        <br /><i class="fa-solid fa-cloud-arrow-up fs-2"></i><br />
                                        Upload Photo from Computer
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-between'>
                            <div className='row'>
                                <div className='col-sm-12 mb-3'>
                                    <div className="form-floating">
                                        <textarea onChange={(ev) => setCaption(ev.target.value)} className="form-control" placeholder="Add Caption" id="floatingTextarea"></textarea>
                                        <label for="floatingTextarea">Add Caption</label>
                                    </div>
                                </div>
                                <div className='col-sm-12'>
                                    <div className="form-floating mb-3">
                                        <input type="text" onChange={(ev) => setLocation(ev.target.value)} className="form-control" id="floatingInput" placeholder="Add Location" />
                                        <label for="floatingInput"><i className="fa-solid fa-location-dot pe-2"></i>Add Location</label>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-sm-12'>
                                    {loading ? <div className='col-md-12 mt-3 text-center'>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div> : ''}
                                    <button onClick={() => addPost()} className="custom-btn custom-btn-pink float-end">
                                        <span className='fs-9 fw-600'>Post</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>

        </div>
    )
}

export default Profile;