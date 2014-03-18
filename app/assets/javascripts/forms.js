$(document).ready(function() {

  $("li").on("click", function() {
    var $this = $(this);
    form_type = $this.attr("class").split(" ")[0];
    $("li").removeClass("active");
    $this.addClass("active");
    $(".form-div").find("div").addClass("hidden");
    $("form").find("." + form_type).removeClass("hidden");
  });

});