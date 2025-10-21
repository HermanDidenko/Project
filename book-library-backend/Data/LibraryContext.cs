using BookLibrary.Models;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<Publisher> Publishers => Set<Publisher>();
        public DbSet<User> Users => Set<User>();  

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>(e =>
            {
                e.Property(x => x.Title).IsRequired();
                e.Property(x => x.Author).IsRequired();
                e.Property(x => x.Genre).IsRequired();
            });

            modelBuilder.Entity<Publisher>(e =>
            {
                e.Property(x => x.Name).IsRequired();
            });

            modelBuilder.Entity<Book>()
                .HasOne(b => b.Publisher)
                .WithMany(p => p.Books)
                .HasForeignKey(b => b.PublisherId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}


