jQuery(document).ready(function($) {

  var fm = {

    init: function() {

      fm.numImages = 2;
      fm.imgIndex = 0;
      fm.canvas = $('canvas.canvas')[0]
      fm.ctx = fm.canvas.getContext('2d');
      fm.canvas.width = $(window).width();
      fm.canvas.height = $(window).height();
      fm.imgRatio  = fm.canvas.height/fm.canvas.width;

    }

  };


  var img = new Image();

  img.onload = function() {
 
    fm.ctx.drawImage(img, 0, 0, fm.canvas.width, fm.canvas.width * fm.imgRatio);
 
  }

  img.src = "images/mars-rock-mimi-spirit.jpg";

  $(' .test').click(function() {

    window.navigator.vibrate([50,50,50]);

  });

  var triggerBuzz = function(e) {

    var pointer = getPointer(e);
    e.preventDefault();

    var data = fm.ctx.getImageData(pointer.x, pointer.y, 1, 1).data,
        value = data[0]; // red channel for now, for speed

    value = 255 - value; // invert; black should be "strong"
    value = Math.pow(value/30, 2); // square for contrast
    value = Math.min(value, 250); // square for contrast

    if (value > 40) window.navigator.vibrate([value]);
    else window.navigator.vibrate(0);
 
    console.log(pointer, parseInt(data[0]), parseInt(value));

  }

  $("canvas.canvas").on('touchmove', triggerBuzz);

  $("#file-select input.file").change(function(e) {

    var reader = new FileReader(),
	f = e.target.files[0];

    // Closure to capture the file information.
    reader.onload = (function(file) {

      return function(e) {

	img.src = e.target.result;

      };

    })(f);
  
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);

  });


  var getPointer = function(e) {

    var e = e.originalEvent;

    if (e.touches && (e.touches[0] || e.changedTouches[0])) {

      var touch = e.touches[0] || e.changedTouches[0];

      return { x: touch.pageX, y: touch.pageY, browser: 'not firefox' };

    } else {

      // Firefox shim for offsetX/Y:
      // from https://bug69787.bugzilla.mozilla.org/attachment.cgi?id=248546, https://bugzilla.mozilla.org/show_bug.cgi?id=69787
      var x=0, y=0, fatalerror=0, mozilla=false;
 
      if (typeof e.offsetX != 'undefined' && typeof e.offsetY != 'undefined') {  // Browser provides the co-ords for us easily (zero-indexed)

        x = e.offsetX;
        y = e.offsetY;

      } else if (e.target) {    // If we have the 'target' of the (click) event - in this case, the image

        mozilla = true
        var elem = e.target;

        do {            // Calc x and y of 'target' element (ie. the image)
          x += elem.offsetLeft;
          y += elem.offsetTop;
        } while (elem = elem.offsetParent);

        x = (window.pageXOffset + e.clientX) - x;
        y = (window.pageYOffset + e.clientY) - y;

      } else {  // Fatal error trying to determine click co-ords!

        fatalerror = 1;

      }
 
      // x and y are still zero-indexed...
      if (!fatalerror) {x++; y++;}
 
      return { x: x, y: y, browser: 'firefox' };

    }

  }


  fm.init();


});
