$(document).ready(function() {

    function emptyDB(table){
        $.indexedDB("TutorialPlayer").objectStore(table).clear();
    }

    function deleteDatabase(name) {
        $.indexedDB(name).deleteDatabase();
    }

    function loadTable(table) {
        $.indexedDB("TutorialPlayer").objectStore(table).each(function(elem){
            console.log(table + ': ' + elem.key + elem.value );
        });
    }

    function addNotiz(notiz){
        /*
        $.indexedDB("TutorialPlayer").objectStore("Notiz").add(notiz).done(function(){
            console.log('neue Notiz hinzugefugt!');
        });*/

        $.indexedDB("TutorialPlayer").transaction("Notiz").then(function(){
            console.log("Transaction completed, all data inserted");
        }, function(err, e){
            console.log("Transaction NOT completed", err, e);
        }, function(transaction){
            console.log('3rd function: '+JSON.stringify(notiz));
            transaction.objectStore("Notiz").add(notiz);
        });


    }

    function addFrage(frage){
        // $.indexedDB("TutorialPlayer").objectStore("Frage").add(frage).done(function(){
        //     console.log('neue Frage hinzugefugt!');
        // });

        $.indexedDB("TutorialPlayer").transaction("Frage").then(function(){
            console.log("Transaction completed, all data inserted");
        }, function(err, e){
            console.log("Transaction NOT completed", err, e);
        }, function(transaction){
            console.log('3rd function: '+JSON.stringify(frage));
            transaction.objectStore("Frage").add(frage);
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

    // deleteDatabase('TutorialPlayer');


    $.indexedDB("TutorialPlayer", {
        "schema": {
            "1": function(versionTransaction){
                var notiz = versionTransaction.createObjectStore("Notiz", {                    
                    "keyPath": "itemId"
                });
                // notiz.createIndex("name");
            },
            // This was added in the next version of the site
            "2": function(versionTransaction){
                var frage = versionTransaction.createObjectStore("Frage", {
                    "keyPath": "name"
                    //"autoIncrement": true
                });
                //frage.createIndex("name");
            }
        }
    }).done(function(){
        // Once the DB is opened with the object stores set up, show data from all tables
        window.setTimeout(function(){
            loadTable("Notiz");
            loadTable("Frage");
        }, 200);
    });



    var testNotiz = {};
    testNotiz.itemId = 200,
    testNotiz.abc = 4;
    testNotiz.name = 'Alex';
    testNotiz.text = 'ABC';
    
    var testFrage = {};
    testFrage.itemId = 333,
    testFrage.name = 'qqq';
    



    addNotiz(testNotiz);
    addFrage(testFrage);
    

});
