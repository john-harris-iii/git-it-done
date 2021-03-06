//DOM elements
var userFormEl = document.querySelector("#user-form");
var userInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

//function to get user repos from github
function getUserRepos(user){
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make request to the url
    fetch(apiUrl).then(function(response){
        //check if username exists
        if(response.ok){
            //convert to JSON
            response.json().then(function(data){
                //send repos and username to displayRepos
                displayRepos(data, user);
            });
        }
        //if username doesn't exist
        else{
            alert("Error: GitHub User Not Found");
        }
    })
    //catch function for errors, attatched to the .then() at the top of the fetch()
    //the function will request data, if the request succeeds the data is returned by then()
    //if the request fails the error is sent to the catch() method
    .catch(function(error){
        alert("Unable to connect to GitHub");
    });
};  

function getFeaturedRepos(language){
    //create apiUrl that retrieves repos in specified language
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    //fetch apiUrl
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data.items, language);
            })
        }
        else{
            alert("Error: GitHub User Not Found");
        }
    })
};

//function for when form is submitted
function formSubmitHandler(event){
    //prevents forms input data from being sent to a URL
    event.preventDefault();
    
    //get value from input element
    var username = userInputEl.value.trim();

    //if username is real
    if(username){
        //send username to get user repo function
        getUserRepos(username);
        //reset input to empty
        userInputEl.value = "";
    }
    //id username is not real
    else{
        alert("Please enter a GitHub username");
    }
};

function displayRepos(repos, searchTerm){
    //check if api returned has any repos
    if(repos.length === 0){
        repoContainerEl.textContent = "No repositories found.";
    }

    //clear old content
    repoContainerEl.textContent = "";
    //put search term in reposearchterm span
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for(var i = 0; i < repos.length; i++){
        //formate repo name. owner.login gives username and .name gives repo name 
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo, an anchor for linking to new page
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //in the link create a query parameter called repo that is equal to the value of repoName
        //when a link is clicked it leads to new html page with ?repo=" + repoName in the URL
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append span to container
        repoEl.appendChild(titleEl);

        //create a status element for github issues
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center"

        //check if current repo has issued
        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else{
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append conatiner to the dom
        repoContainerEl.appendChild(repoEl);
    };
};

function buttonClickHandler(event){
    var language = event.target.getAttribute("data-language");
    
    if(language){
        getFeaturedRepos(language);

        repoContainerEl.textContent = "";
    }
};

//event listener for when a form is submitted
userFormEl.addEventListener("submit", formSubmitHandler);

//event listener for when a language button is clicked
languageButtonsEl.addEventListener("click", buttonClickHandler);