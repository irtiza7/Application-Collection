const axios = require('axios')
require('dotenv').config()
const { extractUserFields, extractFollowerFields, fetchUserDetailsAndReposFromGithub, fetchUserDetailsAndReposFromDB } = require('./data-handling')
const CONSTANTS = require('../constants')

const headers = {
  /*
  Auth Token for GitHub API
  */
  Authorization: `token ${process.env.PERSONAL_AUTH_TOKEN_FOR_GITHUB_API}`
}

const handleGetGithubUsersRequest = async function (req, res) {
  const { searchString } = req.query
  const url = `${CONSTANTS.githubBaseURL}/search/users?q=${searchString}`

  try {
    const response = await axios.get(url, { headers })
    const formattedUsers = extractUserFields(response)

    /*
      formattedUsers : [{id, login, avatar_url}]
    */
    res.json(formattedUsers)
  } catch (error) {
    console.error(`ERROR in handleGetGithubUsersRequest: ${error}`)
    res.json({
      msg: `${error}`
    })
  }
}

const handleGetGithubUserFollowersRequest = async function (req, res) {
  const { login } = req.query
  const url = `${CONSTANTS.githubBaseURL}/users/${login}/followers`

  try {
    const response = await axios.get(url, { headers })
    const formattedFollowers = extractFollowerFields(response)

    /*
      formattedFollowers : [{id, login, avatar_url}]
    */
    res.json(formattedFollowers)
  } catch (error) {
    console.error(`ERROR in handleGetGithubUserFollowersRequest: ${error}`)
    res.json({
      msg: `${error}`
    })
  }
}

const handleGetGithubUsersDetailsRequest = async function (req, res) {
  try {
    const { login } = req.query

    /*
      Get User Details and Repos from Database
    */
    let userDetailsAndRepos = await fetchUserDetailsAndReposFromDB(login)

    if (!userDetailsAndRepos) {
      /*
        If no record was found in Database,
        Get User Details and Repos from Github API 
      */
      userDetailsAndRepos = await fetchUserDetailsAndReposFromGithub(login)
    }

    /*
      response: {
        id, login, avatar_url, html_url, name, company, location, email, bio, followers, following, 
        repos: [{ id, name, html_url, description }] 
      }
    */
    res.json(userDetailsAndRepos)
  } catch (error) {
    console.error(`ERROR in handleGetGithubUsersDetailsRequest: ${error}`)
    res.json({
      msg: `${error}`
    })
  }
}

const handleGetGithubUserReposRequest = async function (req, res) {
  try {
    res.json({})
  } catch (error) {
    console.error(`ERROR in handleGetGithubUserReposRequest: ${error}`)
    res.json({
      msg: `${error}`
    })
  }
}

module.exports = {
  handleGetGithubUsersRequest,
  handleGetGithubUserReposRequest,
  handleGetGithubUserFollowersRequest,
  handleGetGithubUsersDetailsRequest
}
