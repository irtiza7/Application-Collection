const Controllers = require('./controllers')
const Express = require('express')
const Router = Express.Router()

/*
FE Request URL: http://localhost:4300//api/github/users?searchString={}
BE Request URL: https://api.github.com/search/users?q={}
*/
Router.get('/api/github/users', Controllers.handleGetGithubUsersRequest)

/*
FE Request URL: http://localhost:4300//api/github/followers?login={}
BE Request URL: https://api.github.com/users/{login}/followers
*/
Router.get('/api/github/followers', Controllers.handleGetGithubUserFollowersRequest)

/*
FE Request URL: http://localhost:4300//api/github/user/details?login={}
BE Request URL: https://api.github.com/users/{login}
*/
Router.get('/api/github/user/details', Controllers.handleGetGithubUsersDetailsRequest)

/*
FE Request URL: http://localhost:4300//api/github/user/repos?login={}
BE Request URL: http:https://api.github.com/users/{login}/repos
*/
Router.get('/api/github/repos', Controllers.handleGetGithubUserReposRequest)

module.exports = Router
