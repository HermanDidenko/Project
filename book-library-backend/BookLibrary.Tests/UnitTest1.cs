using System.Threading.Tasks;
using Xunit;
using BookLibrary.Data;
using BookLibrary.Services;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Tests
{
    public class UnitTest1
    {
        [Fact]
        public async Task CanCreateUserService()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase("TestDb1")
                .Options;

            using var ctx = new LibraryContext(options);
            var svc = new UserService(ctx);

            var user = await svc.RegisterAsync("test_user", "password");
            Assert.NotNull(user);
            Assert.Equal("test_user", user.UserName);

            var fetched = await svc.GetUserByUserNameAsync("test_user");
            Assert.NotNull(fetched);
            Assert.Equal(user.UserName, fetched!.UserName);
        }
        [Fact]
        public async Task Login_Should_Fail_With_Wrong_Password()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase("LoginTest")
                .Options;

            using var ctx = new LibraryContext(options);
            var svc = new UserService(ctx);

            await svc.RegisterAsync("user1", "correct_password");

            var user = await svc.GetUserByUserNameAsync("user1");
            Assert.False(svc.CheckPassword("wrong_password", user!.PasswordHash));
        }
        [Fact]
        public async Task Register_Should_Throw_When_User_Already_Exists()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase("DuplicateUserTest")
                .Options;

            using var ctx = new LibraryContext(options);
            var svc = new UserService(ctx);

            await svc.RegisterAsync("userX", "123");

            await Assert.ThrowsAsync<Exception>(async () =>
                await svc.RegisterAsync("userX", "456")
            );
        }
    }
}

