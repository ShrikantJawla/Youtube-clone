/** @format */

let data = JSON.parse(localStorage.getItem("movie_data"));

//Display data got from the localStorage:
let { channelTitle } = data;
let displaysVideoData = (d) => {
	let box = document.querySelector(".videoPart");
	box.innerHTML = null;
	let { channelTitle, description, title, videoId } = d;
	box.innerHTML = `<iframe
					src="https://www.youtube.com/embed/${videoId}"
					frameborder="0"
					allow="fullscreen"
				></iframe>
				<h2 class="tiltle">
					${title}
				</h2>
				<div class="channelInfo">
					<div class="info">
						<h3 class="channelName">${channelTitle}</h3>
						<p class="chnlTitle">
							${description}
						</p>
					</div>
					<div class="subscribebtn">SUBSCRIBE</div>
				</div>
				<div class="comments">
					<input
						type="text"
						name=""
						id="comments"
						placeholder="Add a comment..."
					/>
				</div>`;
};
displaysVideoData(data);

api = "AIzaSyBLaw-CE0wJRMzzP_pxj3rmjhOgtNlK2yw";
const link = `https://youtube.googleapis.com/youtube/v3/search?q=${channelTitle}&key=${api}&part=snippet&maxResults=15`;
let fetchData = async (urls) => {
	let res = await fetch(urls);
	let data = await res.json();
	// console.log(data);
	return data.items;
};

let appendRelatedVideo = async () => {
	let box = document.querySelector(".related");
	box.innerHTML = null;
	let d = await fetchData(link);
	d.forEach((ele) => {
		let {
			id: { videoId },
			snippet: {
				channelTitle,
				title,
				thumbnails: {
					high: { url },
				},
				description,
			},
		} = ele;
		let div = document.createElement("div");
		div.classList.add("videoDiv");
		div.innerHTML = `<img src="${url}" alt="${title}" />
					<div class="content">
						<h5 class="videoTitle">
							${title}
						</h5>
						<p class="videoChannelname">${channelTitle}</p>`;
		div.addEventListener("click", () => {
			let sendData = {
				videoId: videoId,
				channelTitle: channelTitle,
				title: title,
				description: description,
			};
			localStorage.setItem("movie_data", JSON.stringify(sendData));
			window.location.href = "./display.html";
		});
		box.append(div);
	});
};

appendRelatedVideo();
