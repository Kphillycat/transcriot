$(window).load( function() {

  var $ocrx_word = $('.ocrx_word');
  
  $('.hocr_toggle').on("click", function() {
    if($ocrx_word.hasClass('transparent')) {
      $ocrx_word.removeClass('transparent');
    }
    else {
      $ocrx_word.addClass('transparent');
    }
  });

  $ocrx_word.on("click", function(e) {
    var $this = $(this);
    $this.toggleClass('transparent');
  });

});