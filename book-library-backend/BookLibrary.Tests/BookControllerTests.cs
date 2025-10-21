using System;
using System.Reflection;
using BookLibrary.Data;
using Xunit;

namespace BookLibrary.Tests
{
    public class BookControllerTests
    {
        [Fact]
        public void BooksController_Type_Should_Exist_In_Project_Assembly()
        {
            Assembly projectAssembly = typeof(LibraryContext).Assembly;

            Type? booksControllerType = projectAssembly.GetType("BookLibrary.Controllers.BooksController")
                                    ?? projectAssembly.GetType("BookLibrary.Controllers.BookController");

            Assert.NotNull(booksControllerType);
        }

        [Fact]
        public void Controllers_Namespace_Should_Contain_At_Least_One_Controller_Type()
        {
            Assembly projectAssembly = typeof(LibraryContext).Assembly;

            var anyControllers = projectAssembly.GetTypes()
                .Where(t => t.IsClass && t.Namespace == "BookLibrary.Controllers")
                .ToArray();

            Assert.NotEmpty(anyControllers);
        }
    }
}
