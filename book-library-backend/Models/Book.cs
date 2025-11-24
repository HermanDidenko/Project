using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required] public string Title { get; set; } = string.Empty;
        [Required] public string Author { get; set; } = string.Empty;

        public int Year { get; set; }
        [Required] public string Genre { get; set; } = string.Empty;
        public int Pages { get; set; }
        public bool IsFavorite { get; set; }

        public int? PublisherId { get; set; } 
        public Publisher? Publisher { get; set; }   
    }
}

