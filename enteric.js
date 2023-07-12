const $ = str => document.querySelector(str);
const $$ = str => document.querySelectorAll(str);

(function() {
const app = {
    config: {
        apikey: "8ab04dc41aad7d43deffb0e2ba49b690",
        apiurl: "https://ws.audioscrobbler.com/2.0/?"
    },
    init: function() {
        app.state.loaded = true;
        $("button#lookup").addEventListener("click", app.lookup);
        
        fetch("lastfm.json").then(response=>response.json()).then(data=>{
            console.dir(data);
            app.data.api = data.api;
            $("#type").innerHTML = app.makeOptions(data.api);
            $("#action").innerHTML = app.makeOptions(data.api.album);
            app.updateAction("album", "getInfo");
            app.updateForm('album', 'getInfo');
        });
    },
    makeOptions: function(data) {
        if (data) {
            console.dir(data);
            let keys = Object.keys(data);

            let opts = '';
            keys.forEach(key=>{
                opts += `<option value='${key}'>${key.replace(/([A-Z])/g, ' $1').replace(/^([a-z])/, (match, p1)=>p1.toUpperCase()) }</option>`;
            });
            return opts;
        }
    },
    updateAction: function(who, action="getInfo") {
        if (!action) {
            action = Object.keys(app.data.api[who])[0];
        }
        if (app.data.api[who]) {
            $("#action").innerHTML = app.makeOptions(app.data.api[who]);
            $("#action").selectedIndex = 0;
        
        }
        return false;
    },
    getType: function() { return $("#type").options[$("#type").selectedIndex].value; },
    getAction: function() { return $("#action").options[$("#action").selectedIndex].value; },
    updateAll: function() {
        let type = app.getType();
        let action = app.getAction();
        app.updateAction(type, action);
        app.updateForm(type, action);
    },
    updateForm: function(who, action) {
        let out = '', opt = '';
        who = who ? who : app.getType();
        action = action ? action : app.getAction();
        
        let keys = Object.keys(app.data.api[who][action]);
        let req;
        console.log(`updating form for ${who}=>${action}`);
        keys.forEach(key=>{
            req = "Lame"; //(app.data.api[who][action][key] == "0") ? 'Optional' : 'Required';

            if (app.data.api[who][action][key] == "0") {
                req = 'Optional';
                opt += `<div class='item'><label for='${key}'>${key}</label><input type='text' id='${key}' name='${key}' value='' placeholder="${req}"></div>`;
            } else {
                req = 'Required';
                out += `<div class='item'><label for='${key}'>${key}</label><input type='text' id='${key}' name='${key}' value='' placeholder="${req}"></div>`;
            }
        });
        $("#searchterms").innerHTML = out;
        $("#optional").innerHTML = opt;
        return true;
    },
    togglePanel: function(panel) {
       panel.classList.toggle("closed");
       return false;
    },
    lookup: function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        let method = app.getType().toLowerCase() + '.' + app.getAction().toLowerCase();
        let vals = { api_key: "8ab04dc41aad7d43deffb0e2ba49b690", format: "json", method: method  };

        $$("input").forEach((item, idx) => {
            if (item.value) {
                vals[item.id] = item.value;
            }
        });

        let query = '';
        for (const [key, val] of Object.entries(vals)) {
            query += key + '=' + val + '&';
        }
        query = query.slice(0, -1);

        let url = app.config.apiurl + query;
        console.log(`request url: ${url}`);

        let results, out = '';
        fetch(url).then(res=>res.json()).then(data=> {
            console.dir(data);
            let out = '';
            let top = Object.keys(data)[0];
            console.log(`top result wrapper: ${top}`);
            if (data && data[top]) {
                let obj = data[top];

                if (obj['image']) {
                    out += `<img src='${obj.image[obj.image.length-1]["#text"]}'>`;
                }
                if (obj['bio']) {
                    out += "<p>" + obj.bio.content + "</p>";
                }
                if (obj['wiki']) {
                    out += `<p>${obj.wiki.content}</p>`;
                }

                if (obj['album']) {
                    let album = '';
                    out += "<div class='albums'>";
                    for (let i=0; i< obj.album.length; i++) {
                        album = obj.album[i];

                        out += `<div class='album'><img class='albumImage' src='${album.image[album.image.length-1]['#text']}' height='150' width='150'><div class='title'>${album.artist.name}<br>${album.name}</div></div>`;
                    }
                    out += "</div>";
                }

                if (obj['artist']) {
                    let artist = '';
                    out += "<div class='artists'>";
                    for (let i=0; i< obj.artist.length; i++) {
                        artist = obj.artist[i];
console.dir(artist);
                        out += `<div class='artist'><img class='artistImage' src='${artist.image[artist.image.length-1]['#text']}' height='150' width='150'><div class='title'>${artist.name}</div></div>`;
                    }
                    out += "</div>";
                }
                $("#results").innerHTML = out;
            }
            $("#json").innerHTML += JSON.stringify(data, null, 4);
        });

        return false;
    }, 
    follow: function(track, album) {
        if (track) {
            $("#track").value = track;
        }

        if (album) {
            $("#album").value = album;
        }

        app.lookup();
    },
    formatTime: function(seconds) {
        let formatted, min, sec;
        
        if (seconds) {
            min = Math.floor(seconds / 60);
            sec = seconds - (min * 60);
            if (sec < 10) {
                sec = "0" + sec;
            }
            formatted = min + ':' + sec;
        } else {
            formatted = '0:00';
        }
        return formatted;
    },
    state: {
        loaded: false
    },
    data: {
        albums: {},
        artists: {},
        tracks: {}
    }
}
window.app = app;
window.onload = app.init();
})();
