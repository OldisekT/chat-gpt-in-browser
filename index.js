var OPENAI_API_KEY = "";
var sModel = "text-davinci-003";
var iMaxTokens = 1024;
var sUserId = "1";
var dTemperature = 1;



(function () {
    'use strict';
    if (OPENAI_API_KEY == "") {
        chrome.storage.local.get('api_key', function (result) {
            if (!result.api_key) {
                OPENAI_API_KEY = prompt("Please enter your API KEY");
                chrome.storage.local.set({ 'api_key': OPENAI_API_KEY });
            } else {
                OPENAI_API_KEY = result.api_key;
            }
        });
    }
    
    
    let Allstyles = document.createElement("style");
    Allstyles.innerHTML = "@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');.chatGPT{ font-family: 'Roboto', sans-serif;}.chatGPT p{margin:0}";
    document.body.appendChild(Allstyles);
    var container = document.createElement("div");
    container.classList.add("chatGPT");
    container.style.cssText = "position:fixed;top:10px;right:10px;z-index:9999; display: none;opacity:0.5";

    var txtMsg = document.createElement("textarea");
    txtMsg.setAttribute("type", "text");
    txtMsg.style.cssText = "width:150px;background-color:rgba(0,0,0);color:white";
    txtMsg.placeholder = "Input";

    var txtOutput = document.createElement("div");
    txtOutput.style.cssText = "height:200px;width:500px;background-color:rgba(0,0,0);color:white;overflow-y:scroll";
    txtOutput.scrollTop = txtOutput.scrollHeight;
    txtOutput.placeholder = "Output";

    var btn = document.createElement("BUTTON");
    var clearbtn = document.createElement("BUTTON");
    var clearbtntext = document.createTextNode("X");
    var t = document.createTextNode(">");
    btn.style.cssText = "width:30px;background-color:rgba(82,255,56,0.5);cursor:pointer";
    clearbtn.style.cssText = "width:30px;background-color:rgba(255,82,56,0.5);cursor:pointer";
    btn.appendChild(t);
    clearbtn.appendChild(clearbtntext);
    container.appendChild(txtMsg);
    container.appendChild(btn);
    container.appendChild(txtOutput);
    container.appendChild(clearbtn);
    document.body.appendChild(container);
    document.addEventListener("keydown", function (event) {
        if (event.code == "Backquote") {
            container.style.display = container.style.display === "none" ? "flex" : "none";
        }
    });

    clearbtn.addEventListener("click", function () {
        txtOutput.innerHTML = "";
    })

    btn.addEventListener("click", function () {
        var sQuestion = txtMsg.value;

        if (sQuestion == "") {
            alert("Type in your question!");
            txtMsg.focus();
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.openai.com/v1/completions", true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY);
        xhr.send(JSON.stringify({
            model: sModel,
            prompt: sQuestion,
            max_tokens: iMaxTokens,
            max_tokens: 2000,
            user: sUserId,
            temperature: dTemperature,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["#", ";"]
        }));
        xhr.onload = function () {
            if (xhr.status === 200) {
                var oJson = {};
                if (txtOutput.value != "") txtOutput.value += "\n";
                try {
                    oJson = JSON.parse(xhr.responseText);
                } catch (ex) {
                    let errorE = document.createElement("p")
                    errorE.innerHTML = "<b>Error</b>: " + ex.message;
                    errorE.style.cssText = "color:red;";
                    txtOutput.appendChild(errorE)
                }
                if (oJson.error && oJson.error.message) {
                    let errorE = document.createElement("p")
                    errorE.innerHTML = "<b>Error</b>: " + oJson.error.message;
                    errorE.style.cssText = "color:red;";
                    txtOutput.appendChild(errorE)
                } else if (oJson.choices && oJson.choices[0].text) {
                    var s = oJson.choices[0].text;
                    if (s == "") s = "No response";
                    let text = document.createElement("p")
                    text.innerHTML = "<b>Chat GPT</b>: " + s;
                    text.style.cssText = "color:aqua;";
                    txtOutput.appendChild(text)
                    txtOutput.scrollTop = txtOutput.scrollHeight;
                }
            }
        };


        let newline = document.createElement("p");
        if (txtOutput.innerHTML != "") newline.innerHTML += "<br><br>";
        txtOutput.appendChild(newline)
        let text = document.createElement("p")
        text.innerHTML = "<b>Me</b>: " + sQuestion;
        txtOutput.appendChild(text)
        txtOutput.scrollTop = txtOutput.scrollHeight;
        txtMsg.value = "";
    });
})();
