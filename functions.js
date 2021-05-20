localStorage.setItem("host", "http://localhost:3001");
const fetch = require("node-fetch"); 


async function getResponse(url, next) {
	let res = await fetch(url);
	let jason = await res.json();
	next(jason);
}

async function postResponse(url, data, next) {
	let res = await fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: data
	});
	let jason = await res.json();
	next(jason);
}

const postById = (id, next) => {
	var url = localStorage.getItem("host") + '/getPostByID?postID='+id.toString();
	var data = JSON.stringify({});
	postResponse(url, data, function(jason) {
		next(jason);
	});
}

const postByUser = (id, next) => {
	var url = localStorage.getItem("host") + '/getPosts';
	var data = JSON.stringify({userID: "self", uid: id});
	postResponse(url, data, function(jason) {
		next(jason);
	});
}

const getFavPost = (id, next) => {
	var url = localStorage.getItem("host") + '/getPostFavorite?postID='+id;
	getResponse(url, function(jason) {
		next(jason);
	});
}

const getAllFav = (id, next) => {
	var url = localStorage.getItem("host") + '/getAllPostFavorite?uid='+id;
	getResponse(url, function(jason) {
		next(jason);
	});
}

const favorite = (id, next) => {
	var url = localStorage.getItem("host") + '/favorite?uid=2&postID='+id;
	var data = JSON.stringify({});
	postResponse(url, data, function(jason) {
		if (jason == 0) { console.log("favorite not made"); next(jason); return; }
		getFavPost(jason.id, function(jason2) {
			next(jason2);
		})
	});
}

const getProfile = (id, next) => {
	var url = localStorage.getItem("host") + '/getProfile?userID=self&uid='+id;
	getResponse(url, function(jason) {
		next(jason);
	});
}

const register = (eml, uname, pass, first, last, ct, stt, datebirth, image, next) => {
	var url = localStorage.getItem("host") + '/newUser';
	var data = JSON.stringify({email: eml, username: uname, password: pass, firstName: first, lastName: last, city: ct, state: stt, DOB: datebirth, pfpURL: image});
	postResponse(url, data, function(jason) {
		if (jason == 0) { console.log("user not made"); next(jason); return; }
		getProfile(jason.id, function(jason2) {
			next(jason2);
		})
	});
}

const login = (uname, pass, next) => {
	var url = localStorage.getItem("host") + '/verifyUser';
	var data = JSON.stringify({username: uname, password: pass});
	postResponse(url, data, function(jason) {
		next(jason);
	});
}

const newPostText = (ttl, ctt, next) => {
	var url = localStorage.getItem("host") + '/newPostText';
	var data = JSON.stringify({uid: 1, title: ttl, content: ctt});
	postResponse(url, data, function(jason) {
		if (jason == 0) { console.log("post not made"); next(jason); return; }
		postById(jason.id, function(jason2) {
			next(jason2);
		})
	});
}

const newPostImageLink = (ttl, cpt, imageURL, next) => {
	var url = localStorage.getItem("host") + '/newPostImage';
	var data = JSON.stringify({uid: 1, title: ttl, caption: cpt, contentURL: imageURL});
	postResponse(url, data, function(jason) {
		if (jason == 0) { console.log("post not made"); next(jason); return; }
		postById(jason.id, function(jason2) {
			next(jason2);
		})
	});
}

module.exports = {postById, register, login, newPostText, newPostImageLink, postByUser, getProfile, getFavPost, favorite, getAllFav};