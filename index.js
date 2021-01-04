$(document).ready(function () {
  localStorage.setItem("mainVidStatus", 0);
  let currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    changeThemeColor(currentTheme);
  } else changeThemeColor("#86C232");

  fetch("themes.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((e) => {
        aTag = document.createElement("a");
        let attr = {
          class: e.class,
          id: e.id,
          onclick: "changeThemeColor('" + e.bgcolor + "')",
        };
        setAttributes(aTag, attr);
        aTag.style.cssText =
          "width: 20px;height: 20px;background: " + e.bgcolor;
        $(".theme-container").append(aTag);
      });
    });
});

let posterContainer = $(".Poster-container")[0];
let mainVideo = $(".main-video")[0];
let video = $("video")[0];
let progressBar = $(".progress-bar")[0];

let validators = ["", null, undefined];
let iTag = document.createElement("i");
iTag.setAttribute("class", "fa fa-play-circle fa-3x play-btn pointer theme");
let divTitle = document.createElement("div");
divTitle.setAttribute("class", "vid-title my-3");
let divDes = document.createElement("div");
divDes.setAttribute("class", "vid-des mb-3 text-secondary");

// get videosobjects json 
function getVideoInfoData() {
  return new Promise((resolve, reject) => {
    fetch("videoInfo.json")
      .then((res) => res.json())
      .then((data) => {
        return resolve(data);
      });
  });
}
// get videosobjects json end

// setattributes if multiple
function setAttributes(tag, attrbs) {
  for (let prop in attrbs) {
    tag.setAttribute(prop, attrbs[prop]);
  }
}
// setattributes if multiple end

// Theme color change
let currentTheme = localStorage.getItem("theme");
if (currentTheme) changeThemeColor(currentTheme);
else changeThemeColor("#86C232");

function changeThemeColor(color) {
  localStorage.setItem("theme", color);
  $(".navbar a").each((index, element) => {
    element.style.cssText = "color: white";
  });
  $(".theme").each((index, element) => {
    element.style.cssText = "color:" + color;
  });
  $(".bg-theme").each((index, element) => {
    element.style.cssText = "background: " + color + ";color: white;";
  });
}
// Theme color change end


// Theme bar UI
function themeBar() {
  if (
    $(".theme-container")[0].style.cssText === "" ||
    $(".theme-container")[0].style.cssText === "right: -50px;"
  ) {
    $(".theme-container")[0].style.cssText = "right: 0px;";
  } else {
    $(".theme-container")[0].style.cssText = "right: -50px;";
  }
}
// Theme bar UI end

// smaller devices Navbar handling
function handleNavInMob() {
  let currClasses = Array.from($("#navbar-items")[0].classList);
  if (currClasses.includes("show")) {
    $("#navbar-items").removeClass("show");
  } else {
    $("#navbar-items").addClass("show");
  }
}
// smaller devices Navbar handling end 

// set Nav link Active
$(".nav-link").each((index,element) => {
  element.setAttribute("onclick", "setNavLinkActive(this)");
});
function setNavLinkActive(link) {
  $(".nav-link").each((index,element) => {
    element.classList.remove("active");
  });
  link.classList.add("active");
}
// set Nav link Active end


// Video controlBar  
function handleControlBar(flag) {
  flag === 1
    ? $(".controls").css({ bottom: "0px", display: "block" })
    : $(".controls").css({ bottom: "-40px" });
}
// Video controlBar End

// Format current time
function getTime(time) {
  let minutes = parseInt(Math.round(time) / 60, 10);
  let seconds = Math.round(time % 60).toString();
  seconds =
    seconds.length === 1 ? "0" + seconds : seconds === 60 ? "00" : seconds;
  return minutes + ":" + seconds;
}
// Format current time End

// video ProgressBar 
function handleProgress() {
  setInterval(() => {
    $(".cur-time").text(getTime(video.currentTime));
    $(".progress").css(
      { width: Math.round((video.currentTime / video.duration) * 100) + "%" },
      1000
    );
  });
}
// video ProgressBar end

// Video play from clicked position
$(".progress-bar").click(function handlePlayFrmHere(e) {
  let position = Math.round((e.offsetX / progressBar.clientWidth) * 100);
  video.currentTime = (video.duration * position) / 100;
  $(".progress").css({ width: position + "%" });
});
// Video play from clicked position end

// Play Video
function PlayVid() {
  let flag = parseInt(localStorage.getItem("mainVidStatus"));
  if (flag === 1) {
    localStorage.setItem("mainVidStatus", 0);
    $(".main-video i.fa-play-circle").css({
      visibility: "visible",
      transition: "all 0.2s",
    });
    video.pause();
    $(".ctrl-pause-play").removeClass("fa-pause").addClass("fa-play");
  } else {
    localStorage.setItem("mainVidStatus", 1);
    $(".main-video i.fa-play-circle").css({
      visibility: "hidden",
      transition: "all 0.2s",
    });
    video.play();
    $(".ctrl-pause-play").removeClass("fa-play").addClass("fa-pause");
  }
}
// Play Video end

