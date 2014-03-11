$(document).ready( function() {

  var $imgDiv = $(".page-img");
  var imgDivOffset = $imgDiv.offset();
  var $img = $imgDiv.find("img");
  var $highlighter = $(".highlighter");
  var boxColor = "";
  var description = "";
  var $ocrx_word = $('.ocrx_word');

  $ocrx_word.addClass('transparent');

  $img.on("dragstart", function() {
    return false;
  });

  function getMousePos(e, $pageDiv) {
    var w = $(window);
    var pos = {
      x: e.pageX - $pageDiv.offset().left,
      y: e.pageY - $pageDiv.offset().top
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
    var $this = $(this);
    var overlays = [];
    var startCoordinate = getMousePos(e, $this);
    var endCoordinate = {};

    $this.on("mousemove", function(e) {
      endCoordinate = getMousePos(e, $this);
      $("#"+boxColor).focus();
      
      var $overlay = $("<div class='overlay' title='" + description + "'><div class='x-out hidden'><span class='x-in'>x</span></div></div>").appendTo($this);
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
      var $this = $(this);
      $this.unbind("mousemove");
      $(".flag").find(".x-out").removeClass("hidden");
      $(".x-out").on("click", function(){
        $(this).parent().remove();
      });
      var pageClass = $this.attr("class").split(" ")[1];
      var hocrWords = prepareWords(pageClass);
      var $inputField = $("#"+boxColor);
      var words = findWords(startCoordinate, endCoordinate, hocrWords);
      console.log(words + " a word");

      if($inputField.attr("type") == "number"){
        words = +/\d+,?\d+\s\d{2}/.exec(words)[0].replace(",","").replace(" ",".");
      } else if($inputField.attr("type") == "date") {
        var date = new Date(/.*\d{4}/.exec(words)[0]);
        words = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
      }
      if(words){
        $inputField.val(words);
      }
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

  $ocrx_word.on("click", function(e){
    var $this = $(this);
    if ($this.hasClass('transparent')){
      $this.removeClass('transparent');
    }else{
      $this.addClass('transparent');
      }
  });
  
  function prepareWords(className){
    var prepWords = [];
    $("." + className).find(".ocrx_word").each(function(index, el){
      prepWords.push([+$(el).css("left").slice(0,-2),+$(el).css("top").slice(0,-2), $(el).text()]);
    });
    return prepWords;
  }

  function findWords(start, end, wordsSet){
    var wordsArray = [];
    $.each(wordsSet, function(index, infoArray){
      if (infoArray[0] > end.x) return wordsArray;
      if (infoArray[0] >= start.x && infoArray[0] <= end.x){
        if (infoArray[1] >= start.y && infoArray[1] <= end.y){
          wordsArray.push(infoArray[2]); 
        }
      }
    }); 
    return wordsArray.join(" ");   
  }
    
});