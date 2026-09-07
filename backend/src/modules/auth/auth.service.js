import { User } from "../model/user.model.js";

class AuthService {
  async signup(userData) {
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { phone: userData.phone }
      ]
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error("Email already registered");
      }
      if (existingUser.phone === userData.phone) {
        throw new Error("Phone number already registered");
      }
    }

    const user = await User.create(userData);

    const token = user.generateAuthToken();
      
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      token
    };
  }
async login(identifier, password) {
  console.log("identifier:", identifier);
const user = await User.findOne({
  $or: [{ email: identifier }, { phone: identifier }]
}).select("+password");

console.log("USER:", user);




  if (!user) throw new Error("Invalid credentials");

  const isValid = await user.comparePassword(password);

  if (!isValid) throw new Error("Invalid credentials");

  if (!user.isActive)
    throw new Error("Account is deactivated");

  const token = user.generateAuthToken();

  return { user, token };

}
}

export const authService = new AuthService();
