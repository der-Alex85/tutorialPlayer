$(document).ready(function() {

    //save Notiz
    $('body').on('click', '#saveNotizButton', function(){
        var data = {};
        $('#meineNotiz input').each(function(index){
          data[$(this).attr('name')] = $(this).attr('value');
        });
        data['text'] = $('#meineNotiz textarea').val();
        $.post("/notiz/createNoteByPos", data, function(notiz){
          var noteHTML = $('<div class="note"><div class="date">'+notiz.createdAt+'</div>'+notiz.text+'</div>');
          $('#notes').append(noteHTML);
          $('#meineNotiz textarea').val('');
          addNotiz(notiz);
        });
    });



    //save Frage
    $('body').on('click', '#saveFrageButton', function(){
        var data = {};
        $('#meineFrage input').each(function(index){
          data[$(this).attr('name')] = $(this).attr('value');
        });
        data['text'] = $('#meineFrage textarea').val();
        
        $.post("/frage/createFrageByPos", data, function(frage){
          var frageHTML = $('<div class="frage-antwort"><div class="frage" id="'+frage.id+'"><div class="date">'+
            frage.createdAt+'</div><div class="author">'+frage.pos.user+'</div>'+frage.text+'</div><div class="antworten"></div>'+
            '<div class="meineAntwort"><form action="" method="POST">'+
            '<input type="hidden" name="user" value="">'+
            '<textarea placeholder="Geben Sie Ihre Antwort ein" style="width: 100%;" rows="2" name="antwortText"></textarea>'+
            '<input class="btn btn-success saveAntwortButton" type="button" value="Speichern"/>'+'</form></div>'+'</div>');
          $('#fragen-container').append(frageHTML);
          $('#meineFrage textarea').val('');
          addFrage(frage);
        });
        
    });


    //save Antwort
    $('body').on('click', '.saveAntwortButton', function(){
        var data = {};
        /*
        $(this).closest('.meineAntwort').find('input').each(function(index){
          data[$(this).attr('name')] = $(this).attr('value');
        });*/
        var frageId = $(this).closest('.frage-antwort').find('.frage').attr('id');
        data.frageId = frageId;
        data.user = $(this).closest('.meineAntwort').find('input[name="user"]').val();
        data.text = $(this).closest('.meineAntwort').find('textarea').val();
        $.post("/antwort/createAntwort", data, function(antwort){
          var antwortHTML = $('<div class="antwort"><div class="date">'+antwort.createdAt+'</div><div class="author">'+antwort.user+'</div>'+antwort.text+'</div>');
          $('#'+frageId).closest('.frage-antwort').find('.antworten').append(antwortHTML);
          $('#'+frageId).closest('.frage-antwort').find('.meineAntwort textarea').val('');
          addAntwort(antwort);
        });
    });


    $.indexedDB("TutorialPlayer", {
        "schema": {
            "1": function(versionTransaction){
                var student = versionTransaction.createObjectStore("Student", {                    
                    "keyPath": "id"
                });
                student.createIndex('user.email', 'mailIndex');
            },
            "2": function(versionTransaction){
                var notiz = versionTransaction.createObjectStore("Notiz", {                    
                    "keyPath": "id"
                });
                notiz.createIndex(['pos.satz','pos.indexh','pos.indexv'], 'posIndex');
                // notiz.createIndex("pos.indexh");
                // notiz.createIndex("pos.indexv");
            },
            // This was added in the next version of the site
            "3": function(versionTransaction){
                var frage = versionTransaction.createObjectStore("Frage", {
                    "keyPath": "id"
                    //"autoIncrement": true
                });
                frage.createIndex(['pos.satz','pos.indexh','pos.indexv'], 'posIndex');
                //frage.createIndex("name");
            },
            "4": function(versionTransaction){
                var antwort = versionTransaction.createObjectStore("Antwort", {
                    "keyPath": "id"
                    //"autoIncrement": true
                });
                antwort.createIndex('frage.id', 'frageIndex');
                //frage.createIndex("name");
            }
        }
    }).done(function(){
        console.log('indexedDB created!!!');
        // Once the DB is opened with the object stores set up, show data from all tables
        window.setTimeout(function(){

            readTable("Notiz");
            readTable("Frage");
        }, 200);
    });

});