// video Volume control
$(".ctrl-vol").click(function ctrlVolume() {
  let currClasses = Array.from($(".ctrl-vol")[0].classList);
  if (currClasses.includes("fa-volume-up")) {
    $(".ctrl-vol").removeClass("fa-volume-up").addClass("fa-volume-mute");
    video.muted = true;
  } else if (currClasses.includes("fa-volume-mute")) {
    $(".ctrl-vol").removeClass("fa-volume-mute").addClass("fa-volume-up");
    video.muted = false;
  }
});
// video Volume control end

// Video FullScreen Control
$(".ctrl-fscreen").click(function handleFullScreenVid() {
  let currClasses = Array.from($(".ctrl-fscreen")[0].classList);
  if (currClasses.includes("fa-expand")) {
    // if (screen.orientation.type === "landscape" || "landscape-primary") {
    //   screen.orientation.lock("potrait");
    // }
    if (mainVideo.requestFullscreen) {
      mainVideo.requestFullscreen();
    } else if (mainVideo.webkitRequestFullscreen) {
      mainVideo.webkitRequestFullscreen();
    } else if (mainVideo.msRequestFullscreen) {
      mainVideo.msRequestFullscreen();
    }
    $(".ctrl-fscreen").removeClass("fa-expand").addClass("fa-compress");
  } else if (currClasses.includes("fa-compress")) {
    // if (screen.orientation.type === "potrait" || "potrait-primary") {
    //   screen.orientation.lock("landscape");
    // }
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    $(".ctrl-fscreen").removeClass("fa-compress").addClass("fa-expand");

  }
});
// Video FullScreen Control end

// OnVideo finished
function handleVidFinish() {
  $(".ctrl-pause-play").removeClass("fa-pause").addClass("fa-play");
  localStorage.setItem("mainVidStatus", 0);
}
// OnVideo finished end

// video forwarding and backwarding
document.addEventListener("keydown", function handleKeypressEvents(e) {
  switch (e.keyCode) {
    case 37:
      video.currentTime -= 5;
      break;
    case 39:
      video.currentTime += 5;
      break;
    default:
      console.log(e.keyCode);
  }
});

function handleForwardBackward(flag) {
  if (flag === 1) {
    video.currentTime += 5;
  } else {
    video.currentTime -= 5;
  }
}
// video forwarding and backwarding


// video looping
$(".ctrl-vidloop").click(function handleVideoLoop() {
  if (video.loop) {
    video.loop = false;
    $(".ctrl-vidloop").css({ color: "white" });
  } else {
    video.loop = true;
    $(".ctrl-vidloop").css({ color: "dodgerblue" });
  }
});
// video looping end

// Playback speed controls
$("#playbackspeed").change(function handlePlayBackSpeed() {
  video.playbackRate = $("#playbackspeed").val();
});
// Playback speed controls end

// mainVideo render UI
function renderMainVideo(element) {
  if (video) {
  } else {
    video = document.createElement("video");
  }
  let attr = {
    id: element.id,
    src: element.Video,
    poster: element.Poster,
    width: "100%",
    onclick: "PlayVid()",
    onplaying: "handleProgress()",
    onended: "handleVidFinish()",
  };
  setAttributes(video, attr);
  attr = {
    onmouseover: "handleControlBar(1)",
    onmouseout: "handleControlBar(0)",
  };
  setAttributes(mainVideo, attr);
  mainVideo.insertBefore(video, mainVideo.childNodes[0]);
  $(".cur-time").text("0:00");
  $("i.fa-play-circle").attr("onclick", "PlayVid()");
  $("i.fa-play-circle").css({ color: currentTheme });
  $(".main-vid-title").text(element.Title);
  $(".main-vid-des").text(element.Description);
  video.onloadedmetadata = () => {
    let minutes = parseInt(video.duration / 60, 10);
    let seconds = Math.round(video.duration % 60);
    $(".duration").text(minutes + ":" + seconds);
  };
}
// mainVideo render UI end

// render Carousel images 
function renderCarouselImages(
  element,
  count,
  iTag,
  divTitle,
  divDes,
  renderFlag
) {
  let divFlexItem = document.createElement("div");
  // poster-item
  divFlexItem.setAttribute("class", "poster-item");
  let divPoster = document.createElement("div");
  divPoster.setAttribute("class", "poster");
  let img = document.createElement("img");
  let attr = {
    src: element.Poster,
    class: "pointer",
    alt: element.Title,
    onclick: "videoRender(" + element.id + ")",
  };
  setAttributes(img, attr);
  iTag.style.cssText = "color: " + currentTheme;
  divTitle.textContent = element.Title;
  divDes.textContent = element.Description;
  divPoster.innerHTML += img.outerHTML + iTag.outerHTML;
  divFlexItem.innerHTML +=
    divPoster.outerHTML + divTitle.outerHTML + divDes.outerHTML;
  if (renderFlag === 0) {
    posterContainer.insertBefore(divFlexItem, posterContainer.childNodes[0]);
  } else {
    posterContainer.appendChild(divFlexItem);
  }
}
// render Carousel images end

