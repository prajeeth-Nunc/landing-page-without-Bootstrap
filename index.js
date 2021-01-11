"use strict";
let tag, styles, attr, text, color;

// Debouncing in JavaScript

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
const debounce = (func, wait) => {
  let timeout;
  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {
    // The callback function to be executed after
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;
      // Execute the callback
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);
    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
};

var state = {
  VidStatus: 0,
  itemsPerClick: 4,
  videoinfo: [],
};

const store = {
  setItem: (k, v) => {
    localStorage.setItem(k, v);
  },
  getItem: (k) => {
    return localStorage.getItem(k);
  },
};

function createElement(element, attr = {}, styles = {}) {
  let tag = document.createElement(element);
  if (Object.keys(attr).length !== 0) {
    setAttributes(tag, attr);
  }
  if (Object.keys(styles).length !== 0) {
    setStyles(tag, styles);
  }
  return tag;
}

function setAttributes(tag, attrbs) {
  for (let prop in attrbs) {
    tag.setAttribute(prop, attrbs[prop]);
  }
}

function setStyles(tag, styles) {
  let text = "";
  for (let style in styles) {
    text += `${style}: ${styles[style]};`;
  }
  tag.style.cssText = text;
}

function changeThemeColor(color) {
  store.setItem("theme", color);
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

$(document).ready(function () {
  changeThemeColor("DodgerBlue");
  fetch("themes.json")
    .then((res) => res.json())
    .then((data) => {
      tag = "a";
      data.forEach((e) => {
        attr = {
          class: e.class,
          id: e.id,
          onclick: "changeThemeColor('" + e.bgcolor + "')",
        };
        styles = {
          width: "20px",
          height: "20px",
          background: e.bgcolor,
        };
        let aTag = createElement(tag, attr, styles);
        $(".theme-container").append(aTag);
      });
    });
});

let validators = ["", null, undefined];
let posterContainer = $(".Poster-container")[0];
let mainVideo = $(".main-video")[0];
let video = $("video")[0];
let progressBar = $(".progress-bar")[0];

let iTag = createElement("i", {
  class: "fa fa-play-circle fa-3x play-btn theme",
});
let divTitle = createElement("div", { class: "vid-title my-3" });
let divDes = createElement("div", { class: "vid-des mb-3 text-secondary" });

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

// Theme bar UI
function themeBar() {
  console.log($(".theme-container"));
  if (
    $(".theme-container")[0].style.cssText === "" ||
    $(".theme-container")[0].style.cssText === "right: -50px;"
  ) {
    $(".theme-container")[0].style.cssText = "right: 0px;";
  } else {
    $(".theme-container")[0].style.cssText = "right: -50px;";
  }
}

// smaller devices Navbar handling
function handleNavInMob() {
  $("#navbar-items")[0].classList.toggle("show");

  // let currClasses = Array.from($("#navbar-items")[0].classList);
  // if (currClasses.includes("show")) {
  //   $("#navbar-items").removeClass("show");
  // } else {
  //   $("#navbar-items").addClass("show");
  // }
}

// set Nav link Active
$(".nav-link").each((index, element) => {
  setAttributes(element, { onclick: "setNavLinkActive(this)" });
});
function setNavLinkActive(link) {
  $(".nav-link").each((index, element) => {
    element.classList.remove("active");
  });
  link.classList.add("active");
}

// Video controlBar
function handleControlBar(flag) {
  flag === 1
    ? $(".controls").css({ bottom: "0px", display: "block" })
    : $(".controls").css({ bottom: "-40px" });
}

// Format current time
function getTime(time) {
  let minutes = parseInt(Math.round(time) / 60, 10);
  let seconds = Math.round(time % 60).toString();
  seconds =
    seconds.length === 1 ? "0" + seconds : seconds === 60 ? "00" : seconds;
  return minutes + ":" + seconds;
}

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
  if (state.VidStatus === 1) {
    state.VidStatus = 0;
    $(".main-video i.fa-play-circle").css({
      visibility: "visible",
      transition: "all 0.2s",
    });
    video.pause();
    $(".ctrl-pause-play").removeClass("fa-pause").addClass("fa-play");
  } else {
    state.VidStatus = 1;
    $(".main-video i.fa-play-circle").css({
      visibility: "hidden",
      transition: "all 0.2s",
    });
    video.play();
    $(".ctrl-pause-play").removeClass("fa-play").addClass("fa-pause");
  }
}

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

