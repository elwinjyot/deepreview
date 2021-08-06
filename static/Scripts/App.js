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
    popNotiCard("Oops!", "Please check your internet connection.", false);
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
        $(this).css({ "background-color": "#d52525" });
        $(this).attr("data-state", "False");
      } else {
        $(this).css({ "background-color": "#1ab48b" });
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
  spinner($(".loginBtn"));
  $.ajax({
    method: "POST",
    url: "/",
    data: {
      username: $(this).find(`input[name="username"]`).val(),
      password: $(this).find(`input[name="password"]`).val(),
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: (response) => {
      $(".loginBtn").html(`<p style="margin-right: 6px;">Logged in &#128077;</p>`);
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
      $(".login-error-container p").text(`Username or Password is not correct!`);
      $(`input[name="username"], input[name="password"]`).css({ "border-color": "#d52525" });
    },
  });
});

$(`input[name="username"], input[name="password"]`).on("change keyup paste", () => {
  $(`input[name="username"], input[name="password"]`).css({ "border-color": "#3456ff" });
  $(".login-error-container").css({ display: "none" });
});

$(".visib-ic").click(function () {
  const inputFd = $(`input[name="password"]`);
  if (inputFd.attr("type") == "password") {
    $(this).html("<p>&#128584;</p>");
    inputFd.attr("type", "text");
  } else {
    $(this).html("<p>&#128053;</p>");
    inputFd.attr("type", "password");
  }
});

// Close AddStudent Panel
$("#close-addStudent-panel-btn").click(function () {
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
  spinner(submitBtn);
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
      popNotiCard("Yay!", "<p>Student added. Hold on &#128524;</p>", true);
      $(submitBtn).text("Add Student");
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    },
    error: () => {
      popNotiCard("Oooh!", "<p>Something went wrong! Our team is on the way &#128521;</p>", true);
      $(this).trigger("reset");
      $(submitBtn).text(`Add Student`);
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
  spinner(this);
  $.ajax({
    method: "POST",
    url: "/teach/deleteStud/",
    data: {
      grade: $(this).attr("data-grade"),
      admnNo: studDeleteAdmnNo,
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {
      $(this).html("<p>&#128077;</p>");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    error: () => {
      $(this).text("Delete");
      popNotiCard("Oops!", "<p>Something's not right! We are looking into it &#128521;</p>", true);
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
  spinner(saveBtn);
  const admno = saveBtn.attr("data-admnNo");
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
        saveBtn.html("<p>&#128077;</p>");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    error: () => {
      popNotiCard("Oops!", "<p>Something's not right! Our team is looking into it &#128519;</p>", true);
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
