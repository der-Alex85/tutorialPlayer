$(document).ready(function() {


  document.addEventListener( 'slidechanged', updateSlidePosDelayed, false );

});

  function updateSlidePosDelayed() {
    setTimeout(updateSlidePos, 500);
  }


  function updateSlidePos() {
    //var folie = $('#reveal-parent .slides section[aria-hidden!="true"][id]').attr('id');
    //var newPos = {folie: folie};

    //fetch indexh and indexv
    var indeces = Reveal.getIndices();

    console.log(JSON.stringify(indeces));
    updatePosition({indexh: indeces.h, indexv: indeces.v});
  }


  function updatePosition(data) {
    var currentKurs = window.localStorage.getItem('activeKurs');
    var oldPos = JSON.parse(window.localStorage.getItem('pos-'+currentKurs));
    if (oldPos == undefined) {
      oldPos = {};
      oldPos.satz='';
      oldPos.indexh='0';
      oldPos.indexv='0';
      oldPos.file='';
    }

    var newPos = {};

    if(data.satz != undefined) {
      newPos.satz = data.satz;
    } else {
      newPos.satz = oldPos.satz;
    }

    if(data.indexh != undefined) {
      newPos.indexh = data.indexh;
    } else {
      newPos.indexh = oldPos.indexh;
    }

    if(data.indexv != undefined) {
      newPos.indexv = data.indexv;
    } else {
      newPos.indexv = oldPos.indexv;
    }

    if(data.file != undefined) {
      newPos.file = data.file;
    } else {
      newPos.file = oldPos.file;
    }

    window.localStorage.setItem('pos-'+currentKurs, JSON.stringify(newPos));
  }

