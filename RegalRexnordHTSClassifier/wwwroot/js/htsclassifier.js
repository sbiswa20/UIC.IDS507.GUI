
/* global variable for last li clicked */
var lastClickedLi = null;

var incomplete = null;
var complete = null;
var toolTip = null;
var instruction = null;

function cleanEmptyChildren(data) {
    data.forEach(function (item) {
        if (item.Children && item.Children.length > 0) {
            cleanEmptyChildren(item.Children);  // Recursive call for non-empty Children arrays
        } else {
            delete item.Children;  // Remove empty Children arrays
        }
    });
}

function renderList(data, root, isRoot = true) {
    const ul = document.createElement('ul');
    if (!isRoot) {
        ul.classList.add('hidden'); // Start with child lists hidden
    }

    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.Description;
        li.id = item.Id;
        li.title = toolTip;


        li.addEventListener('mousedown', function (event) {
            // Prevent text selection
            event.preventDefault();
            this.classList.add('li-mousedown');
            //this.classList.add('li-clicked');
        });

        li.addEventListener('mouseup', function () {
            this.classList.remove('li-mousedown');
        });
        li.addEventListener('mouseleave', function () {
            this.classList.remove('li-mousedown');
        });



        li.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent click from bubbling up to parent elements
            const childUl = this.querySelector('ul');

            if (lastClickedLi) {
                lastClickedLi.classList.remove('li-clicked');
            }

            // Highlight the current li element
            this.classList.add('li-clicked');
            // Update the lastClickedLi to the current li
            lastClickedLi = this;

            if (childUl) {
                childUl.classList.toggle('hidden');
                childUl.classList.toggle('show');
            }
            //alert(this.id);
            populateClassificationCode(this.id);

        });
        ul.appendChild(li);
        if (item.Children && item.Children.length > 0) {
            renderList(item.Children, li, false);
        }
    });
    root.appendChild(ul);
}

function getHTSTree() {

    var useerInput = document.getElementById('htsSearch').value;

    if (useerInput.trim().length > 0) {
        //var restServiceUrl = 'http://localhost:5132/HTSCode/getHTSCodes/';
        var restServiceUrl = 'https://rrhtsclassifierapi.azurewebsites.net/HTSCode/getHTSCodes/';

        var searchParam = useerInput
        if (useerInput.includes(",")) {
            var splituserInput = useerInput.split(",");
            searchParam = useerInput[0];
        }

        restServiceUrl = restServiceUrl + searchParam;
        jsonData = getDataFromServiceAndRenderList(restServiceUrl, useerInput);

    }

}

function getFullHTSTree() {
    try {

        //var allDataServiceUrl = "http://localhost:5132/HTSCode/getAllCodes";
        var allDataServiceUrl = "https://rrhtsclassifierapi.azurewebsites.net/HTSCode/getAllCodes";


        jsonData = getDataFromServiceAndRenderList(allDataServiceUrl, "N/A");

    }
    catch (ex) {
        console.info("Exception in function getFullHTSTree() " + ex)
    }
}

function cleanContainer() {
    document.getElementById('htsCode').value = "";
    const container = document.getElementById('results-div');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}


function getDataFromServiceAndRenderList(url, useerInput) {

    //alert('URL Loaded');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var data = xhttp.responseText;
            //alert("Response = "+data);

            if (data.startsWith("{")) {
                data = "[" + data + "]";
            }

            jsonData = JSON.parse(data);
            const container = document.getElementById('results-div');
            cleanEmptyChildren(jsonData); // Clean the JSON data first
            cleanContainer();
            renderList(jsonData, container); // Then render it

            if (useerInput.includes(',')) {
                unfoldToPath(useerInput)
            }
            else if (useerInput != "N/A") {
                openToMatchedNode(useerInput)

            }


            return data;
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();


}


function populateClassificationCode(hts_code) {
    try {

        hts_code = hts_code.toString().replace(/_/g, "").replace(/X1/g, "").replace(/X2/g, "").replace(/X3/g, "").replace(/X4/g, "").replace(/X5/g, "")

        var len = hts_code.length;

        if (len == 10) {
            //var frst = hts_code.substring(0,4);
            //var sec =  hts_code.substring(5,7);

            hts_code = hts_code.substring(0, 4) + "." + hts_code.substring(4, 6) + "." + hts_code.substring(6, 8) + "." + hts_code.substring(8)

        }
        else if (len == 8) {
            hts_code = hts_code.substring(0, 4) + "." + hts_code.substring(4, 6) + "." + hts_code.substring(6)

        }
        else if (len == 6) {
            hts_code = hts_code.substring(0, 4) + "." + hts_code.substring(4)

        }


        document.getElementById('htsCode').value = hts_code

        var inputElement = document.getElementById('htsCode');
        inputElement.value = hts_code; // Update the value of the textbox

        // Apply styles based on the length of the text
        if (hts_code.length == 13) {
            inputElement.className = 'search-box htsCode-full'; // Apply green and bold style
            document.getElementById('ip_002').textContent = complete;
        } else {
            inputElement.className = 'search-box htsCode-normal'; // Apply red and normal style
            document.getElementById('ip_002').textContent = incomplete;
        }



    }
    catch (ex) {
        alert('Exception in function populateClassificationCode() ' + ex)
    }
}


