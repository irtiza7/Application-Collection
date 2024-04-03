const { DataTypes } = require('sequelize')
const sequelize = require('./db-connection')

const UserDetailsModel = sequelize.define(
  'user_details',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    html_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    followers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    following: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    public_repos: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'UserDetails'
  }
)

const ReposModel = sequelize.define(
  'repos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    html_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Repos',
    timestamps: false
  }
)

authenticateConnection()
  .then(() => {
    syncSequelize()
  })
  .catch((error) => {
    console.log(`ERROR WHILE APPLYING DATA OPERATIONS: ${error}`)
  })

async function authenticateConnection() {
  try {
    await sequelize.authenticate()
  } catch (error) {
    console.error(`ERROR WHILE AUTHENTICATING DB CONNCETION: ${error}`)
  }
}

async function syncSequelize() {
  try {
    await sequelize.sync({ alter: true, force: false })
  } catch (error) {
    console.error(`ERROR WHILE SYNCING SEQUELIZE: ${error}`)
  }
}

module.exports = {
  UserDetailsModel,
  ReposModel
}
