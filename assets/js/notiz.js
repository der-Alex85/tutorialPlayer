$(document).ready(function() {

    function emptyDB(table){
        $.indexedDB("TutorialPlayer").objectStore(table).clear();
    }

    function deleteDatabase(name) {
        $.indexedDB(name).deleteDatabase();
    }

    

    function addFrage(frage){
        $.indexedDB("TutorialPlayer").objectStore("Frage").add(frage).done(function(){
            console.log('new Frage added!');
        });

        // $.indexedDB("TutorialPlayer").transaction("Frage").then(function(){
        //     console.log("Transaction completed, all data inserted");
        // }, function(err, e){
        //     console.log("Transaction NOT completed", err, e);
        // }, function(transaction){
        //     transaction.objectStore("Frage").add(frage);
        // });
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

   


    $.indexedDB("TutorialPlayer", {
        "schema": {
            "1": function(versionTransaction){
                var notiz = versionTransaction.createObjectStore("Notiz", {                    
                    "keyPath": "id"
                });
                notiz.createIndex(['pos.satz','pos.indexh','pos.indexv'], 'posIndex');
                // notiz.createIndex("pos.indexh");
                // notiz.createIndex("pos.indexv");
            },
            // This was added in the next version of the site
            "2": function(versionTransaction){
                var frage = versionTransaction.createObjectStore("Frage", {
                    "keyPath": "id"
                    //"autoIncrement": true
                });
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


function addNotiz(notiz){
    $.indexedDB("TutorialPlayer").objectStore("Notiz").add(notiz).done(function(){
        console.log('new Notiz added!');
    });
}

function readTable(table) {
    $.indexedDB("TutorialPlayer").objectStore(table).each(function(elem){
        console.log(table + ': ' + elem.key + ' | ' +JSON.stringify(elem.value));
    });
}

function initNotesFromTable(satz, h, v) {
    console.log('s: '+satz);
    console.log('h: '+h);
    console.log('v: '+v);
    $('#notes').empty();

    //ToDo: herausfinden wie man über index sucht!!!!!
    // workaround for searching in index
    $.indexedDB("TutorialPlayer").objectStore("Notiz").index('posIndex').each(function(elem){
        if(elem.key[0] == satz && elem.key[1] == h && elem.key[2] == v) {
            var note = $('<div class="note"><div class="date">'+elem.value.createdAt+'</div>'+elem.value.text+'</div>')
            $('#notes').append(note);
        }
    });

}
