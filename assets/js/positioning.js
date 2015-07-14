$(document).ready(function() {

  document.addEventListener( 'keydown', updateSlidePosDelayed, false );

});


  function updateSlidePosDelayed() {
    setTimeout(updateSlidePos, 500);
  }


  function updateSlidePos() {
    var folie = $('#reveal-parent .slides section[aria-hidden!="true"][id]').attr('id');
    var newPos = {folie: folie};
    console.log(folie);
    updatePosition(newPos);
  }


  function updatePosition(data) {
    var currentKurs = window.localStorage.getItem('activeKurs');
    var oldPos = JSON.parse(window.localStorage.getItem('pos-'+currentKurs));
    if (oldPos == undefined) {
      oldPos.satz='';
      oldPos.folie='';
      oldPos.file='';
    }

    var newPos = {};

    if(data.satz != undefined) {
      newPos.satz = data.satz;
    } else {
      newPos.satz = oldPos.satz;
    }

    if(data.folie != undefined) {
      newPos.folie = data.folie;
    } else {
      newPos.folie = oldPos.folie;
    }

    if(data.file != undefined) {
      newPos.file = data.file;
    } else {
      newPos.file = oldPos.file;
    }

    window.localStorage.setItem('pos-'+currentKurs, JSON.stringify(newPos));
  }

