var articlelist = document.getElementById('articlelist');
var addItemButton = document.getElementById('addItem');
var reportURLButton = document.getElementById('reportURL');

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
    let articles = db.createObjectStore('articles', {keyPath: 'id', autoIncrement:true});
}

request.onsuccess = function(event) {
    db = event.target.result;
    var tx = db.transaction("articles", "readwrite");
    var store = tx.objectStore("articles");

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

function updateGUIForArticle(i, item, articleId, article) {
    if(i != 0) {
        var sep = document.createElement('li');
        sep.setAttribute('role', 'separator');
        sep.className = 'list-divider';
        articlelist.appendChild(sep);
    }
    var a = document.importNode(item, true);
    a.id = 'article_' + articleId;
    a.getElementsByTagName("img")[0].src = article.img;
    a.getElementsByTagName("span")[2].innerHTML = 
      '<a target="_blank" href="' + article.url + '">' + article.title + "</a>";
    a.getElementsByTagName("span")[3].textContent = article.desc;
    a.getElementsByTagName("button")[0].dataset.articleId = articleId;
    a.getElementsByTagName("button")[0].onclick = function(e) { deleteArticle(e) };
    articlelist.appendChild(a);
}

function loadList() {
    var tx = db.transaction("articles", "readwrite");
    var store = tx.objectStore("articles");

    var request = store.getAllKeys();
    request.onsuccess = async function(event) {
        var temp, i;
        temp = document.getElementsByTagName("template")[0];
        item = temp.content.querySelector("li");
        
        var articles = event.target.result;
        
        if (articles.length > 0) {
            articlelist.innerHTML = '';
            for (i = 0; i < articles.length; i++) {  
                const articleId = articles[i];
                const rowId = i;
                var requestItem = store.get(articleId);
                           
                requestItem.onsuccess = async function(event) {
                    updateGUIForArticle(rowId, item, articleId, event.target.result);
                }
            }
        }
    }
}

function deleteArticle(e) {
    const tx = db.transaction("articles", "readwrite");
    var store = tx.objectStore("articles");

    const removeArticleId = Number(e.target.dataset.articleId);

    var removeObjectRequest = store.delete(removeArticleId);

    removeObjectRequest.onsuccess = function(event) {
        var removedElement = document.getElementById('article_' + removeArticleId);
        removedElement.style.display = 'none';        
        saveList();
    };
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

function loadUrl(inputBox) {
    fetch('fetchpage.php?url=' + encodeURI(inputBox.value))
        .then(resp => {
            return resp.json();
        })
        .then(json => {
            var tx = db.transaction("articles", "readwrite");
            var store = tx.objectStore("articles");
        
            store.add(json);

            setTimeout(function() {
                inputBox.value = '';
                loadList();
                saveList();
            }, 1000);
        });
}

function reportUrl(inputBox) {        
    fetch('report.php', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: 'id=' + getId() + '&url=' + encodeBase64(inputBox.value)
    }).catch(e => {
        console.log(e);
    });
}


function initTextField() {
    let inputEl = document.querySelector('.textfield-box input');
    let boxEl = document.querySelector('.textfield-box');

    inputEl.addEventListener('keyup', e => {
      if(e.keyCode == 13) {
          loadUrl(e.target);
      }
    });

    inputEl.addEventListener('focus', e => {
      boxEl.className = 'textfield-box box-selected';
    });

    inputEl.addEventListener('blur', e => {
      boxEl.className = 'textfield-box';
    });

    this.addEventListener('click', e => {
      inputEl.focus();
    });    
}


function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(str) {
    return decodeURIComponent(escape(atob(str)));
}

initTextField();

addItemButton.addEventListener('click', e => {
    let inputEl = document.querySelector('.textfield-box input');
    loadUrl(inputEl);
});

reportURLButton.addEventListener('click', e => {
    let inputEl = document.querySelector('.textfield-box input');
    reportUrl(inputEl);
});