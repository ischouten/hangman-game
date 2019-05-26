(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{18:function(e,t,n){e.exports=n(31)},24:function(e,t,n){},31:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(3),c=n.n(s),o=(n(24),n(1)),i=n.n(o),u=n(2),l=n(8),h=n(9),d=n(15),p=n(10),m=n(16),f=n(11);function g(){var e=Object(f.a)(["\n\n  display: flex\n  flex-direction: column;\n  justify-content: space-between;\n  align-content: center;\n  min-width: 600px;\n  width: 50vw;\n  height: 70vh;\n  transform: translateY(15%);\n  margin: auto;\n  border: solid 1px #cccccc;\n\n  div {\n    width: 90%;\n    border: solid 1px #999999;\n    margin: auto;\n    padding: 5px;\n    text-align: center;\n  }\n\n"]);return g=function(){return e},e}var v=n(12).a.div(g()),w=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(d.a)(this,Object(p.a)(t).call(this,e))).startGame=Object(u.a)(i.a.mark(function e(){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Starting new game"),e.next=3,fetch(n.base_url+"new",{method:"POST"}).then(function(e){return e.json()}).then(function(e){n.setState(e)});case 3:case"end":return e.stop()}},e)})),n.checkInput=function(){var e=Object(u.a)(i.a.mark(function e(t){var a;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(a=t.key).match(/[ ]/gi)){e.next=4;break}return n.startGame(),e.abrupt("return");case 4:if("ACTIVE"===n.state.status){e.next=6;break}return e.abrupt("return");case 6:if(!a.match(/[a-z0-9]/gi)){e.next=12;break}return e.next=10,fetch(n.base_url+"guess/"+a,{method:"POST"}).then(function(e){return e.json()}).then(function(e){return n.setState(e)});case 10:e.next=14;break;case 12:n.setState({game_hint:"Press key a-z or 0-9"}),console.log("invalid key",a);case 14:console.log("Current game state:",n.state);case 15:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.checkStatus=Object(u.a)(i.a.mark(function e(){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Loading status data"),e.next=3,fetch(n.base_url+"status",{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then(function(e){return e.json()}).then(function(e){console.log("Json data ",e),n.setState(e)});case 3:case"end":return e.stop()}},e)})),n.finishGame=Object(u.a)(i.a.mark(function e(){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:document.removeEventListener("keyup",n.checkInput);case 1:case"end":return e.stop()}},e)})),n.state={game_hint:"Press spacebar to start"},document.addEventListener("keyup",n.checkInput),n.base_url="/",n}return Object(m.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this.state.guessed_chars?5-this.state.guessed_chars.length:5;return r.a.createElement(v,null,r.a.createElement("div",null,"Result: ",this.state.guess_result),r.a.createElement("div",null,this.state.game_hint),r.a.createElement("div",null,r.a.createElement("p",null,"Tried characters:"),r.a.createElement("p",null,this.state.guessed_chars)),r.a.createElement("div",null,r.a.createElement("p",null,"Game status:"),r.a.createElement("p",null,this.state.status)),("FINISHED"===this.state.status||"HIGHSCORE"===this.state.status)&&r.a.createElement("div",null,"Game score: ",this.state.score),r.a.createElement("div",null,"Guesses left: ",e))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[18,1,2]]]);
//# sourceMappingURL=main.d405c649.chunk.js.map