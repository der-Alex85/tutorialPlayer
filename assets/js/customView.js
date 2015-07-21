$(document).ready(function() {


  var globObj = {
    windowName: ""
  };

  var kursData = {};


  $('.thumbnail').click(function(){

    var windowName = $(this).attr('win');

    $('#fullscreen').animate({width: '100%', height: '100%', top: '0', left: '0'});
    $('#close-fullscreen').css("display","block");

    $('#fullscreen #fullscreen-header').toggleClass("myHidden");
    $('#fullscreen #fullscreen-content').toggleClass("myHidden");


    if(windowName != globObj.windowName) {
      $("#fullscreen #fullscreen-content").empty();

      var obj = {};
      var params = {'kurs': ''};

      if (windowName == "a") {

        $('body').append($('<script id="step-template" type="x-handlebars-template"><div id="{{id}}" class="{{class}}"{{#step data}}{{uri}}{{/step}}>{{{file}}}</div></script>'));

        $( '#fullscreen-content' ).append(
          JST['assets/templates/folienTemplate.ejs']( kursData )
        );


        /* Request for impress slides */
        /*
         $.post("/foliensatz/getStepList", function(steps){
         appendSlides(steps);
         impress().init();
         impressConsole().init();
         }, "json");
         */

        /* Request for reveal slides */
        var currentKurs = window.localStorage.getItem('activeKurs');
        var pos = JSON.parse(window.localStorage.getItem('pos-'+currentKurs));

        var file = pos.file;
        if(file == "") {
          file = kursData.folien[0].file;
        }
        var data = {kurs: currentKurs, file: file};

        $.post("/foliensatz/getRevealSlides", data, function(steps){
          $( 'div.reveal>div.slides' ).append(steps);
          Reveal.initialize({
            center: true,
            // rtl: true,
            width: 1000,
            height: 500,
            transition: 'linear',
            // transitionSpeed: 'slow',
            // backgroundTransition: 'slide'

          });

        }, "html");



      } else if(windowName == "b"){
        $( '#fullscreen-content' ).append(
          JST['assets/templates/videoTemplate.ejs']( obj )
        );
      } else if(windowName == "c"){
        $( '#fullscreen-content' ).append(
          JST['assets/templates/quizTemplate.ejs']( obj )
        );
      } else if(windowName == "d"){
        $( '#fullscreen-content' ).append(
          JST['assets/templates/fragenTemplate.ejs']( obj )
        );
      } else if(windowName == "e"){
        $( '#fullscreen-content' ).append(
          JST['assets/templates/materialTemplate.ejs']( obj )
        );
      } else if(windowName == "f"){
        $( '#fullscreen-content' ).append(
          JST['assets/templates/infoTemplate.ejs']( obj )
        );
      }

      globObj.windowName = windowName;

    }
  });

  $("#close-fullscreen").click(function(){
    console.log("click");
    $(this).css("display","none");
    $('#fullscreen').animate({width: '0', height: '0', top: '50%', left: '50%'});

    $('#fullscreen #fullscreen-header').toggleClass("myHidden");
    $('#fullscreen #fullscreen-content').toggleClass("myHidden");
  });



















  // Check if a new cache is available on page load.
  window.addEventListener('load', function(e) {

    window.applicationCache.addEventListener('updateready', function(e) {
      if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        // Swap it in and reload the page to get the new hotness.
        window.applicationCache.swapCache();
        if (confirm('A new version of this site is available. Load it?')) {
          window.location.reload();
        }
      } else {
        // Manifest didn't changed. Nothing new to server.
      }
    }, false);

  }, false);



  // fetch user positions from db:
  var userId = $('.view-container').attr('user');
  if(userId != undefined) {
    $.post('/pos/getPosByUser', {id: userId}, function (data) {
      for (pos in data) {
        // init in localStorage
        window.localStorage.setItem('pos-' + data[pos].kurs, JSON.stringify({
          satz: data[pos].satz,
          folie: data[pos].folie
        }));
      }
    });
  }

  var listItems = $('.kursliste .kursItem');
	$.each(listItems, function(index, value) {
    var ident = $(this).attr('ident');

		$(value).click(function(){

			var params = {'kurs': ident};
			window.localStorage.setItem("activeKurs", ident);

      var kursPos = window.localStorage.getItem('pos-'+ident);
      if(kursPos == undefined) {
        //var pos = {};
        //pos.satz = "";
        //pos.folie = "";
        //pos.file = "";
        updatePosition({});
      }

			//$.post('/session/sessionstore', params, function(r){  });

      var localPos = JSON.parse(window.localStorage.getItem('pos-'+ident));

			$.post('/vorlesung/getKursData', {id: ident}, function(data) {
				var saetze = data.folien;
				var listItem;
        kursData = data;


				$('#side-nav ul').empty();
				for (var foliensatz in saetze) {

					listItem = $('<li role="presentation" ident='+saetze[foliensatz].id+' file='+saetze[foliensatz].file+'><a href="#"> '+ saetze[foliensatz].title +'</a></li>');
          if (localPos != null && saetze[foliensatz].id == localPos.satz) {
            listItem.attr('class', 'active');
            localPos.file = saetze[foliensatz].file;
          }
					$('#side-nav ul').append(listItem);
				}
        window.localStorage.setItem('pos-'+ident, JSON.stringify(localPos));
			});


      if(localPos != null) {
        // fetch Notizen
        $.post('/notiz/getNotesByVorlSatz', {kurs: ident, satz: localPos.satz}, function (notizen) {
          for (var notiz in notizen) {
            // todo here
          }
        });
      }

			// change View
			$('.view-container').toggleClass("view-change");
		});
	});



  // toggle li class=active
  $('#side-nav').on("click", "li", function() {
    $(this).closest('ul').find('li[class=active]').toggleClass('active');
    $(this).attr('class', 'active');

    var newPos = {satz: $(this).attr('ident'), file: $(this).attr('file')};
    updatePosition(newPos);

  });


	$('.back-button').click(function(){
		$('.view-container').toggleClass("view-change");
	});


	// positioning
	//var userId = $('.view-container').attr('user');
	//if( userId != undefined) {
	//	$.post('/pos/getPosByUser',{id: userId}, function(data) {
	//		for(pos in data) {
	//			window.localStorage.setItem('pos-'+data[pos].kurs, JSON.stringify({satz: data[pos].satz, folie: data[pos].folie}));
	//		}
	//	});
	//}


// =====================================

// moved to top

  // ====================================



  $(".removefoliensatz").click(function(e){
    e.preventDefault();
    var item = $(this).parent();
    var data = {};
    data.satzId = $(this).attr('ident');
    data.kursId = $(this).closest('tr').attr('ident');

    $.post("/foliensatz/destroy", data, function(success){
      item.remove();
    });
  });


  $(".userClickable").click(function(){
    $.get("/user/getUserData/"+$(this).attr('ident'), function(user){
      fillUserModal(user);
      $("#userModal").modal('show');
    });
  });

  $(".kursClickable").click(function(){
    $.post("/vorlesung/getKursData/"+$(this).attr('ident'), function(kurs){
      fillKursModal(kurs);
      $("#vorlesungModal").modal('show');
    });
  });

  $("#addProf").click(function(){
    $.post("/prof/getModel", function(model){
      createEmptyPrototype(model);
      $("#profModal").modal('show');
    });
  });
  $("#addStudent").click(function(){
    $.post("/student/getModel", function(model){
      createEmptyPrototype(model);
      $("#studentModal").modal('show');
    });
  });
  $("#addVorlesung").click(function(e) {
    e.preventDefault();
    $.post("/vorlesung/getModel", function(model){
      createEmptyPrototype(model);
      $("#vorlesungModal").modal('show');
    });
  });

  //foliensatz hinzufügen
  $(".addFoliensatzToLecture").click(function(e) {
    e.preventDefault();
    //var kursId = $(this).attr('kursident');
    var vorlesungId = $(this).attr('kursIdent');
    if(vorlesungId != undefined) {
      $.get("/foliensatz/getModel", function(model){
        model['parent'] = vorlesungId;
        createEmptyPrototype(model);
        $("#foliensatzModal").modal('show');

      });
    }

  });

  //student hinzufügen
  $(".addStudentToLecture").click(function(e) {
    e.preventDefault();
    var kursId = $(this).attr('kursident');

    $.get("/student/findStudentsForLecture/"+kursId, function(studentList) {

      initStudentList(studentList);

      $('#studentSelect').multiselect({
        buttonWidth: '100%', maxHeight: 400,
        onChange: function(option, checked, select) {
          var ident = option.attr('ident');
          if (checked == true) {
            $.post('/vorlesung/addStudent',{data: {kurs: kursId, student: ident}}, function(r){
              $('#notinLecture > option[ident='+ident+']').appendTo('#inLecture');
              $("#studentSelect").multiselect( 'rebuild' );
            });
          }
          else {
            $.post('/vorlesung/removeStudent',{data: {kurs: kursId, student: ident}}, function(r){
              $('#inLecture > option[ident='+ident+']').appendTo('#notinLecture');
              $("#studentSelect").multiselect( 'rebuild' );
            });
          }


        },
        nonSelectedText: 'Auswählen!',
        enableFiltering: true
      });

      $("#studentSelect").multiselect( 'refresh' );
      $("#studentsModal").modal('show');

    });

  });




  function initStudentList(studentList) {
    $('#studentSelect').empty();

    var inLecture = studentList.inLecture;
    var notinLecture = studentList.notinLecture;
    var inGroup = $('<optgroup id="inLecture" label="Teilnehmer"></optgroup>');
    $('#studentsModal select').append(inGroup);
    console.log("in");
    for(var stud in inLecture) {
      console.log(inLecture[stud]);
      var option = $('<option selected ident='+inLecture[stud].id+'>'+inLecture[stud].vorname +' '+ inLecture[stud].name+' ('+inLecture[stud].matrikel+')</option>');
      $('#studentsModal select optgroup#inLecture').append(option);
    }

    var notinGroup = $('<optgroup id="notinLecture" label="Studenten"></optgroup>');
    $('#studentsModal select').append(notinGroup);
    console.log("out");
    for(var stud in notinLecture) {
      console.log(notinLecture[stud]);
      var option = $('<option ident='+notinLecture[stud].id+'>'+notinLecture[stud].vorname +' '+ notinLecture[stud].name+' ('+notinLecture[stud].matrikel+')</option>');
      $('#studentsModal select optgroup#notinLecture').append(option);
    }

  }

  function fillUserModal(user) {
    $('#modalFields').empty();
    var data = {};
    if (user.prof) {
      data = user.prof;
      $('#userModal form').attr('action', '/prof/update/'+data.id);
    } else if (user.student) {
      data = user.student;
      $('#userModal form').attr('action', '/student/update/'+data.id);
    }
    var input = $('<input type="hidden" name="id"></input>').attr('value',data.id);
    $('#modalFields').append(input);

    for(var key in data){
      if (key == 'id' || key == 'user') continue;
      var label = $('<label></label>').append(String.fromCharCode(key.charCodeAt(0)).toUpperCase()+key.substring(1));
      var input = $('<input type="text" class="form-control"></input>').attr('value',data[key]).attr('name',key);
      $('#modalFields').append(label);
      $('#modalFields').append(input);
    }

    input = $('<input type="checkbox" name="isAdmin"> Admin</input>');
    if(user.isadmin) input.attr('checked','');
    $('#modalFields').append(input);
  }

  function createEmptyPrototype(model) {
    var type = model.type;
    var attributes = model.data;
    var selector = '#'+type+'Modal .modalFields';
    $(selector).empty();


    for(var name in attributes){

      //if (name == 'id' || name=='user') continue;

      if (name == 'kursleiter' && attributes[name].model && attributes[name].model == 'prof') {
        var label = $('<label></label>').append(String.fromCharCode(name.charCodeAt(0)).toUpperCase()+name.substring(1));
        $.get("/prof/getProfDataAll", function(kursleiter){

          var input = $('<select class="form-control" name="kursleiter"><option/></select>');

          for (var prof in kursleiter) {
            input.append(
              $('<option value='+kursleiter[prof].id+'>'
                +kursleiter[prof].titel+' '
                +kursleiter[prof].vorname+' '
                +kursleiter[prof].name+'</option>'));
          }

          var parent = $('<div class="form-group"></div>');
          parent.append(label);
          parent.append(input);
          $(selector).append(parent);
        });
      } else if (attributes[name].type == 'string' || attributes[name].type == 'email' || attributes[name].type == 'integer') {  // == 'string' || attributes[name].type == 'email'){

        if (name == 'file' && type == 'foliensatz') {
          input = $('<input type="hidden" class="form-control"></input>').attr('value','').attr('name',name);
        } else {
          var label = $('<label></label>').append(String.fromCharCode(name.charCodeAt(0)).toUpperCase()+name.substring(1));
          var input;
          $(selector).append(label);
          if(name == 'password' || name == 'confirmation'){
            input = $('<input type="password" class="form-control"></input>').attr('value','').attr('name',name);
          } else {
            input = $('<input type="text" class="form-control"></input>').attr('value','').attr('name',name);
          }
        }

        $(selector).append(input);
      }

    }

    if (type == 'prof') {
      data = model.prof;
      $('#profModal form').attr('action', '/prof/create');
    } else if (type == 'student') {
      data = model.student;
      $('#studentModal form').attr('action', '/student/create');
    } else if (type == 'vorlesung') {
      data = model.vorlesung;
      $('#vorlesungModal form').attr('action', '/vorlesung/create');
    } else if (type == 'foliensatz') {
      //data = model.foliensatz;

      input = $('<input type="hidden" class="form-control"></input>').attr('value',model.parent).attr('name','vorlesung');
      $(selector).append(input);
      $('#foliensatzModal form').attr('action', '/foliensatz/create');
    }

  }







});