function clearSearch() {
    document.getElementById('htsSearch').value = ''; // Clears the search box
    document.getElementById('ip_002').textContent = '';
    cleanContainer(); // Clears any results displayed in the results div

    getFullHTSTree();
}



function openToMatchedNode(searchText) {
    var allLis = document.querySelectorAll('#results-div li');
    allLis.forEach(function (li) {
        if (li.textContent.toLowerCase().includes(searchText.toLowerCase())) {
            // Highlight the matched node
            //li.style.backgroundColor = 'lightgreen';  // Optional: Highlight color for matched nodes
            // Open path to this node
            var element = li;
            while (element.parentNode) {
                element = element.parentNode;
                if (element.tagName === 'UL') {
                    //element.style.display = 'block';  // Make sure all parent ULs are visible
                    element.classList.add('show');
                    element.classList.remove('hidden');

                }
            }
        }
    });
}



function unfoldToPath(pathString) {
    const pathParts = pathString.split(',').map(part => part.trim().toLowerCase()); // Split the input string and normalize it
    let currentLevelNodes = document.querySelectorAll('#results-div > ul > li'); // Start with the top-level nodes
    pathParts.forEach(part => {
        let foundNode = Array.from(currentLevelNodes).find(node => node.textContent.toLowerCase().includes(part));
        if (foundNode) {
            revealPath(foundNode); // Function to open the path to this node
            currentLevelNodes = foundNode.querySelectorAll('ul > li'); // Move to the next level of nodes
        } else {
            return; // Exit if no matching node is found at the current level
        }
    });
}

function revealPath(node) {
    while (node) {
        if (node.tagName === 'UL') {
            node.classList.add('show');
            node.classList.remove('hidden');
        }
        node = node.parentNode;
    }
}

function loadConstantValues() {
    try {

        var url = "https://rrhtsclassifierapi.azurewebsites.net/HTSCode/getAllConfigCodes";

        //var url="http://localhost:5132/HTSCode/getAllConfigCodes";

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                var data = xhttp.responseText;
                //alert("Response = "+data);

                assignConfigData(data);


                return data;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();


        //document.getElementById("ip_001").textContent = "Please select the option from below that fits your product."
        //document.getElementById("ip_002").textContent = "Please select the option from below that fits your product."
        //alert('Loadfed');

    }
    catch (ex) {
        console.log("Exception in function  loadConstantValues() " + ex);
    }
}

function assignConfigData(jsonConfigData) {
    try {


        jsonConfigData = JSON.parse(jsonConfigData);
        //alert(jsonConfigData);

        incomplete = jsonConfigData.ID_003;
        complete = jsonConfigData.ID_004;
        toolTip = jsonConfigData.ID_002;
        instruction = jsonConfigData.ID_001;

        //alert(jsonConfigData.ID_002);

        document.getElementById("ip_001").textContent = instruction;
        //document.getElementById("ip_002").textContent = "Please select the option from below that fits your product."
    }
    catch (ex) {
        console.info("Exception in function assignConfigData " + ex);
    }
}


function loadInitialConfiguration() {
    try {

        loadConstantValues();

        getFullHTSTree();



    }
    catch (ex) {
        console.log("Exception in function  loadInitialConfiguration() " + ex);
    }
}



window.addEventListener('load', loadInitialConfiguration);


async function sendEmail() {

    try {

        var formElement = document.getElementById('emailFrom');
        var formData = new FormData(formElement);

        const response = await fetch('https://rrhtsclassifierapi.azurewebsites.net/api/sendEmail/send', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        const data = await response.text();  // or response.json()
        alert('Email sent successfully: ' + data);

        /*
        // Check if any files were selected
        if (!formData.has('Attachments') || formData.get('Attachments').size === 0) {
            // Append an empty file/blob if no attachments are present
            //formData.append('Attachments', new Blob([], { type: 'application/octet-stream' }), 'empty.file');
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://rrhtsclassifierapi.azurewebsites.net/api/sendEmail/send", true);
        //xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('Email sent successfully!');
            } else {
                alert('Failed to send email: ' + xhr.responseText);
            }
        };
        xhr.send(formData);
        */

    }
    catch (ex) {
        console.error('Error during email send:', ex.message);
        alert('Error: ' + ex.message);
    }
}

//alert('Page Loaded');