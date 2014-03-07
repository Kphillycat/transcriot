$(document).ready( function() {

  var $imgDiv = $(".transcribe-image-holder");
  var imgDivOffset = $imgDiv.offset();
  var $img = $imgDiv.find("img");
  var $highlighter = $(".highlighter");
  var boxColor = "";
  var description = "";
  var $ocrx_word = $('.ocrx_word');
  var hocrWords = prepareWordsHash();

  $ocrx_word.addClass('transparent');

  $img.on("dragstart", function() {
    return false;
  });

  function getMousePos(e) {
    var pos = {
      x: e.pageX - $imgDiv.offset().left,
      y: e.pageY - $imgDiv.offset().top
    };
    return pos;
  }

  $highlighter.on("click", function() {
    boxColor = $(this).attr("class").split(" ")[1];
    description = $(this).text().trim();
  });

  $("input").on("click", function() {
    boxColor = $(this).next("span").attr("class").split(" ")[1];
    description = $(this).next("span").text().trim();
  });

  $imgDiv.on("mousedown input:not('.overlay')", function(e) {
    var overlays = [];
    var startCoordinate = {};
    var endCoordinate = {};
    startCoordinate = getMousePos(e);
    $imgDiv.on("mousemove", function(e) {
      endCoordinate = getMousePos(e);
      $("#"+boxColor).focus();
      
      var $overlay = $("<div class='overlay' title='" + description + "'><div class='x-out hidden'><span class='x-in'>x</span></div></div>").appendTo($imgDiv);
      $(".flag").not($overlay).removeClass("flag").find(".x-out").addClass("hidden");
      $overlay.attr("id","box"+startCoordinate.y+startCoordinate.x)
              .css("top", Math.min(startCoordinate.y, endCoordinate.y))
              .css("left", Math.min(startCoordinate.x, endCoordinate.x))
              .css("height", Math.abs(endCoordinate.y - startCoordinate.y))
              .css("width", Math.abs(endCoordinate.x - startCoordinate.x))
              .addClass(boxColor)
              .addClass("flag")
              .on('click', function(e) {
                var currentClass = $(this).attr("class").split(" ")[1];
                $("#"+currentClass).focus();
                $(".flag").find(".x-out").addClass("hidden");
                $(".flag").removeClass("flag");
                $(this).addClass("flag").find(".x-out").removeClass("hidden");
              });

      if (overlays.length > 0) {overlays.pop().remove()}
      overlays.push($overlay);  
    })
    .on("mouseup", function(){  
      $(this).unbind("mousemove");
      $(".flag").find(".x-out").removeClass("hidden");
      $(".x-out").on("click", function(){
        $(this).parent().remove();
      });
      console.log("start: "+ startCoordinate.x + " end: " +endCoordinate.x);
      console.log(findWords(startCoordinate, endCoordinate));
    }); 

  });
  
  $('body').on("click", function(e){
    if(e.target.nodeName === "INPUT"){
      $(".flag").find(".x-out").addClass("hidden");
      $(".flag").removeClass("flag");
      var flagClass = e.target.id;
      $(".overlay."+flagClass).addClass("flag").find(".x-out").removeClass("hidden");
    }
    else if(e.target.className.split(' ')[0] != "overlay") {
      $('.flag').find('.x-out').addClass('hidden'); 
      $('.flag').removeClass('flag');
    }
  });

  $('.hocr_toggle').on("click", function(){
    if ($ocrx_word.hasClass('transparent')){
      $ocrx_word.removeClass('transparent');
    }else{
      $ocrx_word.addClass('transparent');
    }
  });

  $('.ocrx_word').on("click", function(e){
    var $this = $(this);
    if ($this.hasClass('transparent')){
      $this.removeClass('transparent');
    }else{
      $this.addClass('transparent');
      }
  });
  
  function prepareWordsHash(){
    var hocr_words = new Object;
    $ocrx_word.each(function(index, el){
      hocr_words[$(el).text()] = [+$(el).css("left").slice(0,-2),+$(el).css("top").slice(0,-2)];
    });
    return hocr_words;
  }

  function findWords(start, end){
    var wordsArray = [];
    jQuery.each(hocrWords, function(word, coords){
      if (coords[0] >= start.x && coords[0] <= end.x){
        if (coords[1] >= start.y && coords[1] <= end.y){
          wordsArray.push(word + " left: "+ coords[0] + " top: "+ coords[1]); 
        }
      }
    }); 
    return wordsArray;   
  }
    
});