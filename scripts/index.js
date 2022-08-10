/** @format */

let currentData = JSON.parse(localStorage.getItem("home_data")) || [];

const api = "AIzaSyB_ad5tJYt02K7UW1m6gO2tKjqUMgM4qpA";
const videoId = `https://youtube.googleapis.com/youtube/v3/videos?id=5aB_J0icrmc&key=${api}`;

//This code check if user opens page for the first time or press the back button:---->

let getRandomApi = async () => {
	try {
		let res = await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=40&regionCode=US&key=${api}`
		);
		let data = await res.json();
		appendVideos(data.items);
	} catch (err) {
		console.log(err);
	}
};

window.onload = function () {
	getRandomApi();
};

//ON searching:----->

let getApiData = async () => {
	let searchedData = document.querySelector("#query").value;
	try {
		let res = await fetch(
			`https://youtube.googleapis.com/youtube/v3/search?q=${searchedData}&key=${api}&part=snippet&maxResults=20`
		);
		let data = await res.json();
		return data;
	} catch (err) {
		console.log(err);
	}
};

let getData = async () => {
	let res = await getApiData();
	// console.log(res);
	let { items } = res;

	//Storing data in localStorage to display on pressing backbutton:-
	localStorage.setItem("home_data", JSON.stringify(items));

	let arr_of_videos = items;
	// console.log(arr_of_videos);
	appendVideos(arr_of_videos);
};

let appendVideos = (arr) => {
	// console.log(arr);
	let box = document.querySelector(".searchResult");
	box.innerHTML = null;
	arr.forEach((arr) => {
		let {
			snippet: {
				channelTitle,
				description,
				liveBroadcastContent,
				publishTime,
				thumbnails: {
					high: { url },
				},
			},
			snippet: { title },
			id: { videoId },
		} = arr;
		let div = document.createElement("div");
		div.classList.add("video");
		div.innerHTML = `<img src="${url}" alt="${title}" />
					<h4 class="title">${title}</h4>
					<p class="channelName">${channelTitle}</p>`;
		div.onclick = () => {
			let mov_data = {
				videoId: videoId,
				title: title,
				channelTitle: channelTitle,
				description: description,
			};
			localStorage.setItem("movie_data", JSON.stringify(mov_data));
			window.location.href = "./display.html";
		};
		box.append(div);
	});
};

let getApiOfCategories = async (ur) => {
	try {
		let res = await fetch(ur);
		let data = await res.json();
		// console.log(data);
		return data.items;
	} catch (err) {
		console.log(err);
	}
};

let displayByCLickingOnCategory = async (cat) => {
	let data = await getApiOfCategories(
		`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${cat}&type=video&key=${api}`
	);
	appendVideos(data);
};

let displayCategories = async () => {
	let arr = await getApiOfCategories(
		`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&US&key=${api}`
	);
	// console.log(arr);
	let box = document.querySelector(".sideBar");
	box.innerHTML = null;
	arr.forEach((ele) => {
		let {
			snippet: { title, channelId },
			id,
		} = ele;
		let btn = document.createElement("button");
		btn.classList.add("catBtn");
		btn.innerText = title;
		btn.addEventListener("click", () => {
			displayByCLickingOnCategory(title);
		});
		box.append(btn);
	});
};
displayCategories();
