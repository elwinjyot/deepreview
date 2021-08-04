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
      $(".loginBtn").text(`Login`);
      $(".login-error-container").css({ display: "flex" });
      $(".login-error-container p").text(`Password or Email does not match!`);
      $(`input[name="username"], input[name="password"]`).css({ "border-color": "#ec3a3a" });
    },
  });
});

$(`input[name="username"], input[name="password"]`).on("change keyup paste", () => {
  $(`input[name="username"], input[name="password"]`).css({ "border-color": "#fc6e20" });
  $(".login-error-container").css({ display: "none" });
});

$(".show-pass").click(function () {
  const inputFd = $(`input[name="password"]`);
  if (inputFd.attr("type") == "password") {
    $(this).attr("src", "/static/Images/show-pass-ic.png");
    inputFd.attr("type", "text");
  } else {
    $(this).attr("src", "/static/Images/view-pass-ic.png");
    inputFd.attr("type", "password");
  }
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
  // Start Animation
  $(submitBtn).text("Creating...");
  let gradeId = $(this).attr("data-gradeId");
  let formData = {
    admnNo: $(this).find(`input[name="admnNo"]`).val(),
    name: $(this).find(`input[name="name"]`).val(),
    fatherName: $(this).find(`input[name="father"]`).val(),
    motherName: $(this).find(`input[name="mother"]`).val(),
    guardianName: $(this).find(`input[name="guardian"]`).val(),
    dob: $(this).find(`input[name="dob"]`).val(),
    gender: $(this).find(`select[name="gender"] option:selected`).val(),
    adNo: $(this).find(`input[name="adNo"]`).val(),
    address: $(this).find(`input[name="address"]`).val(),
    remarks: $(this).find(`textarea[name="remarks"]`).val(),
    attdn: $(this).find(`input[name="attdn"]`).val(),
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

// Delete Marksheet
$(".delete-marksheet").click(function () {
  let index = $(this).attr("data-index");
  let admnNo = $(this).attr("data-admnNo");
  $.ajax({
    method: "POST",
    url: "/teach/deleteMarksheet/",
    data: {
      index: index,
      admnNo: admnNo,
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {
      window.location.reload();
    },
    error: () => {
      window.location.reload();
    },
  });
});

// Edit Student
$(".edit-student-button").click(function () {
  let as_container = $("#addStudent-container");
  // Open editing panel
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
  // Open editing panel
});

// Save Edited student data
$("#editStudentForm").submit(function (event) {
  event.preventDefault();
  const saveBtn = $(this).find("#save-student-btn");
  const admno = saveBtn.attr("data-admnNo");
  saveBtn.text("Saving...");
  $.ajax({
    method: "POST",
    url: `/teach/editStudent/${admno}/`,
    data: {
      admnNo: $(this).find(`input[name="admnNo"]`).val(),
      name: $(this).find(`input[name="name"]`).val(),
      father: $(this).find(`input[name="father"]`).val(),
      mother: $(this).find(`input[name="mother"]`).val(),
      guardian: $(this).find(`input[name="guardian"]`).val(),
      dob: $(this).find(`input[name="dob"]`).val(),
      adNo: $(this).find(`input[name="adNo"]`).val(),
      address: $(this).find(`input[name="address"]`).val(),
      attdn: $(this).find(`input[name="attdn"]`).val(),
      remarks: $(this).find(`textarea[name="remarks"]`).val(),
      gender: $(this).find(`select[name="gender"] option:selected`).val(),
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: (res) => {
      if (res) {
        saveBtn.text("Changes Saved...Refreshing!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    error: () => {
      saveBtn.text("Cannot save the changes right now!");
      setTimeout(() => {
        saveBtn.text("Save");
      }, 1300);
    },
  });
});

// Upload Marksheet
$("#uploadCSV").change(function () {
  let marksheetAsCSV = new FormData();
  marksheetAsCSV.append("marksheet", $(this)[0].files[0]);
  console.log(marksheetAsCSV);
  $.ajax({
    method: "POST",
    url: "/teach/uploadMarksheet/",
    processData: false,
    contentType: false,
    data: marksheetAsCSV,
    headers: { "X-CSRFToken": $("input[name='csrfmiddlewaretoken']").val() },
    success: () => {},
    error: () => {},
  });
});
