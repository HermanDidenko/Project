using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Models
{
    public class Publisher
    {
        public int Id { get; set; }

        [Required] public string Name { get; set; } = string.Empty;

        public ICollection<Book> Books { get; set; } = new List<Book>();
    }
}
