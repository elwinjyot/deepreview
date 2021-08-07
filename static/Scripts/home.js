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
