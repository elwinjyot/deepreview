// Toggle fee state
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

// Toggle release
$(".rel-toggle-cta").click(function () {
  let state = undefined;

  if ($(`#rel-toggle${$(this).attr("data-index")}`).is(":checked")) {
    state = false;
  } else {
    state = true;
  }

  $.ajax({
    method: "POST",
    url: "/teach/toggleRelease/",
    data: {
      index: $(this).attr("data-index"),
      admnNo: $(this).attr("data-admnNo"),
      grade: $(this).attr("data-grade"),
      state: JSON.stringify(state),
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {},
    error: () => {},
  });
});

// Edit Student
$(".edit-student-button").click(function () {
  let as_container = $("#editStudent-container");
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
          gsap.to("#editStud-wrapper", {
            x: "0%",
            duration: 0.5,
            ease: Expo.easeOut,
          });
        });
    });
  // Open editing panel
});

// Close editing panel
$("#close-editStudent-panel-btn").click(function () {
  let as_container = $("#editStudent-container");
  gsap
    .to("#editStud-wrapper", {
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
