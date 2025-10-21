using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using BookLibrary.Controllers;
using BookLibrary.Services;
using BookLibrary.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookLibrary.Tests
{
    public class AuthControllerTests
    {
        private AuthController GetController(string dbName)
        {
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "Jwt:Key", "super_secret_key_super_secret_key" },
                    { "Jwt:Issuer", "BookLibrary" },
                    { "Jwt:Audience", "BookLibrary" }
                })
                .Build();

            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(dbName)
                .Options;

            var ctx = new LibraryContext(options);
            var service = new UserService(ctx);

            return new AuthController(service, config);
        }

        [Fact]
        public async Task Register_ShouldReturnOkResult()
        {
            var controller = GetController("AuthRegTest");
            var result = await controller.Register(new RegisterRequest { UserName = "user1", Password = "pass1" });

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenInvalid()
        {
            var controller = GetController("AuthLoginFail");
            var result = await controller.Login(new LoginRequest { UserName = "no_user", Password = "123" });

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_ShouldReturnToken_WhenValid()
        {
            var controller = GetController("AuthLoginSuccess");

            await controller.Register(new RegisterRequest { UserName = "user", Password = "123" });

            var result = await controller.Login(new LoginRequest { UserName = "user", Password = "123" });
            var okResult = Assert.IsType<OkObjectResult>(result);

            Assert.NotNull(okResult.Value);
        }
    }
}
