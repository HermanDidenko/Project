using Xunit;
using BookLibrary.Services;
using BookLibrary.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BookLibrary.Tests
{
    public class UserServiceTests
    {
        private UserService GetService(string dbName)
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(dbName)
                .Options;

            var ctx = new LibraryContext(options);
            return new UserService(ctx);
        }

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser()
        {
            var service = GetService("RegisterTest");
            var user = await service.RegisterAsync("john", "123");

            Assert.NotNull(user);
            Assert.Equal("john", user.UserName);
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrow_WhenUserExists()
        {
            var service = GetService("DuplicateUserTest");
            await service.RegisterAsync("alex", "123");

            await Assert.ThrowsAsync<Exception>(async () =>
                await service.RegisterAsync("alex", "123"));
        }

        [Fact]
        public async Task CheckPassword_ShouldReturnTrue_ForValidPassword()
        {
            var service = GetService("PasswordTest");
            var user = await service.RegisterAsync("testuser", "myPassword");

            Assert.True(service.CheckPassword("myPassword", user.PasswordHash));
        }

        [Fact]
        public async Task CheckPassword_ShouldReturnFalse_ForInvalidPassword()
        {
            var service = GetService("PasswordTestInvalid");
            var user = await service.RegisterAsync("testuser2", "myPassword");

            Assert.False(service.CheckPassword("wrongPassword", user.PasswordHash));
        }
    }
}