function emptyDB(table){
    $.indexedDB("TutorialPlayer").objectStore(table).clear();
}

function deleteDatabase(name) {
    $.indexedDB(name).deleteDatabase();
}


function addNotiz(notiz){
    $.indexedDB("TutorialPlayer").objectStore("Notiz").add(notiz).done(function(){
        console.log('new Notiz added!');
    });
}

function addFrage(frage){
    $.indexedDB("TutorialPlayer").objectStore("Frage").add(frage).done(function(){
        console.log('new Frage added!');
    });
}

function addAntwort(antwort){
    $.indexedDB("TutorialPlayer").objectStore("Antwort").add(antwort).done(function(){
        console.log('new Antwort added!');
    });
}

function removeNotiz(itemId){
    $.indexedDB("TutorialPlayer").objectStore("Notiz")["delete"](itemId).done(function(){
        console.log('Notiz entfernt!');
    });
}

function removeFrage(itemId){
    $.indexedDB("TutorialPlayer").objectStore("Frage")["delete"](itemId).done(function(){
        console.log('Frage entfernt!');
    });
}

function removeAntwort(itemId){
    $.indexedDB("TutorialPlayer").objectStore("Antwort")["delete"](itemId).done(function(){
        console.log('Antwort entfernt!');
    });
}



function readTable(table) {
    $.indexedDB("TutorialPlayer").objectStore(table).each(function(elem){
        //console.log(table + ': ' + elem.key + ' | ' +JSON.stringify(elem.value));
    });
}

function initNotizenFromTable(satz, h, v) {
    $('#notes').empty();

    //ToDo: herausfinden wie man über index sucht!!!!!
    // workaround for searching in index
    $.indexedDB("TutorialPlayer").objectStore("Notiz").index('posIndex').each(function(elem){
        if(elem.key[0] == satz && elem.key[1] == h && elem.key[2] == v) {
            var noteHtml = $('<div class="note"><div class="date">'+elem.value.createdAt+'</div>'+elem.value.text+'</div>')
            $('#notes').append(noteHtml);
        }
    });

}

function initFragenFromTable(satz, h, v) {
    $('#fragen-container').empty();

    var userId = $('.view-container').attr('user');
    //ToDo: herausfinden wie man über index sucht!!!!!
    // workaround for searching in index
    $.indexedDB("TutorialPlayer").objectStore("Frage").index('posIndex').each(function(elem){
        if(elem.key[0] == satz && elem.key[1] == h && elem.key[2] == v) {
            var frageId = elem.value.id;
            var frageHTML = $('<div class="frage-antwort"><div class="frage" id="'+frageId+'"><div class="date">'+
                elem.value.createdAt+'</div><div class="author">'+elem.value.pos.user+'</div>'+elem.value.text+'</div>'+
                '<div class="antworten">'+                
                '</div>'+
                '<div class="meineAntwort"><form action="" method="POST">'+
                '<input type="hidden" name="user" value="'+userId+'">'+
                '<textarea placeholder="Geben Sie Ihre Antwort ein" style="width: 100%;" rows="2" name="antwortText"></textarea>'+
                '<input class="btn btn-success saveAntwortButton" type="button" value="Speichern"/>'+'</form></div>'+'</div>');
            $('#fragen-container').append(frageHTML);


            $.indexedDB("TutorialPlayer").objectStore("Antwort").index('frageIndex').each(function(elem){
                if(elem.key == frageId) {
                    var antwortHTML = $('<div class="antwort"><div class="date">'+elem.value.createdAt+'</div><div class="author">'+elem.value.user+
                        '</div>'+elem.value.text+'</div>');
                    $('#'+frageId).closest('.frage-antwort').find('.antworten').append(antwortHTML);
                }
            });

        }
    });

}