// Video FullScreen Control
$(".ctrl-fscreen").click(handleFullScreenVid);

function handleFullScreenVid() {
  let currClasses = Array.from($(".ctrl-fscreen")[0].classList);
  if (currClasses.includes("fa-expand")) {
    if (mainVideo.requestFullscreen) {
      mainVideo.requestFullscreen();
    } else if (mainVideo.webkitRequestFullscreen) {
      mainVideo.webkitRequestFullscreen();
    } else if (mainVideo.msRequestFullscreen) {
      mainVideo.msRequestFullscreen();
    }
    $(".ctrl-fscreen").removeClass("fa-expand").addClass("fa-compress");
  } else if (currClasses.includes("fa-compress")) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    $(".ctrl-fscreen").removeClass("fa-compress").addClass("fa-expand");
  }
}

// OnVideo finished
function handleVidFinish() {
  $(".ctrl-pause-play").removeClass("fa-pause").addClass("fa-play");
  state.VidStatus = 0;
}

// key events for video
// ctrl + up => volume up by 10%
// ctrl + down => volume down by 10%
// ctrl + right => video forward by 5 sec
// ctrl + left => video backward by 5 sec
var map = { 17: false, 37: false, 38: false, 39: false, 40: false };
$(document)
  .keydown(function (e) {
    if (e.keyCode in map) {
      map[e.keyCode] = true;
      if (map[17]) {
        if (map[37]) {
          // backwarding
          video.currentTime -= 5;
        } else if (map[39]) {
          // forwarding
          video.currentTime += 5;
        } else if (map[38]) {
          // volume ++
          video.volume += 0.1;
        } else if (map[40]) {
          // volume --
          video.volume -= 0.1;
        }
      }
    }
  })
  .keyup(function (e) {
    if (e.keyCode in map) {
      map[e.keyCode] = false;
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
  attr = {
    id: element.id,
    src: element.Video,
    poster: element.Poster,
    width: "100%",
    onclick: "PlayVid()",
    onplaying: "handleProgress()",
    onended: "handleVidFinish()",
  };
  if (video) {
    setAttributes(video, attr);
  } else {
    video = createElement("video", attr);
  }
  attr = {
    onmouseover: "handleControlBar(1)",
    onmouseout: "handleControlBar(0)",
  };
  setAttributes(mainVideo, attr);
  mainVideo.insertBefore(video, mainVideo.childNodes[0]);
  $(".cur-time").text("0:00");
  $("i.fa-play-circle").attr("onclick", "PlayVid()");
  $("i.fa-play-circle").css({ color: state.currentTheme });
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
  let divFlexItem = createElement("div", { class: "poster-item" });
  let divPoster = createElement("div", { class: "poster" });
  attr = {
    src: element.Poster,
    class: "pointer",
    alt: element.Title,
    onclick: "videoRender(" + element.id + ")",
  };
  let img = createElement("img", attr);

  iTag.style.cssText = "color: " + store.getItem("theme");
  divTitle.textContent = element.Title;
  divDes.textContent = element.Description;
  divPoster.innerHTML += img.outerHTML + iTag.outerHTML;
  divFlexItem.innerHTML +=
    divPoster.outerHTML + divTitle.outerHTML + divDes.outerHTML;
  if (renderFlag === 0) {
    // posterContainer.insertBefore(divFlexItem, posterContainer.childNodes[0]);
    $(".Poster-container").insertBefore(
      divFlexItem,
      posterContainer.childNodes[0]
    );
  } else {
    // posterContainer.appendChild(divFlexItem);
    $(".Poster-container").append(divFlexItem);
  }
}
// render Carousel images end

// swapping video with carousel posters
function videoRender(id = null) {
  $(".progress").css({ width: "0%" });
  state.VidStatus = 0;
  // let data = state.videoinfo;
  getVideoInfoData().then((data) => {
    state.videoinfo = data;
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
let exceptionalKeys = [
  "delete",
  "backspace",
  "arrowleft",
  "arrowright",
  undefined,
  "tab",
];

let fields = {
  fname: "#firstname + small",
  lname: "#lastname + small",
  email: "#email + small",
  phno: "#phone + small",
};

function expMsg(field, msg) {
  $(fields[field]).text(msg);
}

// validations while entering data in field
function validatePhoneNumber(e) {
  let button;
  try {
    button = e.key.toLowerCase();
  } catch {}
  var key = String.fromCharCode(e.which);
  if (exceptionalKeys.includes(button)) {
    if ($("#phone").val().length - 1 > 10) {
      expMsg("phno", "Invalid Phone Number.Must be 10 digits");
    } else {
      $("#phone + small").text("");
    }
    return;
  } else if (!/[0-9]/.test(key)) {
    e.preventDefault();
    return;
  } else if ($("#phone").val().length + 1 > 10) {
    expMsg("phno", "Invalid Phone Number.Must be 10 digits");
  } else {
    $("#phone + small").text("");
  }
}

$("form").submit(function validate(e) {
  e.preventDefault();
  document.querySelectorAll(".form-group small").forEach((smallTag) => {
    smallTag.textContent = "";
  });

  let fstname = $("#firstname").val();
  let lstname = $("#lastname").val();
  let email = $("#email").val();
  let phno = $("#phone").val();
  let cmts = $("#comments").val();
  let emailRegex = /^.*[@].*[.].*$/;

  if (validators.includes(fstname)) expMsg("fname", "Please Enter First Name");
  if (validators.includes(lstname)) expMsg("lname", "Please Enter Last Name");
  if (validators.includes(phno)) expMsg("phno", "Please Enter Last Name");
  else if (phno.length !== 10)
    expMsg("phno", "Invalid Phone Number.Must be 10 digits");
  if (validators.includes(email)) expMsg("email", "Please Enter Email Address");
  if (email.match(emailRegex)) {
  } else {
    expMsg("email", "Invalid Email Address");
  }
});
// Form end

// Network Status
function handleNetwork(flag) {
  text = flag
    ? "You are now connected to the network."
    : "Offline! No internet";
  color = flag ? "Green" : "Red";
  $(".network-status small").text(text);
  $(".network-status").css({
    transform: "translateY(52px)",
    background: color,
  });
  setTimeout(() => {
    $(".network-status").css({ transform: "translateY(30px)" });
  }, 3000);
}

window.ononline = () => {
  handleNetwork(1);
};
window.onoffline = () => {
  handleNetwork(0);
};
// Network Status end

// Cyclic Carousel images
$(window).resize(
  debounce(() => {
    let images = state.itemsPerClick;
    let width = $(this).width();
    console.log("width : ", width);
    if (width <= 576) {
      images = 1;
    } else if (width <= 768) {
      images = 2;
      try {
        $("#navbar-items").removeClass("show");
      } catch {}
    } else if (width <= 992) {
      images = 3;
    } else if (width > 992) {
      images = 4;
    }
    state.itemsPerClick = images;
  }, 2000)
);

let count = 1;
$(".left").click(() => {
  getVideoInfoData().then((data) => {
    let scrollcount = Math.ceil((data.length - 1) / state.itemsPerClick);
    if (count === 1) {
      posterContainer.scrollLeft += posterContainer.scrollWidth;
      count = scrollcount;
    } else {
      posterContainer.scrollLeft -= posterContainer.clientWidth;
      count--;
    }
  });
});

$(".right").click(() => {
  getVideoInfoData().then((data) => {
    let scrollcount = Math.ceil((data.length - 1) / state.itemsPerClick);
    if (count >= scrollcount) {
      posterContainer.scrollLeft = 0;
      count = 1;
    } else {
      posterContainer.scrollLeft += posterContainer.clientWidth;
      count++;
    }
  });
});
