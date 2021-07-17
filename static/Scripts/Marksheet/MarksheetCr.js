let marksheetFormat = {};

let format = "UT";
let admnNo = $(".cr-marksheet").attr("data-admnNo");
let grade = $(".cr-marksheet").attr("data-grade");

// Open Marksheet Creation window
$(".cr-marksheet").click(function () {
  gsap
    .to("#create-marksheet-container", {
      display: "flex",
    })
    .then(() => {
      gsap
        .to("#create-marksheet-container", {
          opacity: 1,
          duration: 0.2,
        })
        .then(() => {
          gsap.to("#create-marksheet-wrapper", {
            x: "0%",
            duration: 0.6,
            ease: Expo.easeOut,
          });
        });
    });
});

// Close Marksheet Creation window
$(".cancel-marksheet-cr").click(function (event) {
  event.preventDefault();
  $(".format-holder").html(`<h2>Select a format to load form</h2>`);
  $("#create-marksheet").trigger("reset");
  gsap
    .to("#create-marksheet-wrapper", {
      x: "100%",
      duration: 0.6,
      ease: Expo.easeOut,
    })
    .then(() => {
      gsap
        .to("#create-marksheet-container", {
          opacity: 0,
          duration: 0.2,
        })
        .then(() => {
          gsap.to("#create-marksheet-container", {
            display: "none",
          });
        });
    });
});

$(".format-change").change(function () {
  format = $(this).find("option:selected").val();

  if (format == "UT") {
    console.log(format);
    $(".addSubject").html(`<button type="button" onclick=addSubject()>Add Subject</button>`);
    $(".format-holder").html(`<section class="subjects"></section>`);
    $(".title-dropdown").html(`
      <option value="PT1" data-index="0">PT1</option>
      <option value="PT3" data-index="2"">PT3</option>
    `);
  } else if (format == "MT") {
    $(".format-holder").html(`
    <h2>Terminal Examination form not available as of now!</h2>
    `);
    $(".title-dropdown").html(`
      <option value="PT2" data-index="1"">Half-Yearly</option>
      <option value="PT4" data-index="3"">Final</option>
    `);
  } else {
    $(".format-holder").html(`
      <h2>Select a format to load form</h2>
    `);
  }
});

function addSubject() {
  $(".format-holder .subjects").append(`
    <section class="subject-tab">
      <div class="input-group gender-grp">
        <div class="select-option-group">
          <div class="drop-btn-div">
            <p>+</p>
          </div>
          <select class="" name="subName">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Sanskrit">Sanskrit</option>
            <option value="EVS">EVS</option>
            <option value="Science">Science</option>
            <option value="S.S.T">S.S.T</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer">Computer</option>
            <option value="G.K">G.K</option>
            <option value="V.Ed">Value Education</option>
            <option value="Dance">Dance</option>
            <option value="Music">Music</option>
            <option value="HPE">HPE</option>
          </select>
        </div>
      </div>
      <input type="text" name="marks" required autocomplete="off" placeholder="/40">
      </section>
      `);
}

$("#create-marksheet").submit(function (event) {
  $(".submit-marksheet-cr").text("Creating");
  event.preventDefault();
  let head = $(".title-dropdown option:selected").val();
  let index = $(".title-dropdown option:selected").attr("data-index");
  let subjectData = [];
  let subjectsItems = $(".subjects").children();
  if (format == "UT") {
    for (let i = 0; i < subjectsItems.length; i++) {
      const element = subjectsItems[i];
      subjectData.push({
        SUBJECT: $(element).find(`select[name="subName"] option:selected`).val(),
        SCORE: $(element).find(`input[name="marks"]`).val(),
      });
    }
  }
  $.ajax({
    method: "POST",
    url: "/teach/addMarksheet/",
    data: {
      head: head,
      index: index,
      subject: JSON.stringify(subjectData),
      admnNo: admnNo,
      grade: grade,
      format: format,
      csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
    },
    success: () => {
      $(".submit-marksheet-cr").text("Created, Redirecting...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    error: () => {
      $(".submit-marksheet-cr").text("Something went wrong! Try again later.");
      setTimeout(() => {
        $(".submit-marksheet-cr").text("Submit");
      }, 2000);
    },
  });
  console.log(subjectData);
});
