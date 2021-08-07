// Loader
gsap.to("#loader-wrapper span", {
  duration: 0.5,
  repeat: -1,
  y: "-20px",
  stagger: 0.3,
  yoyo: true,
});

window.onload = function () {
  $("#loader").css({ opacity: 0 });
  setTimeout(() => {
    $("#loader").css({ display: "none" });
  }, 300);
};

function retract() {
  const card = $("#notification-container");
  gsap.to(card, {
    y: "-150%",
    duration: 0.6,
    ease: Expo.easeOut,
  });
}

$("#notification-container").click(() => {
  retract();
});

function popNotiCard(head, msg, ret) {
  const card = $("#notification-container");
  gsap.to(card, {
    y: "0%",
    duration: 0.6,
    ease: Expo.easeOut,
  });
  $(".head").text(head);
  $(".message").html(msg);

  if (ret) {
    setTimeout(() => {
      retract();
    }, 5000);
  }
}

setInterval(() => {
  if (!window.navigator.onLine) {
    popNotiCard("Oops!", "You are offline", false);
  }
}, 10000);

setInterval(() => {
  if (window.navigator.onLine) {
    retract();
  }
}, 10000);

function spinner(button) {
  $(button).html(`<p>&#128191;</p>`);
  let imgElement = $(button).find("p");
  gsap.to($(imgElement), {
    rotate: "-360deg",
    duration: 1,
    repeat: -1,
  });
}
