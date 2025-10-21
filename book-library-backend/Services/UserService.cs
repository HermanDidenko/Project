using BookLibrary.Models;
using BookLibrary.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace BookLibrary.Services
{
    public class UserService
    {
        private readonly LibraryContext _context;

        public UserService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByUserNameAsync(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        }

        public async Task<User> RegisterAsync(string userName, string password)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == userName))
                throw new Exception("User already exists");

            var hashed = BCrypt.Net.BCrypt.HashPassword(password);
            var user = new User
            {
                UserName = userName,
                PasswordHash = hashed
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public bool CheckPassword(string plainPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword);
        }
    }
}