// swapping video with carousel posters
function videoRender(id = null) {
  $(".progress").css({ width: "0%" });
  localStorage.setItem("mainVidStatus", 0);
  getVideoInfoData().then((data) => {
    let count = data.length;
    id = id === null ? 1 : id;
    $(".Poster-container").text("");
    let video = mainVideo.querySelector("video");
    if (video) {
      const videoId = video.id;
      let prevVID = data[videoId - 1];
      data.splice(id - 1, 0, prevVID);
      if (id - 1 < videoId) {
        data.splice(videoId, 1);
      } else {
        data.splice(videoId - 1, 1);
      }
      localStorage.setItem("id", id);
      data.forEach((element) => {
        if (element.id === id) {
          renderMainVideo(element);
        } else {
          renderCarouselImages(element, count, iTag, divTitle, divDes, 1);
        }
      });
    } else {
      let mainVID = data.filter((vid) => {
        return vid.id == id;
      });
      data.forEach((element) => {
        if (element.id === id) {
          renderMainVideo(mainVID[0]);
        } else {
          renderCarouselImages(element, count, iTag, divTitle, divDes, 1);
        }
      });
    }
  });
}
// swapping video with carousel posters

videoRender();


// Form
$("form").submit(function validate(e) {
  e.preventDefault();
  document.querySelectorAll(".form-group small").forEach((smallTag) => {
    smallTag.textContent = "";
  });
  var formgroup;

  let small = document.createElement("small");
  small.setAttribute("class", "text-danger");

  let fstname = $("#firstname").val();
  let lstname = $("#lastname").val();
  let email = $("#email").val();
  let phno = $("#phone").val();
  let cmts = $("#comments").val();

  let emailRegex = /^.*[@].*[.].*$/;

  if (validators.includes(fstname)) {
    formgroup = $("#firstname").parent();
    small.textContent = "Please Enter First Name";
  } else if (validators.includes(lstname)) {
    formgroup = $("#lastname").parent();
    small.textContent = "Please Enter Last Name";
  } else if (validators.includes(email)) {
    formgroup = $("#email").parent();
    small.textContent = "Please Enter Email Address";
  } else if (validators.includes(phno)) {
    formgroup = $("#phone").parent();
    small.textContent = "Please Enter Phone Number";
  } else if (phno.length !== 10) {
    formgroup = $("#phone").parent();
    small.textContent = "Invalid Phone Number.Must be 10 digits";
  } else {
    if (email.match(emailRegex)) {
      console.log("Submit form");
    } else {
      formgroup = $("#email").parent();
      small.textContent = "Invalid Email Address";
    }
  }
  if(formgroup !== undefined){
    formgroup.append(small);
  }
});
// Form end

// Network Status
window.addEventListener("online", () => {
  $(".network-status small").text("You are now connected to the network.");
  ($(".network-status")[0].style.cssText =
    "transform : translateY(0px);background : green;"),
    setTimeout(() => {
      $(".network-status")[0].style.cssText = "transform : translateY(-35px);";
    }, 3000);
});

window.addEventListener("offline", () => {
  $(".network-status small").text("Offline! No internet");
  ($(".network-status")[0].style.cssText =
    "transform : translateY(0px);background : red;"),
    setTimeout(() => {
      $(".network-status")[0].style.cssText = "transform : translateY(-35px);";
    }, 3000);
});
// Network Status end




// Cyclic Carousel images
// $(".carousel-ctrls .left").click(scrollRight);
// $(".carousel-ctrls .right").click(scrollLeft);

// window.addEventListener("resize", handlePosterContainer);

// function handlePosterContainer() {
//   let totWidth = posterContainer.offsetWidth;
//   console.log(totWidth);
// }

let itemsPerClick = 3;
let countLeft = 1;
let nLeft = 1;
let nRight = 1;
let countRight = 1;

function scrollRight() {
  getVideoInfoData().then((data) => {
    let count = data.length - 1;
    let totalClicks = Math.round((count * nLeft) / itemsPerClick);
    if (countLeft === totalClicks - 1) {
      let reversedData = data.reverse();
      reversedData.forEach((element) => {
        if (element.id === parseInt(video.id)) {
        } else {
          renderCarouselImages(element, count, iTag, divTitle, divDes, 0);
        }
      });
      nLeft++;
      countLeft = 1;
    }
    countLeft++;
    let item = posterContainer.querySelector(".poster-item");
    posterContainer.scrollLeft -= itemsPerClick * item.clientWidth;
  });
}

function scrollLeft() {
  getVideoInfoData().then((data) => {
    let count = data.length - 1;
    let totalClicks = Math.round((count * nRight) / itemsPerClick);
    if (countRight === totalClicks - 1) {
      data.forEach((element) => {
        if (element.id === parseInt(video.id)) {
        } else {
          renderCarouselImages(element, count, iTag, divTitle, divDes, 1);
        }
      });
      nRight++;
      countRight = 1;
    }
    countRight++;
    let item = posterContainer.querySelector(".poster-item");
    posterContainer.scrollLeft += itemsPerClick * item.clientWidth;
  });
}
