(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{19:function(e,t,n){e.exports=n(32)},25:function(e,t,n){},32:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(5),o=n.n(s),c=(n(25),n(16)),i=n(1),u=n.n(i),l=n(4),h=n(10),m=n(11),p=n(15),g=n(12),d=n(17),f=n(2),v=n(3);function E(){var e=Object(f.a)([""]);return E=function(){return e},e}var b=v.a.div(E()),w=function(e){return r.a.createElement(b,null,r.a.createElement("h2",null,"Highscores"),e.highscores&&e.highscores.map(function(e,t){return r.a.createElement("div",{key:t},e.player_name," - ",e.score)}))};function S(){var e=Object(f.a)(["\n  text-align: center;\n"]);return S=function(){return e},e}function k(){var e=Object(f.a)(["\n  position: absolute;\n  bottom: 5%;\n  margin: auto;\n  width: 100%;\n"]);return k=function(){return e},e}function y(){var e=Object(f.a)(["\n  display: absolute;\n  align-content: center;\n  max-width: 600px;\n  width: 90vw;\n  height: 70vh;\n  transform: translateY(15%);\n  margin: auto;\n  border: solid 1px #cccccc;\n\n  div {\n    margin: auto;\n    padding: 5px;\n    text-align: center;\n  }\n\n  input,\n  button {\n    font-family: inherit;\n    font-size: 1em;\n  }\n"]);return y=function(){return e},e}var j=v.a.div(y()),x=v.a.div(k()),O=v.a.h1(S()),_=function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(p.a)(this,Object(g.a)(t).call(this,e))).startGame=Object(l.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Starting new game"),n.setState({showScores:!1}),e.next=4,fetch(n.base_url+"new",{method:"POST"}).then(function(e){return e.json()}).then(function(e){n.setState(e)});case 4:case"end":return e.stop()}},e)})),n.loadHighscores=Object(l.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Loading highscores"),e.next=3,fetch(n.base_url+"highscores").then(function(e){return e.json()}).then(function(e){n.setState({highscores:e}),console.log("Highscores:",e)});case 3:case"end":return e.stop()}},e)})),n.postHighscore=Object(l.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Posting highscore"),e.next=3,fetch(n.base_url+"highscore",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({player_name:n.state.player_name})}).then(function(e){return e.json()}).then(function(e){n.setState({highscores:e,showScores:!0,postHighscore:!1,showRegisterScore:!1}),document.addEventListener("keyup",n.checkInput)});case 3:case"end":return e.stop()}},e)})),n.checkInput=function(){var e=Object(l.a)(u.a.mark(function e(t){var a;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=t.key,console.log(a),!a.match(/[ ]/gi)){e.next=5;break}return n.startGame(),e.abrupt("return");case 5:if("ACTIVE"===n.state.status){e.next=7;break}return e.abrupt("return");case 7:if("ACTIVE"!==n.state.status||"Escape"!==a){e.next=10;break}return n.startGame(),e.abrupt("return");case 10:if(!a.match(/[a-z0-9]/gi)){e.next=17;break}return n.setState(Object(c.a)({},n.state,{status:"PENDING",game_hint:"Checking..."})),e.next=15,fetch(n.base_url+"guess/"+a,{method:"POST"}).then(function(e){return e.json()}).then(function(e){n.setState(e),console.log(n.state),"GAME_OVER"===e.status||"FINISHED"===e.status?(n.setState({showScores:!0}),console.log(n.state)):"HIGHSCORE"===e.status&&(document.removeEventListener("keyup",n.checkInput),n.setState({showRegisterScore:!0}))});case 15:e.next=19;break;case 17:n.setState({game_hint:"Press key a-z or 0-9"}),console.log("invalid key",a);case 19:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.loadStatus=Object(l.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Loading status data"),e.next=3,fetch(n.base_url+"status",{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then(function(e){return e.json()}).then(function(e){console.log("Json data ",e),n.setState(e)});case 3:case"end":return e.stop()}},e)})),n.componentWillMount=function(){n.loadStatus(),n.loadHighscores()},n.handlePlayerNameChange=function(e){console.log("Key",e.key),"Enter"===e.key&&n.postHighscore(),n.setState({player_name:e.target.value})},n.state={game_hint:"Press spacebar to start new game",showScores:!1,showRegisterScore:!1,player_name:""},document.addEventListener("keyup",n.checkInput),n.base_url="/",n}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.state.guessed_chars?5-this.state.guessed_chars.length:5;return r.a.createElement(j,null,r.a.createElement(O,null,"Hangman"),("ACTIVE"===this.state.status||"PENDING"===this.state.status)&&r.a.createElement("div",null,r.a.createElement("h1",null,this.state.guess_result),r.a.createElement("div",null,"Guesses left: ",e),r.a.createElement("div",null,r.a.createElement("p",null,"Tried characters:"),r.a.createElement("p",null,this.state.guessed_chars))),"GAME_OVER"===this.state.status&&r.a.createElement("div",null,r.a.createElement("p",null,"Game over"),r.a.createElement("h1",null,":(")),this.state.showScores&&r.a.createElement(w,{highscores:this.state.highscores}),this.state.showRegisterScore&&r.a.createElement("div",null,r.a.createElement("h2",null,"New highscore!"),r.a.createElement("div",null,"Score: ",this.state.score),r.a.createElement("input",{id:"playerName",type:"text",value:this.state.player_name,onChange:this.handlePlayerNameChange,autoFocus:!0,placeholder:"Enter your name"}),r.a.createElement("button",{onClick:this.postHighscore},"Send")),"FINISHED"===this.state.status&&r.a.createElement("div",null,"Game score: ",this.state.score),r.a.createElement(x,{onClick:this.startGame,autoFocus:!0},this.state.game_hint))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[19,1,2]]]);
//# sourceMappingURL=main.e47d4f5d.chunk.js.map