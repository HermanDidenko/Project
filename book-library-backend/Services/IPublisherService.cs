using BookLibrary.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookLibrary.Services
{
    public interface IPublisherService
    {
        Task<List<Publisher>> GetAllAsync();
        Task<Publisher?> GetByIdAsync(int id);
        Task<Publisher> CreateAsync(Publisher publisher);
        Task<bool> UpdateAsync(int id, Publisher publisher);
        Task<bool> DeleteAsync(int id);
        Task<Publisher?> FindByNameAsync(string name);
    }
}