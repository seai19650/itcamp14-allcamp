export default new class User {
  getUsersEnergyByHouse = (users, house, systemEnv) => {
    let energy = 0
    Object.keys(users).forEach((user) => {
      if (users[user].house === house) {
        if (systemEnv.consumption.house === null) {
          energy += users[user].energy
        } else {
          if (!systemEnv.consumption.house.includes(users[user].house)) {
            energy += users[user].energy
          }
        }
      }
    })
    return energy
  }
}()
