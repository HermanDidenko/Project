using BookLibrary.Data;
using BookLibrary.Models;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Services
{
    public class PublisherService : IPublisherService
    {
        private readonly LibraryContext _context;

        public PublisherService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<List<Publisher>> GetAllAsync()
        {
            return await _context.Publishers
                .AsNoTracking()
                .OrderBy(p => p.Name)
                .ToListAsync();
        }

        public async Task<Publisher?> GetByIdAsync(int id) =>
            await _context.Publishers.FindAsync(id);

        public async Task<Publisher> CreateAsync(Publisher publisher)
        {
            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();
            return publisher;
        }

        public async Task<bool> UpdateAsync(int id, Publisher publisher)
        {
            var existing = await _context.Publishers.FindAsync(id);
            if (existing == null) return false;

            existing.Name = publisher.Name;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Publishers.FindAsync(id);
            if (existing == null) return false;

            _context.Publishers.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        // ------------------------------------------------------
        // NEW: FIND PUBLISHER BY NAME (for AI Add-To-Library)
        // ------------------------------------------------------
        public async Task<Publisher?> FindByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            return await _context.Publishers
                .FirstOrDefaultAsync(p => p.Name.ToLower() == name.ToLower());
        }
    }
}
