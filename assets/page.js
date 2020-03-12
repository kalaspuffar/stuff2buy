var articlelist = document.getElementById('articlelist');

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}
var request = window.indexedDB.open("Stuff2Buy", 2);
var db;
request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
request.onupgradeneeded = function(event) {
    db = event.target.result;  
    let articles = db.createObjectStore('articles', {autoIncrement: true});
}

request.onsuccess = function(event) {
    db = event.target.result;

    var tx = db.transaction("articles", "readwrite");
    var store = tx.objectStore("articles");

    var request = store.getAll();
    request.onsuccess = function(event) {
        var temp, item, a, i;
        temp = document.getElementsByTagName("template")[0];
        item = temp.content.querySelector("li");
        var articles = event.target.result;
        for (i = 0; i < articles.length; i++) {
          if(i != 0) {
              var sep = document.createElement('li');
              sep.setAttribute('role', 'separator');
              sep.className = 'mdc-list-divider';
              articlelist.appendChild(sep);
          }
          a = document.importNode(item, true);
          a.getElementsByTagName("img")[0].src = articles[i].img;
          a.getElementsByTagName("span")[2].textContent = articles[i].title;
          a.getElementsByTagName("span")[3].textContent = articles[i].desc;
          articlelist.appendChild(a);
        }
    }   
};

/*
var urlinput = document.getElementById('urlinput');
urlinput.addEventListener('paste', (event) => {
    loadUrl(event);
});
*/

function loadUrl(e) {
    fetch('fetchpage.php?url=' + encodeURI(e.target.value))
        .then(resp => {
            return resp.json();
        })
        .then(json => {
            var tx = db.transaction("articles", "readwrite");
            var store = tx.objectStore("articles");
        
            json.url = e.target.value;
            store.add(json);

            setTimeout(function() {
                e.target.value = '';
            }, 1000);
        });
}

document.querySelectorAll('.mdc-text-field').forEach(
    function(ele) {
        mdc.textField.MDCTextField.attachTo(ele);
    }
);