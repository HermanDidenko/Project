using BookLibrary.Data;
using BookLibrary.Models;
using BookLibrary.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Services
{
    public class BookService : IBookService
    {
        private readonly LibraryContext _context;

        public BookService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<BookDto>> GetAllBooksDtoAsync(
            string? search,
            string? sort,
            int page,
            int pageSize,
            bool? favoriteOnly = false,
            int? publisherId = null)
        {
            var query = _context.Books
             .Include(b => b.Publisher)
             .AsNoTracking()
              .AsQueryable();

            if (favoriteOnly == true)
            {
                query = query.Where(b => b.IsFavorite);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b =>
                    b.Title.Contains(search) ||
                    b.Author.Contains(search) ||
                    b.Genre.Contains(search));
            }
            if (publisherId.HasValue)
            {
                query = query.Where(b => b.PublisherId == publisherId.Value);
            }

            query = sort switch
            {
                "title" => query.OrderBy(b => b.Title),
                "author" => query.OrderBy(b => b.Author),
                "year" => query.OrderBy(b => b.Year),
                "genre" => query.OrderBy(b => b.Genre),
                "pages" => query.OrderBy(b => b.Pages),
                _ => query.OrderBy(b => b.Id)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Year = b.Year,
                    Genre = b.Genre,
                    Pages = b.Pages,
                    IsFavorite = b.IsFavorite,
                    PublisherId = b.PublisherId,
                    PublisherName = b.Publisher != null ? b.Publisher.Name : null
                })
                .ToListAsync();

            return new PagedResult<BookDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
        public async Task<PagedResult<Book>> GetAllBooksAsync(
        string? search,
        string? sort,
        int page,
        int pageSize,
        bool favoriteOnly = false,
        int? publisherId = null)
        {
            var query = _context.Books
                .Include(b => b.Publisher)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b =>
                    b.Title.Contains(search) ||
                    b.Author.Contains(search) ||
                    b.Genre.Contains(search));
            }

            if (favoriteOnly == true)
                query = query.Where(b => b.IsFavorite);

            if (publisherId.HasValue)
                query = query.Where(b => b.PublisherId == publisherId.Value);
            query = (sort ?? string.Empty).ToLower() switch
            {
                "title" => query.OrderBy(b => b.Title),
                "author" => query.OrderBy(b => b.Author),
                "year" => query.OrderBy(b => b.Year),
                "genre" => query.OrderBy(b => b.Genre),
                "pages" => query.OrderBy(b => b.Pages),
                _ => query.OrderBy(b => b.Id)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Book>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<Book?> GetBookByIdAsync(int id)
        {
            return await _context.Books.FindAsync(id);
        }

        public async Task<Book> AddBookAsync(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book;
        }

        public async Task<bool> UpdateBookAsync(int id, Book book)
        {
            if (id != book.Id)
                return false;

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Books.Any(e => e.Id == id))
                    return false;
                else
                    throw;
            }

            return true;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}