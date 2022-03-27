//Resolving Callback hell - async work using callbacks
console.log("Before")
getUser(1, getRepos);
console.log("After")

function getRepos(user){
    getRepos(user.gitHubUsername, getCommits)
}

function getCommits(repos) {
    getCommits(repo, displayCommits)
}

function displayCommits(commits) {
    console.log(commits)
}


function getUser(id, callback) {
    setTimeout(() => {
        console.log("Reading a user from db...")
        callback({ id: id, gitHubUsername: "silviu"})
    }, 2000)

}

function displayRepos(username, callback){
    setTimeout(() => {
        console.log("Calling github API...")
        callback(["repo1", "repo2", "repo3"])
    }, 2000)
}

console.log("Before")
const consumer = getUser(1);
consumer.then((user) => {
    console.log(user)
}).catch()

//Promises
getUser(1)
    .then(user => getRepos(user.gitHubUsername))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log(commits))
    .catch(err => console.log('Error', err.message));

// Async and Await approach
async function displayCommits() {
    try{
        const user = await getUser(1);
        const repos = await getRepos(user.gitHubUsername);
        const commits = await getCommits(repos[0]);
        console.log(commits)
    }
    catch (err) {
        console.log(err.message)
    }
}

displayCommits();

console.log("After")

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading a user from db...")
            resolve({ id: id, gitHubUsername: "silviu"})
        }, 2000)
    })
}

function getRepos(username){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling github API...")
            resolve(["repo1", "repo2", "repo3"])
        }, 2000)
    })

}

function getCommits(username){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Fetching commits...")
            resolve(["commit1", "commit2", "commit3"])
        }, 2000)
    })

}