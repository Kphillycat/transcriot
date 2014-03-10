$(document).ready(function() {

  $("li").on("click", function() {
    var $this = $(this);
    form_type = $this.attr("class").split(" ")[0];
    $("li").removeClass("active");
    $this.addClass("active");
    $(".form-div").find("form").addClass("hidden");
    $("form."+form_type).removeClass("hidden");
    console.log("I am here")
  });

});