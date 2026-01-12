export enum RoleEnum {
  Admin = 99,
  User = 1,
}

/**
 * Represents a user entity within the domain layer.
 *
 * @property id - Unique identifier for the user.
 * @property username - The user's username.
 * @property hashedPassword - The user's hashed password (private, only accessible via method).
 * @property role - The user's role within the system.
 * @property createdAt - Timestamp when the user was created.
 * @property updatedAt - Timestamp when the user was last updated.
 * @property lastLogin - Optional timestamp of the user's last login.
 */
export class UserEntity {
  constructor(
    public readonly id: number, // Public but readonly - cannot be changed
    private _username: string, // Private - has business rule
    private readonly _hashedPassword: string,
    public role: RoleEnum, // Public - can be changed
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly lastLogin?: Date,
  ) {}

  get username(): string {
    return this._username
  }

  get hashedPassword(): string {
    return this._hashedPassword
  }

  /**
   * Updates the username of the user.
   *
   * @param newUsername - The new username to set. Must be at least 3 characters long.
   * @throws {Error} If the new username is shorter than 3 characters.
   */
  set username(newUsername: string) {
    if (newUsername.length < 3) {
      throw new Error('Username must be at least 3 characters long.')
    }
    this._username = newUsername
  }
}
