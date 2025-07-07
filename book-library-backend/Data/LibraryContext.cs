using Microsoft.EntityFrameworkCore;
using BookLibrary.Models;
using BookLibrary.Data;


namespace BookLibrary.Data;

public class LibraryContext : DbContext
{
    public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

    public DbSet<Book> Books => Set<Book>();
}
