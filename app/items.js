window.$ = window.jQuery = require('./assets/jquery-1.12.2.min.js');
const sqlite3  = require('sqlite3').verbose();
const fs       = require('fs');

function doesExist(filename) {
  try {
    fs.statSync(__dirname+ '/' + filename)
    return true
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}

var items = document.getElementById('items');
function addItem() {
    var item = $('#input-item').val();
    var db = new sqlite3.Database('notes.db');

    db.serialize(function() {
        if (!doesExist('notes.db')) {
          db.run("CREATE TABLE notes (note_name TEXT)");
        }

        var stmt = db.prepare("INSERT INTO notes VALUES (?)");
        stmt.run(item, function(err){
            if (this.changes === 1) {
                var id = this.lastID;
                var removeItem = "<span style='float:right' onclick='removeItem("+id+")'><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></span>";
                $( "#items" ).prepend( "<li class=\"list-group-item\" id='list-item-"+id+"'>" + item + removeItem + "</li>" );
            }
        });
        stmt.finalize();
      });

      db.close();

      $("#input-item").val('');
}

function loadList() {
    var db = new sqlite3.Database('notes.db');

    db.serialize(function() {

        if (!doesExist('notes.db')) {
          db.run("CREATE TABLE notes (note_name TEXT)");
        }

        db.each("SELECT rowid AS id, note_name FROM notes", function(err, row) {
            var removeItem = "<span style='float:right' onclick='removeItem("+row.id+")'><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></span>";
            $( "#items" ).prepend( "<li class=\"list-group-item\" id='list-item-"+row.id+"'>" + row.note_name + removeItem + "</li>" );
        });
      });

      db.close();
}

function removeItem(itemId) {
    var db = new sqlite3.Database('notes.db');

    db.serialize(function() {

        if (!doesExist('notes.db')) {
          db.run("CREATE TABLE notes (note_name TEXT)");
        }

        db.run("DELETE FROM notes WHERE rowid =  ?", itemId, function(err) {
            var result = this;
            if (result.changes === 1) {
                $( "#list-item-" + itemId ).remove();
            }
        });

      });

      db.close();
}

// Load current list
loadList();

$("#input-item").keyup(function(event){
    if(event.keyCode == 13){
        addItem();
    }
});
