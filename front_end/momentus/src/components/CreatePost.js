import React, {useState} from 'react';
import ReactDom from 'react-dom';
import {useDispatch, connect} from 'react-redux';
import './styles/createPost.css';
import axios from 'axios';
import photoUploadIcon from '../assets/photouploadicon.png';
import autosize from 'autosize';

/*
Dynamically adjusts whether it's a photo or text post depending on whether a photo is uploaded
Text and photo data now split for ease of use / readability
TODO: take you to post after upload
TODO: add tags
TODO: make photo upload image change when you hover over it
TODO: Add collection support
*/

function CreatePost () {
  var textAreas = document.querySelector('textarea');
  autosize(textAreas);
  const [postText, setPostText] = useState('');
  const [postPhoto, setPostPhoto] = useState(null);
  const [postTitle, setPostTitle] = useState(''); 
  // 2 types: text, photo
  const [postType, setPostType] = useState('none');

  // upon image upload, we will change the type to photo
  function fileChangeHandler (event) {
    setPostPhoto(event.target.files[0]);
    setPostType('photo');
  }

  function updateText (e) {
    setPostText (e.target.value);
    // if it is not already marked as a photo post, change to text post
    if (postType == 'none') {
      setPostType('text');
    }
    // resize textarea
    autosize.update(textAreas);
  }

  function updateTitle (e) {
    setPostTitle (e.target.value);
    // if it is not already marked as a photo post, change to text post
    if (postType == 'none') {
      setPostType('text');
    }
  }

  function uploadText (e) {
    e.preventDefault ();
    try {
      axios
        .post ('/newPostText', {
          title: postTitle,
          content: postText
        },
        {
          onUploadProgress: progressEvent => {
            console.log(progressEvent.loaded / progressEvent.total)
          }
        })
        .then (response => {
          console.log ('text post uploaded!');
        });
    } catch (err) {
      console.error (err.message);
    }
    // not sure what this line is for tbh
    //document.getElementById ('textContent').value = '';
  }

  function uploadPhoto (e) {
    e.preventDefault ();
    try {
      axios
        .post ('/newPostImage', {
          title: postText,
          contentURL: postPhoto,
          caption: postText
        })
        .then (response => {
          console.log ('photo post uploaded!');
        });
    } catch (err) {
      console.error (err.message);
    }
    //document.getElementById ('textContent').value = '';
  }
  

  return (
    <div className="create-post-wrapper">
      <form id="postForm">
      <div className="create-post-box-title">
          <input
            id="postTitle"
            type="text"
            name="postTitle"
            value={postTitle}
            placeholder="Enter a Title"
            onChange={e => updateTitle (e)}
          />
        </div>

        {postType == 'photo' ? <div className="create-post-box-caption">
          <textarea
            id="caption"
            type="text"
            name="caption"
            maxLength = "224"
            value={postText}
            placeholder="Add a caption!"
            onChange={e => updateText (e)}
          />
        </div>
        : 
        <div className="create-post-box-caption">
          <textarea
            id="textContent"
            type="text"
            name="textContent"
            maxlength = "65534"
            value={postText}
            placeholder="Write your post here!"
            onChange={e => updateText (e)}
          />
        </div>
        }
      
        <div className="image-upload">
          <label htmlFor="file-input" class="file-input-label"><img src = {photoUploadIcon} alt = "Photo  Upload"></img></label>
          <input id="file-input" class="file-input" type="file" accept="image/gif, image/jpeg, image/png" onChange = {fileChangeHandler}/>
          
          {postType == 'photo' ? <div className = "post-photo-remove">
          <button type="button" onClick={e => setPostType('text')}>
            Remove Image
          </button>
          </div>
          : null} 
          
          
          {postType == 'photo' ? 
          <div className = "photo-upload-button">
            <button type="button" onClick={e => uploadPhoto (e)}>
            Post Photo
          </button>
          </div> 
          : 
          <div className = "photo-upload-button">
            <button type="button" onClick={e => uploadText (e)}>
            Post Text
          </button>
          </div> }
          
        </div>
        
      </form>
    </div>
  );
}

/* 
Dynamically display photo after upload... doesn't work yet
{postType == 'photo' ? <div className = "post-photo-preview">
            <img src = {postPhoto} alt = "Your photo"></img></div>
            : null} */

export default CreatePost;
