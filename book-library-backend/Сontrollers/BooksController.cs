using Microsoft.AspNetCore.Mvc;
using BookLibrary.Models;
using BookLibrary.Models.DTOs;
using BookLibrary.Services;
using Microsoft.EntityFrameworkCore;


namespace BookLibrary.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }
        // PATCH: api/Books/5/favorite
        [HttpPatch("{id}/favorite")]
        public async Task<IActionResult> ToggleFavorite(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
                return NotFound();

            book.IsFavorite = !book.IsFavorite;

            await _bookService.UpdateBookAsync(id, book);

            return Ok(new { id = book.Id, isFavorite = book.IsFavorite });
        }
        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<PagedResult<BookDto>>> GetBooks(
          string? search = null,
          string? sort = null,
          int page = 1,
          int pageSize = 10,
          bool? favoriteOnly = null,
          int? publisherId = null)
        {
            var result = await _bookService.GetAllBooksDtoAsync(search, sort, page, pageSize, favoriteOnly, publisherId);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBookById(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
                return NotFound();
            return Ok(book);
        }


        // POST: api/Book
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            var createdBook = await _bookService.AddBookAsync(book);
            return CreatedAtAction(nameof(GetBookById), new { id = createdBook.Id }, createdBook);
        }

        // PUT: api/Books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            var updated = await _bookService.UpdateBookAsync(id, book);
            if (!updated)
                return NotFound();

            return NoContent();
        }


        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var deleted = await _bookService.DeleteBookAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
