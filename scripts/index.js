/** @format */

let currentData = JSON.parse(localStorage.getItem("home_data")) || [];

const api = "AIzaSyB_ad5tJYt02K7UW1m6gO2tKjqUMgM4qpA";
const videoId = `https://youtube.googleapis.com/youtube/v3/videos?id=5aB_J0icrmc&key=${api}`;

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

//This code check if user opens page for the first time or press the back button:---->

let getRandomApi = async () => {
	try {
		let res = await fetch(
			`https://youtube.googleapis.com/youtube/v3/search?q=sports&key=${api}&part=snippet&maxResults=40`
		);
		let data = await res.json();
		appendVideos(data.items);
	} catch (err) {
		console.log(err);
	}
};

if (currentData.length !== 0) {
	appendVideos(currentData);
} else {
	getRandomApi();
}
