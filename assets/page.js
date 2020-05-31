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

    articlelist.innerHTML = '';

    var request = store.getAll();
    request.onsuccess = async function(event) {
        var newArticles = event.target.result;
        var oldArticles = await loadData();

        var articles = merge(newArticles, oldArticles);

        var tx = db.transaction("articles", "readwrite");
        var store = tx.objectStore("articles");
        var objectStoreRequest = store.clear();
        objectStoreRequest.onsuccess = function(event) {
            for (i = 0; i < articles.length; i++) {
                store.add(articles[i]);
            }    
            loadList();
        };
    }
};


async function loadData() {
    return await fetch('loaddata.php?id=' + getId())
        .then(resp => {
            return resp.json();
        });
}

function merge(listA, listB) {
    outerloop:
    for (i = 0; i < listA.length; i++) {
        for(j = 0; j < listB.length; j++) {
            if (listA[i].url == listB[j].url) {
                continue outerloop;
            }
        }
        listB.push(listA[i]); 
    }
    return listB;
}

function loadList() {
    var tx = db.transaction("articles", "readwrite");
    var store = tx.objectStore("articles");

    articlelist.innerHTML = '';

    var request = store.getAll();
    request.onsuccess = async function(event) {
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
          a.getElementsByTagName("span")[2].innerHTML = 
            '<a target="_blank" href="' + articles[i].url + '">' + articles[i].title + "</a>";
          a.getElementsByTagName("span")[3].textContent = articles[i].desc;
          a.getElementsByTagName("span")[4].dataset.articleId = i;
          a.getElementsByTagName("span")[4].onclick = function(e) { deleteArticle(e) };
          articlelist.appendChild(a);
        }
    }
}

function deleteArticle(e) {

    console.log(e.target.dataset.articleId);
} 

function getId() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        return urlParams.get('id');
    } else {
        window.location = window.location.href.split("?")[0];
    }
    return 'unknown';
}

function saveList() {
    var tx = db.transaction("articles", "readwrite");
    var store = tx.objectStore("articles");

    var request = store.getAll();
    request.onsuccess = function(event) {
        var articles = event.target.result;
        
        fetch('savedata.php', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: 'id=' + getId() + '&data=' + encodeBase64(JSON.stringify(articles))
          }).catch(e => {
              console.log(e);
          });
    }        
}

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
                loadList();
                saveList();
            }, 1000);
        });
}

document.querySelectorAll('.mdc-text-field').forEach(
    function(ele) {
        mdc.textField.MDCTextField.attachTo(ele);
    }
);


function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(str) {
    return decodeURIComponent(escape(atob(str)));
}