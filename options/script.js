let textbox = document.createElement("p")
textbox.style.cssText = "color:red;font-width:600;font-size:1.8rem;"
document.getElementById("api").addEventListener("input", function(){
    textbox.innerHTML = document.getElementById("api").value
    chrome.storage.local.set({ 'api_key': document.getElementById("api").value });
});
document.body.insertBefore(textbox,null)