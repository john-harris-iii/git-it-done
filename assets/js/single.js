//DOM Elements
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

function getRepoName(){
    //get repo name from query string in URL using location object
    var queryString = document.location.search;
    //split string into array 
    var repoName = queryString.split("=")[1];
    //if repoName exists pass it through the function
    if(repoName){
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    }
    //if reponame doesn't exist (no query parameter) redirect to index with location object
    else{
        document.location.replace("./index.html");
    }
    
};

function getRepoIssues(repo){
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response){
        //response was succesful
        if(response.ok){
            response.json().then(function(data){
                //pass response data to dom function
                displayIssues(data);

                //check if API has paginated issues
                if(response.headers.get("Link")){
                    displayWarning(repo);
                }
            })
        }
        else{
            document.location.replace("./index.html");
        }
    })
};

function displayWarning(repo){
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("targer", "_blank");

    limitWarningEl.appendChild(linkEl);
};

function displayIssues(issues){
    //if repo has no issues
    if(issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    //loop over response data
    for(var i = 0; i < issues.length; i++){
        //create an anchor element for each issue
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create a span element to hold issue title inside anchor
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to anchor
        issueEl.appendChild(titleEl);

        //create a span element for the issue type
        var typeEl = document.createElement("span");
        //check if issue is an issue or pull request
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        }
        else{
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEl.appendChild(typeEl);

        //append to HTML
        issueContainerEl.appendChild(issueEl);
    }
};


getRepoName();