const axios = require('axios')
const { UserDetailsModel, ReposModel } = require('./models')
const CONSTANTS = require('../constants')

const headers = {
  /*
  Auth Token for GitHub API
  */
  Authorization: `token ${process.env.PERSONAL_AUTH_TOKEN_FOR_GITHUB_API}`
}

const extractUserFields = function (response) {
  const users = response.data.items
  const usersDataList = users.map(({ id, login, avatar_url }) => {
    return { id, login, avatar_url }
  })
  return usersDataList
}

const extractFollowerFields = function (response) {
  const followers = response.data
  const followersDataList = followers.map(({ id, login, avatar_url }) => {
    return { id, login, avatar_url }
  })
  return followersDataList
}

const extractUserDetailsFields = function (response) {
  const userDetails = response.data
  const { id, login, avatar_url, html_url, name, company, location, email, bio, followers, following, public_repos } = userDetails
  return { id, login, avatar_url, html_url, name, company, location, email, bio, followers, following, public_repos }
}

const extractRepoFields = function (response) {
  const userRepos = response.data
  const repos = userRepos.map(({ id, name, html_url, description }) => {
    return { id, name, html_url, description }
  })
  return repos
}

const mergeUserDetailsAndRepos = function (userDetails, userRepos) {
  return { ...userDetails, repos: userRepos }
}

const fetchUserDetailsAndReposFromGithub = async function (userLogin) {
  const userDetailsURL = `${CONSTANTS.githubBaseURL}/users/${userLogin}`
  const userReposURL = `${CONSTANTS.githubBaseURL}/users/${userLogin}/repos`

  try {
    const [userDetailsResponse, userReposResponse] = await Promise.all([axios.get(userDetailsURL, { headers }), axios.get(userReposURL, { headers })])

    const formattedUsersDetails = extractUserDetailsFields(userDetailsResponse)
    const formattedUserRepos = extractRepoFields(userReposResponse)
    const userDetailsAndRepos = mergeUserDetailsAndRepos(formattedUsersDetails, formattedUserRepos)

    saveUserDetailsAndReposInDB(formattedUsersDetails, formattedUserRepos)
    return userDetailsAndRepos
  } catch (error) {
    throw new Error(`ERROR IN fetchUserDetailsAndReposFromGithub: ${error}`)
  }
}

const fetchUserDetailsAndReposFromDB = async function (userLogin) {
  try {
    const [userDetailsResponse, userReposResponse] = await Promise.all([
      UserDetailsModel.findOne({ where: { login: userLogin } }),
      ReposModel.findAll({ where: { owner: userLogin } })
    ])

    if (userDetailsResponse && userReposResponse) {
      const userDetailsAndRepos = mergeUserDetailsAndRepos(userDetailsResponse.dataValues, userReposResponse)
      return userDetailsAndRepos
    } else {
      return null
    }
  } catch (error) {
    throw new Error(`ERROR IN fetchUserDetailsAndReposFromDB: ${error}`)
  }
}

const saveUserDetailsAndReposInDB = async function (userDetails, userRepos) {
  try {
    await UserDetailsModel.create(userDetails, { ignoreDuplicates: true })
  } catch (error) {
    console.error(`ERROR in saveUserDetailsAndReposInDB - UserModel: ${error}`)
  }
  try {
    const owner = userDetails.login
    userRepos = userRepos.map((repo) => {
      return { ...repo, owner }
    })
    await ReposModel.bulkCreate(userRepos, { ignoreDuplicates: true })
  } catch (error) {
    console.error(`ERROR in saveUserDetailsAndReposInDB - ReposModel: ${error}`)
  }
}

module.exports = {
  extractUserFields,
  extractFollowerFields,
  fetchUserDetailsAndReposFromDB,
  fetchUserDetailsAndReposFromGithub
}
