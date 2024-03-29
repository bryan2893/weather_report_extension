document.addEventListener('DOMContentLoaded', function(){

    let request = new Request('http://things.ubidots.com/api/v1.6/datasources/', {
        method: 'GET',
        headers: new Headers({
            'X-Auth-Token':'A1E-THAbwBpux0ZtQWpt8Rbr16i1jXhOk6cwJGQGjhZzyofVrdd7IGYVi6Vv',
            'Content-Type': 'application/json'
        })
    });

    let urlToHtmlExcelPainted = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMUCyMmuAMSrvhxDIbede2LN9N7HDkvaESICz7FZhlD3aAzOg3hXta7FaaHjyJSySsBpC7_m3ucJgc/pubhtml";
    let pTagError = document.querySelector('p');
    let textArea = document.getElementById("displayer");

    function fillTextArea(content){
        textArea.value = content;
    }

    function cleanTextArea(){
        textArea.value = "";
    }

    function showError(errorMessage){
        pTagError.textContent = errorMessage;
    }

    function cleanErrorMessage(){
        pTagError.textContent = "";
    }

    function onCLick(){
        let workerName = document.querySelector('input');
        if (workerName.value === ""){
            //mostrar mensaje de error.
            showError("¡ERROR: Ingrese número de puerto!");
        }else{
            let workerstring = workerName.value;

            fetch(urlToHtmlExcelPainted)
                .then((result) => result.text()).then(function(text){

                    let parser = new DOMParser();
                    let doc = parser.parseFromString(text, "text/html");

                    let tabla = doc.getElementsByTagName("table")[0];

                    let cellNodes = tabla.getElementsByTagName("td");

                    let founded = "";
                    for (let i = 0; i<cellNodes.length;i++){
                        let currentData = cellNodes[i].textContent.toString();

                        if (currentData.includes(workerstring)) {
                            founded += "[Nombre: "+currentData+", extension: "+cellNodes[i+1].textContent+"]\n";//firstChild
                        }
                    }         
                    
                    if(founded){
                        fillTextArea(founded);
                    }else{
                        fillTextArea("No coincide!");
                    }

                })
                .catch(function(error) {
                    // This is where you run code if the server returns any errors
                    chrome.tabs.query({currentWindow:true,active:true}, function(tabs){
                        chrome.tabs.sendMessage(tabs[0].id,{type:"error",payload:error.message});
                    });
                });
        }
    }

    document.querySelector('button').addEventListener('click',onCLick,false);

    function whenInputisFocused(){
        cleanErrorMessage();
        cleanTextArea();
    }

    document.querySelector('input').addEventListener('focus',whenInputisFocused,false)


},false);