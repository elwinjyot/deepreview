function retract() {
  gsap.to("#notification-card", {
    x: "200%",
    duration: 0.8,
    ease: Expo.easeOut,
  });
}

function notify(messageArray) {
  for (let message = 0; message < messageArray.length; message++) {
    const element = messageArray[message];
    $("#notification-card").append(`<h3>${element}</h3>`);
  }
  gsap.to("#notification-card", {
    x: "0%",
    duration: 0.8,
    ease: Expo.easeOut,
  });
}

$("#notification-card").click(() => {
  retract();
});

function spinner(button, path) {
  $(button).html(`<img src="${path}/Images/spinner-ball-ic.png" />`);
  let imgElement = $(button).find("img");
  gsap.to($(imgElement), {
    rotate: "-360deg",
    duration: 1,
    repeat: -1,
  });
}

$(".fee__month-item").click(function () {
  let requiredData = {
    currState: $(this).attr("data-state"),
    id: $(this).attr("data-id"),
    admnNo: $(this).attr("data-admno"),
  };
  $.ajax({
    method: "POST",
    url: `/teach/changeFeeState/${requiredData.admnNo}/`,
    data: {
      body: requiredData,
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {
      if (requiredData.currState === "True") {
        $(this).css({ "border-bottom-color": "#d52525" });
        $(this).attr("data-state", "False");
      } else {
        $(this).css({ "border-bottom-color": "#25d5a6" });
        $(this).attr("data-state", "True");
      }
    },
    error: () => {
      let month = $(this).text();
      $(this).text("Couldn't update. Please try again later");
      setTimeout(() => {
        $(this).text(month);
      }, 1300);
    },
  });
});

$("#login-form").submit(function (event) {
  event.preventDefault();
  spinner($(".loginBtn"), "../../static");
  $.ajax({
    method: "POST",
    url: "/",
    data: {
      username: $(this).find(`input[name="username"]`).val(),
      password: $(this).find(`input[name="password"]`).val(),
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: (response) => {
      $(".loginBtn").html(`<p style="margin-right: 6px;">Logged in</p><img src="../../static/Images/success-ic.png" style="height: auto; max-width: 28px;" /> `);
      setTimeout(() => {
        if (response) {
          window.location.replace("teach/selectClass/");
        } else {
          window.location.replace("parent/details/");
        }
      }, 1000);
    },
    error: () => {
      $(".loginBtn").html(`<p style="margin-right: 6px;">Password or username wrong!</p><img src="../../static/Images/error-ic.png" style="height: auto; max-width: 28px;" /> `);
      setTimeout(() => {
        $(".loginBtn").text(`Login`);
      }, 2000);
    },
  });
});

// Close AddStudent Panel
$("#close-addStudent-panel-btn").click(function () {
  console.log("Heyyoooo");
  let as_container = $("#addStudent-container");
  gsap
    .to("#addStud-wrapper", {
      x: "100%",
      ease: Expo.easeOut,

      duration: 0.5,
    })
    .then(() => {
      gsap
        .to($(as_container), {
          opacity: 0,
          duration: 0.2,
        })
        .then(() => {
          gsap.to($(as_container), {
            display: "none",
            duration: 0.2,
          });
        });
    });
});
// Open AddStudent Window
$("#addStudent-panel-open-btn").click(function () {
  let as_container = $("#addStudent-container");
  gsap
    .to($(as_container), {
      display: "flex",
      duration: 0.2,
    })
    .then(() => {
      gsap
        .to($(as_container), {
          opacity: 1,
          duration: 0.2,
        })
        .then(() => {
          gsap.to("#addStud-wrapper", {
            x: "0%",
            duration: 0.5,
            ease: Expo.easeOut,
          });
        });
    });
});

// Create student
$("#addStudentForm").submit(function (event) {
  event.preventDefault();
  let submitBtn = $("#create-student-btn");
  // Start Aniamtion
  $(submitBtn).text("Creating...");
  let gradeId = $(this).attr("data-gradeId");
  let formData = {
    admnNo: $(this).find(`input[name="admnNo"]`).val(),
    name: $(this).find(`input[name="name"]`).val(),
    fatherName: $(this).find(`input[name="father"]`).val(),
    motherName: $(this).find(`input[name="mother"]`).val(),
    dob: $(this).find(`input[name="dob"]`).val(),
    gender: $(this).find(`select[name="gender"] option:selected`).val(),
    adNo: $(this).find(`input[name="adNo"]`).val(),
    address: $(this).find(`input[name="address"]`).val(),
    remarks: $(this).find(`textarea[name="remarks"]`).val(),
  };
  $.ajax({
    method: "POST",
    url: `/teach/addStudent/${gradeId}/`,
    data: {
      body: JSON.stringify(formData),
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: (response) => {
      $(submitBtn).text("Student Created");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    error: () => {
      $(submitBtn).text("Oops, Something went wrong");
      $(this).trigger("reset");
      setTimeout(() => {
        $(submitBtn).text(`Create Student`);
      }, 2000);
    },
  });
});
// Create student

// Toggle release
$(".toggle-wrapper").click(function () {
  let indexId = $(this).attr("data-index");
  let state = $(this).attr("data-state");
  if (state == "on") {
    $(this).removeClass("active-toggle");
    $(this).attr("data-state", "off");
    state = false;
  } else {
    $(this).addClass("active-toggle");
    $(this).attr("data-state", "on");
    state = true;
  }
  $.ajax({
    method: "POST",
    url: "/teach/toggleRelease/",
    data: {
      index: indexId,
      admnNo: $(this).attr("data-admnNo"),
      grade: $(this).attr("data-grade"),
      state: JSON.stringify(state),
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {},
    error: () => {},
  });
});

// Delete student
let studDeleteAdmnNo = undefined;
$(".delete-stud").click(function () {
  studDeleteAdmnNo = $(this).attr("data-admnNo");
  gsap.to("#confirmation-box", {
    bottom: "5%",
    duration: 0.4,
    ease: Expo.easeOut,
  });
});
$(".cancel-delete").click(function () {
  setTimeout(() => {
    gsap.to("#confirmation-box", {
      bottom: "-40%",
      duration: 0.4,
      ease: Expo.easeOut,
    });
  }, 100);
});
$(".delete-confirm").click(function () {
  $(this).text("Deleting");
  $.ajax({
    method: "POST",
    url: "/teach/deleteStud/",
    data: {
      grade: $(this).attr("data-grade"),
      admnNo: studDeleteAdmnNo,
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {
      $(this).text("Deleted");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    error: () => {
      $(this).text("Delete");
      $("#confirmation-box p").text("Something went wrong!Please try again later.");
      setTimeout(() => {
        gsap.to("#confirmation-box", {
          bottom: "-40%",
          duration: 0.4,
          ease: Expo.easeOut,
        });
      }, 1600);
    },
  });
});
