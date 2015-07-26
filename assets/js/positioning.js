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
    updatePosition({indexh: indeces.h, indexv: indeces.v});
  }


  function initPosition(pos) {
    window.localStorage.setItem('k-pos-' + pos.kurs, JSON.stringify({
          satz: pos.satz
    }));
    window.localStorage.setItem('s-pos-' + pos.satz, JSON.stringify({
          indexh: pos.indexh,
          indexv: pos.indexv,
          file: pos.file
    }));
  }

  function updatePosition(data) {
    var currentKurs = window.localStorage.getItem('activeKurs');
    var old_k_Pos = JSON.parse(window.localStorage.getItem('k-pos-'+currentKurs));
    if(old_k_Pos == null) {
      old_k_Pos = {};
      old_k_Pos.satz = '';
    }
    var satz = old_k_Pos.satz;
    if(data.satz != undefined) {
      kursPos = {satz: data.satz};
      window.localStorage.setItem('k-pos-'+currentKurs, JSON.stringify(kursPos));
      satz = data.satz;
    }

    var new_s_pos = {};
    var old_s_pos = JSON.parse(window.localStorage.getItem('s-pos-'+satz));

    if(old_s_pos == null) {
      old_s_pos = {};
      old_s_pos.indexh = '0';
      old_s_pos.indexv = '0';
      old_s_pos.file = '';
    }

    if(data.indexh != undefined) {
      new_s_pos.indexh = data.indexh;
    } else {
      new_s_pos.indexh = old_s_pos.indexh;
    }

    if(data.indexv != undefined) {
      new_s_pos.indexv = data.indexv;
    } else {
      new_s_pos.indexv = old_s_pos.indexv;
    }

    if(data.file != undefined) {
      new_s_pos.file = data.file;
    } else {
      new_s_pos.file = old_s_pos.file;
    }
      
    window.localStorage.setItem('s-pos-'+satz, JSON.stringify(new_s_pos));

  }

