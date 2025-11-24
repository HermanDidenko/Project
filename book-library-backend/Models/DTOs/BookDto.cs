namespace BookLibrary.Models.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Genre { get; set; } = string.Empty;
        public int Pages { get; set; }
        public bool IsFavorite { get; set; }
        public int? PublisherId { get; set; }
        public string? PublisherName { get; set; }
    }
}
