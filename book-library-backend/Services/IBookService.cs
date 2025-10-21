using BookLibrary.Models;
using BookLibrary.Models.DTOs;

namespace BookLibrary.Services
{
    public interface IBookService
    {
        Task<PagedResult<BookDto>> GetAllBooksDtoAsync(
            string? search,
            string? sort,
            int page,
            int pageSize,
            bool? favoriteOnly = false,
            int? publisherId = null
        );

        Task<Book?> GetBookByIdAsync(int id);
        Task<Book> AddBookAsync(Book book);
        Task<bool> UpdateBookAsync(int id, Book book);
        Task<bool> DeleteBookAsync(int id);
    }
}

