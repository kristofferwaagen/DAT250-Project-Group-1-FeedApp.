// services/userManager.js
const User = require('../models/user');

class UserManager {
  // Hent alle brukere
  async getAllUsers() {
    return await User.find();
  }

  // Hent en spesifikk bruker etter brukernavn
  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  // Opprett en ny bruker
  async createUser(userData) {
    const existingUser = await User.findOne({ 
      $or: [
        {username: userData.username },
        { email: userData.email }
      ]
  });
    if (existingUser) throw new Error('Username or email already exists');
    const newUser = new User(userData);
    return await newUser.save();
  }

  // Oppdater en bruker
  async updateUser(username, updateData) {
    return await User.findOneAndUpdate({ username }, updateData, { new: true }); // new:true returner oppdatert dokument
  }

  // Slett en spesifikk bruker
  async deleteUser(username) {
    return await User.findOneAndDelete({ username });
  }

  // Slett alle brukere
  async deleteAllUsers() {
    return await User.deleteMany();
  }
}

module.exports = UserManager;
