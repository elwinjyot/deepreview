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
